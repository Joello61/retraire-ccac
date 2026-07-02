// app/api/registration/route.ts
// Route API Next.js pour traiter les inscriptions et envoyer les emails via Mailjet

import { NextRequest, NextResponse } from "next/server";
import { Client, SendEmailV3_1, LibraryResponse } from "node-mailjet";
import { render } from "@react-email/render";
import RegistrationAdmin from "@/components/emails/RegistrationAdmin";
import RegistrationConfirmation from "@/components/emails/RegistrationConfirmation";

//-------------------------------------------------------------------------
// Types
//-------------------------------------------------------------------------

type AttendanceChoice = "present" | "absent";

interface RegistrationPayload {
  fullName: string;
  email: string;
  phone?: string;
  attendance: AttendanceChoice;
  adultsCount?: number;
  childrenCount?: number;
  participantNames?: string;
  childrenAges?: string;
  comments?: string;
}

//-------------------------------------------------------------------------
// Config / variables d'environnement
//-------------------------------------------------------------------------
// Note: plus de prefixe NEXT_PUBLIC_ sur des variables serveur-only.

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[registration] Variable d'environnement manquante: ${name}`);
  }
  return value;
}

// Ces valeurs sont resolues au premier appel du module. Si une variable
// manque, le déploiement échoue bruyamment au lieu d'envoyer des emails
// vers "undefined".
const MJ_APIKEY_PUBLIC = getRequiredEnv("MJ_APIKEY_PUBLIC");
const MJ_APIKEY_PRIVATE = getRequiredEnv("MJ_APIKEY_PRIVATE");
const ADMIN_EMAIL = getRequiredEnv("ADMIN_EMAIL");
const FROM_EMAIL = getRequiredEnv("FROM_EMAIL");
const FROM_NAME = process.env.FROM_NAME ?? "Retraite des Couples CCAC";

const mailjet = new Client({
  apiKey: MJ_APIKEY_PUBLIC,
  apiSecret: MJ_APIKEY_PRIVATE,
});

//-------------------------------------------------------------------------
// Rate limiting (en mémoire, best-effort)
//-------------------------------------------------------------------------
// Limitation connue: sur un déploiement serverless multi-instance (Vercel),
// ce store n'est pas partagé entre les instances. Pour une protection
// robuste en production, remplacer par Upstash Redis (@upstash/ratelimit)
// ou une solution équivalente. Pour un formulaire d'événement à faible
// trafic, ce garde-fou basique reste largement suffisant.

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;

const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return false;
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

//-------------------------------------------------------------------------
// Validation
//-------------------------------------------------------------------------

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  return /^[0-9+\s()-]{8,20}$/.test(phone);
}

function parseCount(value: unknown): number | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

function validatePayload(
  body: unknown
): { valid: true; data: RegistrationPayload } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Corps de la requete invalide." };
  }

  const b = body as Record<string, unknown>;

  if (!b.fullName || typeof b.fullName !== "string" || b.fullName.trim() === "") {
    return { valid: false, error: "Le champ 'fullName' est requis." };
  }

  if (!b.email || typeof b.email !== "string" || !isValidEmail(b.email)) {
    return { valid: false, error: "Le champ 'email' est invalide." };
  }

  if (b.attendance !== "present" && b.attendance !== "absent") {
    return { valid: false, error: "Le champ 'attendance' doit etre 'present' ou 'absent'." };
  }

  if (typeof b.phone === "string" && b.phone.trim() !== "" && !isValidPhone(b.phone.trim())) {
    return { valid: false, error: "Le champ 'phone' est invalide." };
  }

  return {
    valid: true,
    data: {
      fullName: b.fullName.trim(),
      email: b.email.trim().toLowerCase(),
      phone: typeof b.phone === "string" ? b.phone.trim() : undefined,
      attendance: b.attendance,
      adultsCount: parseCount(b.adultsCount),
      childrenCount: parseCount(b.childrenCount),
      participantNames: typeof b.participantNames === "string" ? b.participantNames.trim() : undefined,
      childrenAges: typeof b.childrenAges === "string" ? b.childrenAges.trim() : undefined,
      comments: typeof b.comments === "string" ? b.comments.trim() : undefined,
    },
  };
}

//-------------------------------------------------------------------------
// Texte brut (fallback pour clients mail sans HTML)
//-------------------------------------------------------------------------

function buildConfirmationText(data: RegistrationPayload): string {
  return `Bonjour ${data.fullName},

Votre reponse a bien ete enregistree pour la Retraite des Couples CCAC.
Statut: ${data.attendance === "present" ? "Presence confirmee" : "Absence signalee"}

Merci,
${FROM_NAME}`;
}

function buildAdminText(data: RegistrationPayload, submittedAt: string): string {
  return `Nouvelle reponse recue le ${submittedAt}.

Nom: ${data.fullName}
Email: ${data.email}
Telephone: ${data.phone ?? "N/A"}
Presence: ${data.attendance}
Adultes: ${data.adultsCount ?? "N/A"}
Enfants: ${data.childrenCount ?? "N/A"}
Participants: ${data.participantNames ?? "N/A"}
Ages des enfants: ${data.childrenAges ?? "N/A"}
Commentaires: ${data.comments ?? "N/A"}`;
}

//-------------------------------------------------------------------------
// POST /api/registration
//-------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, message: "Trop de requetes. Merci de reessayer plus tard." },
      { status: 429 }
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Impossible de lire le corps de la requete." },
      { status: 400 }
    );
  }

  // Validate
  const validation = validatePayload(body);
  if (!validation.valid) {
    return NextResponse.json(
      { success: false, message: validation.error },
      { status: 422 }
    );
  }

  const data = validation.data;
  const submittedAt = new Date().toISOString();

  // Les composants email attendent adultsCount/childrenCount en string
  // (props d'affichage), alors que RegistrationPayload les garde en number
  // pour la validation. On convertit uniquement au moment du rendu.
  const emailProps = {
    ...data,
    adultsCount: data.adultsCount !== undefined ? String(data.adultsCount) : undefined,
    childrenCount: data.childrenCount !== undefined ? String(data.childrenCount) : undefined,
  };

  // Render emails
  const [adminHtml, confirmationHtml] = await Promise.all([
    render(
      RegistrationAdmin({
        ...emailProps,
        submittedAt,
      })
    ),
    render(
      RegistrationConfirmation({
        ...emailProps,
      })
    ),
  ]);

  // Subjects
  const adminSubject =
    data.attendance === "present"
      ? `Nouvelle inscription - ${data.fullName}`
      : `Absence signalee - ${data.fullName}`;

  const confirmationSubject =
    data.attendance === "present"
      ? "Votre inscription a la Retraite des Couples CCAC est confirmee"
      : "Nous avons bien recu votre reponse - Retraite des Couples CCAC";

  // Send emails via Mailjet
  const emailBody: SendEmailV3_1.Body = {
    Messages: [
      {
        From: { Email: FROM_EMAIL, Name: FROM_NAME },
        To: [{ Email: ADMIN_EMAIL }],
        ReplyTo: { Email: data.email, Name: data.fullName },
        Subject: adminSubject,
        HTMLPart: adminHtml,
        TextPart: buildAdminText(data, submittedAt),
      },
      {
        From: { Email: FROM_EMAIL, Name: FROM_NAME },
        To: [{ Email: data.email, Name: data.fullName }],
        Subject: confirmationSubject,
        HTMLPart: confirmationHtml,
        TextPart: buildConfirmationText(data),
      },
    ],
  };

  try {
    // Typage officiel recommande par la doc node-mailjet: on declare le
    // type de retour attendu via LibraryResponse<SendEmailV3_1.Response>
    // plutot que de caster response.body apres coup.
    // Source: https://www.npmjs.com/package/node-mailjet
    const response: LibraryResponse<SendEmailV3_1.Response> = await mailjet
      .post("send", { version: "v3.1" })
      .request(emailBody);

    // Mailjet peut repondre HTTP 200 avec un statut d'echec partiel par
    // message (ex: l'email admin part mais pas la confirmation). On
    // verifie explicitement chaque message avant de declarer un succes.
    const results = response.body.Messages;
    const failedMessages = results.filter((m) => m.Status !== "success");

    if (failedMessages.length > 0) {
      console.error("[registration] Mailjet statut partiel:", JSON.stringify(results));
      return NextResponse.json(
        {
          success: false,
          message: "Certains emails n'ont pas pu etre envoyes. Merci de reessayer.",
        },
        { status: 502 }
      );
    }

    console.info(`[registration] Inscription enregistree: ${data.fullName} (${data.email})`);
  } catch (err: unknown) {
    console.error("[registration] Mailjet error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { success: false, message: "Une erreur est survenue lors de l'envoi des emails." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, message: "Inscription enregistree avec succes." },
    { status: 200 }
  );
}

// Reject other HTTP methods
export async function GET() {
  return NextResponse.json({ message: "Methode non autorisee." }, { status: 405 });
}
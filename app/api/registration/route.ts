// app/api/registration/route.ts
// Route API Next.js pour traiter les inscriptions, enregistrer chaque
// inscription dans Google Sheets (registre officiel) puis envoyer les
// emails de notification via Mailjet.

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { Client, SendEmailV3_1, LibraryResponse } from "node-mailjet";
import { render } from "@react-email/render";
import RegistrationAdmin from "@/components/emails/RegistrationAdmin";
import RegistrationConfirmation from "@/components/emails/RegistrationConfirmation";
import { appendRegistrationToSheet } from "@/lib/googleSheets";

//-------------------------------------------------------------------------
// Types
//-------------------------------------------------------------------------

type AttendanceChoice = "present" | "absent";
type ParticipantType = "adult" | "child";

interface Participant {
  type: ParticipantType;
  firstName: string;
  lastName: string;
  age?: string; // uniquement pour les enfants
  allergies?: string;
}

interface RegistrationPayload {
  fullName: string;
  email: string;
  phone?: string;
  attendance: AttendanceChoice;
  adultsCount?: number;
  childrenCount?: number;
  participants: Participant[];
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
const MAX_PARTICIPANTS = 30; // garde-fou anti-abus

// Garde-fou mémoire: sans nettoyage, cette Map grossit indéfiniment avec le
// nombre d'IP uniques vues (chaque visiteur ajoute une entrée qui ne
// disparaît jamais). Pour un événement à trafic limité ce n'est pas
// critique, mais on évite une fuite mémoire long terme sur une instance
// serverless qui resterait chaude longtemps.
const MAX_TRACKED_IPS = 5000;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Nettoyage best-effort si la Map devient trop grosse: on retire les
  // entrées dont toutes les requêtes sont hors fenêtre. Simple et suffisant
  // pour ce volume de trafic; pour une protection multi-instance robuste,
  // migrer vers Upstash Redis / Vercel KV.
  if (requestLog.size > MAX_TRACKED_IPS) {
    for (const [key, timestamps] of requestLog) {
      const stillValid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (stillValid.length === 0) {
        requestLog.delete(key);
      } else {
        requestLog.set(key, stillValid);
      }
    }
  }

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
// Note: cette validation manuelle fonctionne mais reste verbeuse. Pour ce
// projet, migrer vers Zod (npm install zod) réduirait sensiblement le code
// ci-dessous et donnerait des types inférés automatiquement — à envisager
// comme prochaine itération plutôt qu'un changement risqué à insérer ici.

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

// Normalise un âge reçu en string ("8") ou en number (8) vers une string.
// Le formulaire front peut envoyer l'un ou l'autre selon l'implémentation
// du champ; on ne veut pas rejeter une inscription valide pour ça.
function normalizeAge(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim() !== "") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return undefined;
}

function validateParticipants(
  value: unknown
): { valid: true; data: Participant[] } | { valid: false; error: string } {
  if (value === undefined) {
    return { valid: true, data: [] };
  }

  if (!Array.isArray(value)) {
    return { valid: false, error: "Le champ 'participants' doit etre une liste." };
  }

  if (value.length > MAX_PARTICIPANTS) {
    return { valid: false, error: "Trop de participants declares." };
  }

  const participants: Participant[] = [];

  for (const raw of value) {
    if (!raw || typeof raw !== "object") {
      return { valid: false, error: "Un participant est invalide." };
    }
    const p = raw as Record<string, unknown>;

    if (p.type !== "adult" && p.type !== "child") {
      return { valid: false, error: "Le type d'un participant doit etre 'adult' ou 'child'." };
    }
    if (typeof p.firstName !== "string" || p.firstName.trim() === "") {
      return { valid: false, error: "Le prenom d'un participant est requis." };
    }
    if (typeof p.lastName !== "string" || p.lastName.trim() === "") {
      return { valid: false, error: "Le nom d'un participant est requis." };
    }

    const age = normalizeAge(p.age);
    if (p.type === "child" && !age) {
      return { valid: false, error: "L'age est requis pour chaque enfant." };
    }

    participants.push({
      type: p.type,
      firstName: p.firstName.trim(),
      lastName: p.lastName.trim(),
      age,
      allergies: typeof p.allergies === "string" && p.allergies.trim() !== "" ? p.allergies.trim() : undefined,
    });
  }

  return { valid: true, data: participants };
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

  const participantsResult = validateParticipants(b.participants);
  if (!participantsResult.valid) {
    return { valid: false, error: participantsResult.error };
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
      participants: participantsResult.data,
      comments: typeof b.comments === "string" ? b.comments.trim() : undefined,
    },
  };
}

//-------------------------------------------------------------------------
// Texte brut (fallback pour clients mail sans HTML)
//-------------------------------------------------------------------------

function formatParticipantLine(p: Participant): string {
  const parts = [`${p.firstName} ${p.lastName}`];
  if (p.type === "child" && p.age) parts.push(`${p.age} ans`);
  if (p.allergies) parts.push(`allergies/notes: ${p.allergies}`);
  return parts.join(" - ");
}

function buildConfirmationText(data: RegistrationPayload): string {
  const adults = data.participants.filter((p) => p.type === "adult");
  const children = data.participants.filter((p) => p.type === "child");

  const lines = [
    `Bonjour ${data.fullName},`,
    "",
    "Votre reponse a bien ete enregistree pour la Retraite des Couples CCAC.",
    `Statut: ${data.attendance === "present" ? "Presence confirmee" : "Absence signalee"}`,
  ];

  if (adults.length > 0) {
    lines.push("", "Adultes:", ...adults.map((p) => `- ${formatParticipantLine(p)}`));
  }
  if (children.length > 0) {
    lines.push("", "Enfants:", ...children.map((p) => `- ${formatParticipantLine(p)}`));
  }
  if (data.comments) {
    lines.push("", `Informations complementaires: ${data.comments}`);
  }

  lines.push("", "Merci,", FROM_NAME);
  return lines.join("\n");
}

function buildAdminText(
  data: RegistrationPayload,
  submittedAt: string,
  registrationId: string
): string {
  const adults = data.participants.filter((p) => p.type === "adult");
  const children = data.participants.filter((p) => p.type === "child");

  const lines = [
    `Nouvelle reponse recue le ${submittedAt}.`,
    `ID d'inscription: ${registrationId}`,
    "",
    `Nom: ${data.fullName}`,
    `Email: ${data.email}`,
    `Telephone: ${data.phone ?? "N/A"}`,
    `Presence: ${data.attendance}`,
    `Adultes: ${data.adultsCount ?? adults.length}`,
    `Enfants: ${data.childrenCount ?? children.length}`,
  ];

  if (adults.length > 0) {
    lines.push("", "Details adultes:", ...adults.map((p) => `- ${formatParticipantLine(p)}`));
  }
  if (children.length > 0) {
    lines.push("", "Details enfants:", ...children.map((p) => `- ${formatParticipantLine(p)}`));
  }

  lines.push("", `Informations complementaires: ${data.comments ?? "N/A"}`);
  return lines.join("\n");
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

  // Un seul ID par inscription, réutilisé dans le Sheet et les deux emails.
  // Ça permet de recouper une ligne du registre avec les emails envoyés
  // pour la même soumission (support, doublons, corrections).
  const registrationId = randomUUID();

  // ---------------------------------------------------------------------
  // 1) Google Sheets d'abord: c'est le registre officiel des participants.
  // ---------------------------------------------------------------------
  // Si l'écriture échoue, on bloque l'inscription plutôt que d'envoyer des
  // emails de confirmation pour une personne absente du registre. C'est
  // l'inverse du comportement précédent (emails "faisant foi"): un email
  // envoyé sans ligne dans le Sheet est plus difficile à rattraper qu'un
  // email en retard pour une inscription déjà enregistrée.
  const sheetResult = await appendRegistrationToSheet(
    {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      attendance: data.attendance,
      participants: data.participants,
      comments: data.comments,
      adultsCount: data.adultsCount,
      childrenCount: data.childrenCount,
    },
    submittedAt,
    registrationId
  );

  if (!sheetResult.success) {
    console.error(
      `[registration] Echec critique: inscription non enregistree dans le Sheet pour ${data.fullName} (${data.email}). Raison: ${sheetResult.error}`
    );
    return NextResponse.json(
      {
        success: false,
        message: "Impossible d'enregistrer votre inscription pour le moment. Merci de reessayer dans quelques instants.",
      },
      { status: 502 }
    );
  }

  // ---------------------------------------------------------------------
  // 2) Emails de notification (best-effort). L'inscription est déjà
  //    enregistrée à ce stade: un échec d'envoi n'annule pas l'inscription,
  //    on informe simplement l'utilisateur que le mail de confirmation
  //    pourrait tarder.
  // ---------------------------------------------------------------------

  // Les composants email attendent adultsCount/childrenCount en string
  // (props d'affichage), alors que RegistrationPayload les garde en number
  // pour la validation. On convertit uniquement au moment du rendu.
  const emailProps = {
    ...data,
    adultsCount: data.adultsCount !== undefined ? String(data.adultsCount) : undefined,
    childrenCount: data.childrenCount !== undefined ? String(data.childrenCount) : undefined,
  };

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

  const adminSubject =
    data.attendance === "present"
      ? `Nouvelle inscription - ${data.fullName}`
      : `Absence signalee - ${data.fullName}`;

  const confirmationSubject =
    data.attendance === "present"
      ? "Votre inscription a la Retraite des Couples CCAC est confirmee"
      : "Nous avons bien recu votre reponse - Retraite des Couples CCAC";

  const emailBody: SendEmailV3_1.Body = {
    Messages: [
      {
        From: { Email: FROM_EMAIL, Name: FROM_NAME },
        To: [{ Email: ADMIN_EMAIL }],
        ReplyTo: { Email: data.email, Name: data.fullName },
        Subject: adminSubject,
        HTMLPart: adminHtml,
        TextPart: buildAdminText(data, submittedAt, registrationId),
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
      console.error(
        `[registration] Inscription ${registrationId} enregistree mais statut Mailjet partiel:`,
        JSON.stringify(results)
      );
      // L'inscription est deja actee dans le Sheet: on ne fait pas echouer
      // la requete pour l'utilisateur, mais on le previent que le mail
      // peut tarder plutot que de lui promettre une confirmation envoyee.
      return NextResponse.json(
        {
          success: true,
          message:
            "Votre inscription a bien ete enregistree. L'email de confirmation pourrait toutefois prendre quelques minutes a arriver.",
        },
        { status: 200 }
      );
    }

    console.info(
      `[registration] Inscription ${registrationId} enregistree et emails envoyes: ${data.fullName} (${data.email})`
    );
  } catch (err: unknown) {
    console.error(
      `[registration] Inscription ${registrationId} enregistree mais erreur Mailjet:`,
      err instanceof Error ? err.message : err
    );
    return NextResponse.json(
      {
        success: true,
        message:
          "Votre inscription a bien ete enregistree. L'email de confirmation pourrait toutefois prendre quelques minutes a arriver.",
      },
      { status: 200 }
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
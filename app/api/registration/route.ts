// app/api/registration/route.ts
// Route API Next.js pour traiter les inscriptions et envoyer les emails via Mailjet

import { NextRequest, NextResponse } from "next/server";
import { Client, SendEmailV3_1 } from "node-mailjet";
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
  adultsCount?: string;
  childrenCount?: string;
  participantNames?: string;
  childrenAges?: string;
  comments?: string;
}

//-------------------------------------------------------------------------
// Config
//-------------------------------------------------------------------------

const mailjet = new Client({
  apiKey: process.env.MJ_APIKEY_PUBLIC!,
  apiSecret: process.env.MJ_APIKEY_PRIVATE!,
});

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "admin@ccac.com";
const FROM_EMAIL = process.env.NEXT_PUBLIC_FROM_EMAIL ?? "noreply@ccac.com";
const FROM_NAME = process.env.NEXT_PUBLIC_FROM_NAME ?? "Retraite des Couples CCAC";

//-------------------------------------------------------------------------
// Validation
//-------------------------------------------------------------------------

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  return {
    valid: true,
    data: {
      fullName: b.fullName.trim(),
      email: b.email.trim().toLowerCase(),
      phone: typeof b.phone === "string" ? b.phone.trim() : undefined,
      attendance: b.attendance,
      adultsCount: typeof b.adultsCount === "string" ? b.adultsCount : undefined,
      childrenCount: typeof b.childrenCount === "string" ? b.childrenCount : undefined,
      participantNames: typeof b.participantNames === "string" ? b.participantNames.trim() : undefined,
      childrenAges: typeof b.childrenAges === "string" ? b.childrenAges.trim() : undefined,
      comments: typeof b.comments === "string" ? b.comments.trim() : undefined,
    },
  };
}

//-------------------------------------------------------------------------
// POST /api/registration
//-------------------------------------------------------------------------

export async function POST(request: NextRequest) {
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

  // Render emails
  const [adminHtml, confirmationHtml] = await Promise.all([
    render(
      RegistrationAdmin({
        ...data,
        submittedAt,
      })
    ),
    render(
      RegistrationConfirmation({
        ...data,
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
      },
      {
        From: { Email: FROM_EMAIL, Name: FROM_NAME },
        To: [{ Email: data.email, Name: data.fullName }],
        Subject: confirmationSubject,
        HTMLPart: confirmationHtml,
      },
    ],
  };

  try {
    await mailjet
      .post("send", { version: "v3.1" })
      .request(emailBody);
  } catch (err) {
    console.error("[registration] Mailjet error:", err);
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
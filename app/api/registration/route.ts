// app/api/registration/route.ts
// Route API Next.js pour traiter les inscriptions et envoyer les emails via Resend

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import RegistrationAdmin from "@/components/emails/RegistrationAdmin";
import RegistrationConfirmation from "@/components/emails/RegistrationConfirmation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "admin@ccac.com";
const FROM_EMAIL = process.env.NEXT_PUBLIC_FROM_EMAIL ?? "noreply@ccac.com";
const FROM_NAME = process.env.NEXT_PUBLIC_FROM_NAME ?? "Retraite des Couples CCAC";

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePayload(
  body: unknown
): { valid: true; data: RegistrationPayload } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Corps de la requête invalide." };
  }

  const b = body as Record<string, unknown>;

  if (!b.fullName || typeof b.fullName !== "string" || b.fullName.trim() === "") {
    return { valid: false, error: "Le champ 'fullName' est requis." };
  }

  if (!b.email || typeof b.email !== "string" || !isValidEmail(b.email)) {
    return { valid: false, error: "Le champ 'email' est invalide." };
  }

  if (b.attendance !== "present" && b.attendance !== "absent") {
    return { valid: false, error: "Le champ 'attendance' doit être 'present' ou 'absent'." };
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

// ---------------------------------------------------------------------------
// POST /api/registration
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  // -- Parse body --
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Impossible de lire le corps de la requête." },
      { status: 400 }
    );
  }

  // -- Validate --
  const validation = validatePayload(body);
  if (!validation.valid) {
    return NextResponse.json(
      { success: false, message: validation.error },
      { status: 422 }
    );
  }

  const data = validation.data;
  const submittedAt = new Date().toISOString();

  // -- Render emails --
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

  // -- Send emails --
  const adminSubject =
    data.attendance === "present"
      ? `✅ Nouvelle inscription - ${data.fullName}`
      : `❌ Absence signalée - ${data.fullName}`;

  const confirmationSubject =
    data.attendance === "present"
      ? "Votre inscription à la Retraite des Couples CCAC est confirmée 🙏"
      : "Nous avons bien reçu votre réponse - Retraite des Couples CCAC";

  const [adminResult, confirmationResult] = await Promise.allSettled([
    resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: adminSubject,
      html: adminHtml,
    }),
    resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: data.email,
      subject: confirmationSubject,
      html: confirmationHtml,
    }),
  ]);

  // -- Handle errors --
  const adminFailed = adminResult.status === "rejected" || adminResult.value.error;
  const confirmationFailed =
    confirmationResult.status === "rejected" || confirmationResult.value.error;

  if (adminFailed && confirmationFailed) {
    console.error("[registration] Admin email error:", adminResult);
    console.error("[registration] Confirmation email error:", confirmationResult);
    return NextResponse.json(
      { success: false, message: "Une erreur est survenue lors de l'envoi des emails." },
      { status: 500 }
    );
  }

  // Partial failures: log but don't block the user
  if (adminFailed) {
    console.error("[registration] Admin email failed (non-blocking):", adminResult);
  }
  if (confirmationFailed) {
    console.error("[registration] Confirmation email failed (non-blocking):", confirmationResult);
  }

  return NextResponse.json(
    { success: true, message: "Inscription enregistrée avec succès." },
    { status: 200 }
  );
}

// Reject other HTTP methods
export async function GET() {
  return NextResponse.json({ message: "Méthode non autorisée." }, { status: 405 });
}
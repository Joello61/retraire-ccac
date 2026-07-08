// emails/RegistrationAdmin.tsx
// Email envoyé à l'administrateur lors d'une nouvelle inscription

import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ParticipantType = "adult" | "child";

interface Participant {
  type: ParticipantType;
  firstName: string;
  lastName: string;
  age?: string;
  allergies?: string;
}

interface RegistrationAdminEmailProps {
  fullName: string;
  email: string;
  phone?: string;
  attendance: "present" | "absent";
  adultsCount?: string;
  childrenCount?: string;
  participants?: Participant[];
  comments?: string;
  submittedAt?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleDateString("fr-CA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <Row style={infoRow}>
      <Column style={labelCol}>
        <Text style={labelText}>{label}</Text>
      </Column>
      <Column style={valueCol}>
        <Text style={valueText}>{value}</Text>
      </Column>
    </Row>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={sectionTitleStyle}>{children}</Text>;
}

function ParticipantCard({ participant, index }: { participant: Participant; index: number }) {
  const fullName = `${participant.firstName} ${participant.lastName}`.trim();
  return (
    <Section style={{ ...participantCard, marginTop: index === 0 ? 0 : 10 }}>
      <Row>
        <Column>
          <Text style={participantName}>{fullName}</Text>
          {participant.type === "child" && participant.age && (
            <Text style={participantMeta}>Âge : {participant.age} ans</Text>
          )}
          {participant.allergies && (
            <Text style={participantAllergy}>Allergies / notes : {participant.allergies}</Text>
          )}
        </Column>
      </Row>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function RegistrationAdmin({
  fullName = "Jean Dupont",
  email = "jean.dupont@email.com",
  phone,
  attendance = "present",
  adultsCount,
  childrenCount,
  participants = [],
  comments,
  submittedAt,
}: RegistrationAdminEmailProps) {
  const isPresent = attendance === "present";
  const adults = participants.filter((p) => p.type === "adult");
  const children = participants.filter((p) => p.type === "child");
  const totalParticipants = isPresent
    ? participants.length ||
      (parseInt(adultsCount || "0") || 0) + (parseInt(childrenCount || "0") || 0)
    : 0;

  return (
    <Html lang="fr">
      <Head />
      <Preview>
        {isPresent
          ? `Nouvelle inscription : ${fullName}`
          : `Absence signalee : ${fullName}`}
      </Preview>

      <Body style={body}>
        <Container style={container}>

          {/* Barre d'accent */}
          <Section style={accentBar} />

          {/* Header */}
          <Section style={{ ...header }}>
            <Text style={headerEyebrow}>Retraite des Couples CCAC</Text>
            <Heading style={headerTitle}>
              {isPresent ? "Nouvelle inscription reçue" : "Absence signalée"}
            </Heading>
            <Text style={headerMeta}>Soumis le {formatDate(submittedAt)}</Text>
          </Section>

          {/* Statut */}
          <Section style={statusBand}>
            <Text style={statusLabel}>Statut</Text>
            <Text style={statusText}>
              {isPresent
                ? `Présence confirmée, ${totalParticipants} participant${totalParticipants > 1 ? "s" : ""}`
                : "Cette personne ne pourra pas assister à l'événement"}
            </Text>
          </Section>

          {/* Contact */}
          <Section style={card}>
            <SectionTitle>Informations de contact</SectionTitle>
            <Hr style={divider} />
            <InfoRow label="Nom complet" value={fullName} />
            <InfoRow label="Adresse email" value={email} />
            <InfoRow label="Téléphone" value={phone || "Non renseigné"} />
          </Section>

          {/* Adultes */}
          {isPresent && adults.length > 0 && (
            <Section style={card}>
              <SectionTitle>Adultes ({adults.length})</SectionTitle>
              <Hr style={divider} />
              {adults.map((p, i) => (
                <ParticipantCard key={`adult-${i}`} participant={p} index={i} />
              ))}
            </Section>
          )}

          {/* Enfants */}
          {isPresent && children.length > 0 && (
            <Section style={card}>
              <SectionTitle>Enfants ({children.length})</SectionTitle>
              <Hr style={divider} />
              {children.map((p, i) => (
                <ParticipantCard key={`child-${i}`} participant={p} index={i} />
              ))}
            </Section>
          )}

          {/* Commentaires */}
          {comments && (
            <Section style={card}>
              <SectionTitle>Informations complémentaires générales</SectionTitle>
              <Hr style={divider} />
              <Text style={blockText}>{comments}</Text>
            </Section>
          )}

          {/* Action */}
          <Section style={actionSection}>
            <Text style={actionText}>
              Répondre à{" "}
              <a href={`mailto:${email}`} style={link}>
                {email}
              </a>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Cet email a été généré automatiquement par le système
              d'inscription de la Retraite des Couples CCAC.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const body: React.CSSProperties = {
  backgroundColor: "#f4f4f5",
  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  margin: 0,
  padding: "32px 16px",
};

const container: React.CSSProperties = {
  maxWidth: 600,
  width: "100%",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: 8,
  overflow: "hidden",
  border: "1px solid #e5e7eb",
};

const accentBar: React.CSSProperties = {
  backgroundColor: "#c9952a",
  height: 4,
};

const header: React.CSSProperties = {
  backgroundColor: "#0f172a",
  padding: "28px 32px 24px",
};

const headerEyebrow: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  margin: "0 0 8px",
};

const headerTitle: React.CSSProperties = {
  color: "#ffffff",
  fontSize: 20,
  fontWeight: 700,
  margin: "0 0 8px",
  lineHeight: 1.3,
};

const headerMeta: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: 12,
  margin: 0,
};

const statusBand: React.CSSProperties = {
  padding: "16px 32px",
  borderBottom: "1px solid #e5e7eb",
};

const statusLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#9ca3af",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  margin: "0 0 4px",
};

const statusText: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: "#0f172a",
  margin: 0,
};

const card: React.CSSProperties = {
  padding: "22px 32px",
  borderBottom: "1px solid #e5e7eb",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#374151",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  margin: "0 0 12px",
};

const divider: React.CSSProperties = {
  borderColor: "#e5e7eb",
  margin: "0 0 16px",
};

const infoRow: React.CSSProperties = {
  marginBottom: 12,
};

const labelCol: React.CSSProperties = {
  width: "36%",
  verticalAlign: "top",
  paddingRight: 12,
};

const valueCol: React.CSSProperties = {
  width: "64%",
  verticalAlign: "top",
};

const labelText: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: "#9ca3af",
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const valueText: React.CSSProperties = {
  fontSize: 14,
  color: "#111827",
  margin: 0,
  fontWeight: 500,
};

const participantCard: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  padding: "12px 14px",
};

const participantName: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: "#111827",
  margin: "0 0 2px",
};

const participantMeta: React.CSSProperties = {
  fontSize: 12,
  color: "#6b7280",
  margin: "0 0 2px",
};

const participantAllergy: React.CSSProperties = {
  fontSize: 12,
  color: "#b45309",
  margin: "4px 0 0",
  fontWeight: 500,
};

const blockText: React.CSSProperties = {
  fontSize: 14,
  color: "#111827",
  margin: 0,
  lineHeight: 1.6,
  backgroundColor: "#f9fafb",
  padding: "10px 12px",
  borderRadius: 6,
  border: "1px solid #e5e7eb",
};

const actionSection: React.CSSProperties = {
  padding: "18px 32px",
  backgroundColor: "#f8fafc",
  borderBottom: "1px solid #e5e7eb",
};

const actionText: React.CSSProperties = {
  fontSize: 13,
  color: "#374151",
  margin: 0,
};

const link: React.CSSProperties = {
  color: "#1e3a5f",
  fontWeight: 600,
  textDecoration: "underline",
};

const footer: React.CSSProperties = {
  padding: "18px 32px",
};

const footerText: React.CSSProperties = {
  fontSize: 11,
  color: "#9ca3af",
  margin: 0,
  textAlign: "center",
  lineHeight: 1.6,
};
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

interface RegistrationAdminEmailProps {
  fullName: string;
  email: string;
  phone?: string;
  attendance: "present" | "absent";
  adultsCount?: string;
  childrenCount?: string;
  participantNames?: string;
  childrenAges?: string;
  comments?: string;
  submittedAt?: string; // ISO date string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso?: string): string {
  if (!iso) return new Date().toLocaleDateString("fr-CA", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
  return new Date(iso).toLocaleDateString("fr-CA", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
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
  return (
    <Text style={sectionTitleStyle}>{children}</Text>
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
  participantNames,
  childrenAges,
  comments,
  submittedAt,
}: RegistrationAdminEmailProps) {
  const isPresent = attendance === "present";
  const totalParticipants =
    isPresent
      ? (parseInt(adultsCount || "0") || 0) + (parseInt(childrenCount || "0") || 0)
      : 0;

  return (
    <Html lang="fr">
      <Head />
      <Preview>
        {isPresent
          ? `✅ Nouvelle inscription - ${fullName}`
          : `❌ Absence signalée - ${fullName}`}
      </Preview>

      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={headerEyebrow}>Retraite des Couples · CCAC</Text>
            <Heading style={headerTitle}>
              {isPresent ? "✅ Nouvelle inscription reçue" : "❌ Absence signalée"}
            </Heading>
            <Text style={headerMeta}>
              Soumis le {formatDate(submittedAt)}
            </Text>
          </Section>

          {/* Badge de statut */}
          <Section style={badgeSection}>
            <Text
              style={{
                ...badge,
                backgroundColor: isPresent ? "#d1fae5" : "#fee2e2",
                color: isPresent ? "#065f46" : "#991b1b",
                borderColor: isPresent ? "#6ee7b7" : "#fca5a5",
              }}
            >
              {isPresent
                ? `🎉 Présent(e) — ${totalParticipants} participant${totalParticipants > 1 ? "s" : ""}`
                : "Cette personne ne pourra pas assister à l'événement"}
            </Text>
          </Section>

          {/* Informations de contact */}
          <Section style={card}>
            <SectionTitle>👤 Informations de contact</SectionTitle>
            <Hr style={divider} />
            <InfoRow label="Nom complet" value={fullName} />
            <InfoRow label="Adresse email" value={email} />
            <InfoRow label="Téléphone" value={phone || "Non renseigné"} />
          </Section>

          {/* Détails de participation (présents seulement) */}
          {isPresent && (
            <Section style={card}>
              <SectionTitle>👥 Participation</SectionTitle>
              <Hr style={divider} />
              <Row style={{ ...infoRow, marginBottom: 0 }}>
                <Column style={{ width: "50%", paddingRight: 8 }}>
                  <Section style={statBox}>
                    <Text style={statNumber}>{adultsCount || "-"}</Text>
                    <Text style={statLabel}>Adulte{parseInt(adultsCount || "0") > 1 ? "s" : ""}</Text>
                  </Section>
                </Column>
                <Column style={{ width: "50%", paddingLeft: 8 }}>
                  <Section style={statBox}>
                    <Text style={statNumber}>{childrenCount || "-"}</Text>
                    <Text style={statLabel}>Enfant{parseInt(childrenCount || "0") > 1 ? "s" : ""}</Text>
                  </Section>
                </Column>
              </Row>

              {participantNames && (
                <>
                  <Hr style={divider} />
                  <Text style={labelText}>Noms des participants</Text>
                  <Text style={blockText}>{participantNames}</Text>
                </>
              )}

              {childrenAges && (
                <>
                  <Hr style={divider} />
                  <Text style={labelText}>Âges des enfants</Text>
                  <Text style={blockText}>{childrenAges}</Text>
                </>
              )}
            </Section>
          )}

          {/* Commentaires */}
          {comments && (
            <Section style={card}>
              <SectionTitle>💬 Commentaires</SectionTitle>
              <Hr style={divider} />
              <Text style={blockText}>{comments}</Text>
            </Section>
          )}

          {/* Action rapide */}
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
              Cet email a été généré automatiquement par le système d&apos;inscription de la Retraite des Couples CCAC.
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
  backgroundColor: "#f3ede4",
  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  margin: 0,
  padding: "32px 0",
};

const container: React.CSSProperties = {
  maxWidth: 600,
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: 16,
  overflow: "hidden",
  border: "1px solid #e2e8f0",
};

const header: React.CSSProperties = {
  backgroundColor: "#0f172a",
  padding: "32px 36px 24px",
};

const headerEyebrow: React.CSSProperties = {
  color: "#c9952a",
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  margin: "0 0 8px",
};

const headerTitle: React.CSSProperties = {
  color: "#ffffff",
  fontSize: 22,
  fontWeight: 700,
  margin: "0 0 8px",
  lineHeight: 1.3,
};

const headerMeta: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: 12,
  margin: 0,
};

const badgeSection: React.CSSProperties = {
  padding: "16px 36px",
  backgroundColor: "#faf8f5",
  borderBottom: "1px solid #e2e8f0",
};

const badge: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 16px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 600,
  border: "1px solid",
  margin: 0,
};

const card: React.CSSProperties = {
  padding: "24px 36px",
  borderBottom: "1px solid #e2e8f0",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#1e3a5f",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  margin: "0 0 12px",
};

const divider: React.CSSProperties = {
  borderColor: "#e2e8f0",
  margin: "0 0 16px",
};

const infoRow: React.CSSProperties = {
  marginBottom: 12,
};

const labelCol: React.CSSProperties = {
  width: "38%",
  verticalAlign: "top",
  paddingRight: 12,
};

const valueCol: React.CSSProperties = {
  width: "62%",
  verticalAlign: "top",
};

const labelText: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#64748b",
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const valueText: React.CSSProperties = {
  fontSize: 14,
  color: "#0f172a",
  margin: 0,
  fontWeight: 500,
};

const blockText: React.CSSProperties = {
  fontSize: 14,
  color: "#0f172a",
  margin: "8px 0 0",
  lineHeight: 1.6,
  backgroundColor: "#f8fafc",
  padding: "12px 14px",
  borderRadius: 8,
  border: "1px solid #e2e8f0",
};

const statBox: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  padding: "14px 16px",
  textAlign: "center",
  margin: "12px 0 0",
};

const statNumber: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  color: "#1e3a5f",
  margin: "0 0 2px",
  lineHeight: 1,
};

const statLabel: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  margin: 0,
  fontWeight: 500,
};

const actionSection: React.CSSProperties = {
  padding: "20px 36px",
  backgroundColor: "#f0f9ff",
  borderBottom: "1px solid #e2e8f0",
};

const actionText: React.CSSProperties = {
  fontSize: 13,
  color: "#0f172a",
  margin: 0,
};

const link: React.CSSProperties = {
  color: "#1e3a5f",
  fontWeight: 600,
};

const footer: React.CSSProperties = {
  padding: "20px 36px",
  backgroundColor: "#f8fafc",
};

const footerText: React.CSSProperties = {
  fontSize: 11,
  color: "#94a3b8",
  margin: 0,
  textAlign: "center",
  lineHeight: 1.6,
};
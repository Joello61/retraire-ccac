// emails/RegistrationConfirmation.tsx
// Email de confirmation envoyé à l'utilisateur après son inscription

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

interface RegistrationConfirmationEmailProps {
  fullName: string;
  email: string;
  attendance: "present" | "absent";
  adultsCount?: string;
  childrenCount?: string;
  participantNames?: string;
  comments?: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <Row style={{ marginBottom: 10 }}>
      <Column style={{ width: 28, verticalAlign: "top", paddingTop: 1 }}>
        <Text style={{ margin: 0, fontSize: 14 }}>{icon}</Text>
      </Column>
      <Column style={{ verticalAlign: "top" }}>
        <Text style={detailLabel}>{label}</Text>
        <Text style={detailValue}>{value}</Text>
      </Column>
    </Row>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function RegistrationConfirmation({
  fullName = "Jean Dupont",
  email = "jean.dupont@email.com",
  attendance = "present",
  adultsCount,
  childrenCount,
  participantNames,
  comments,
}: RegistrationConfirmationEmailProps) {
  const isPresent = attendance === "present";
  const firstName = fullName.split(" ")[0];

  return (
    <Html lang="fr">
      <Head />
      <Preview>
        {isPresent
          ? `Votre inscription est confirmée, ${firstName} ! À très bientôt 🙏`
          : `Nous avons bien reçu votre réponse, ${firstName}`}
      </Preview>

      <Body style={body}>
        <Container style={container}>

          {/* Header avec bande dorée */}
          <Section style={headerAccent} />
          <Section style={header}>
            <Text style={eyebrow}>Retraite des Couples · CCAC</Text>
            <Heading style={headerTitle}>
              {isPresent ? "Votre inscription est confirmée 🙏" : "Nous avons bien reçu votre réponse"}
            </Heading>
          </Section>

          {/* Message d'accueil */}
          <Section style={greetingSection}>
            <Text style={greetingText}>
              Bonjour <strong>{firstName}</strong>,
            </Text>
            {isPresent ? (
              <Text style={bodyText}>
                Nous avons bien reçu votre inscription à la <strong>Retraite des Couples CCAC</strong>.
                Nous sommes ravis de vous accueillir lors de cet événement et avons hâte de vous retrouver.
              </Text>
            ) : (
              <Text style={bodyText}>
                Nous avons bien pris note de votre absence à la <strong>Retraite des Couples CCAC</strong>.
                Nous comprenons que vous ne pouvez pas être parmi nous cette fois-ci, et nous espérons vous retrouver lors d&apos;un prochain événement.
              </Text>
            )}
          </Section>

          {/* Récapitulatif (présents seulement) */}
          {isPresent && (
            <Section style={card}>
              <Text style={cardTitle}>📋 Récapitulatif de votre inscription</Text>
              <Hr style={divider} />

              <DetailRow icon="👤" label="Nom" value={fullName} />
              <DetailRow icon="✉️" label="Email" value={email} />

              {(adultsCount || childrenCount) && (
                <DetailRow
                  icon="👥"
                  label="Participants"
                  value={[
                    adultsCount && `${adultsCount} adulte${parseInt(adultsCount) > 1 ? "s" : ""}`,
                    childrenCount && parseInt(childrenCount) > 0 && `${childrenCount} enfant${parseInt(childrenCount) > 1 ? "s" : ""}`,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                />
              )}

              {participantNames && (
                <DetailRow icon="📝" label="Participants" value={participantNames} />
              )}

              {comments && (
                <DetailRow icon="💬" label="Votre message" value={comments} />
              )}
            </Section>
          )}

          {/* Infos pratiques (présents seulement) */}
          {isPresent && (
            <Section style={infoCard}>
              <Text style={cardTitle}>📌 Informations pratiques</Text>
              <Hr style={divider} />

              <Row style={{ marginBottom: 14 }}>
                <Column style={{ width: 28 }}>
                  <Text style={{ margin: 0, fontSize: 16 }}>🗓️</Text>
                </Column>
                <Column>
                  <Text style={infoItemTitle}>Date & Horaire</Text>
                  <Text style={infoItemBody}>De 8h00 à 18h00 précises</Text>
                </Column>
              </Row>

              <Row>
                <Column style={{ width: 28 }}>
                  <Text style={{ margin: 0, fontSize: 16 }}>📬</Text>
                </Column>
                <Column>
                  <Text style={infoItemTitle}>Questions ?</Text>
                  <Text style={infoItemBody}>
                    N&apos;hésitez pas à nous contacter en répondant directement à cet email.
                  </Text>
                </Column>
              </Row>
            </Section>
          )}

          {/* Message d'au revoir */}
          <Section style={closingSection}>
            <Text style={bodyText}>
              {isPresent
                ? "Nous vous enverrons prochainement tous les détails nécessaires pour la retraite. En attendant, n'hésitez pas à nous contacter si vous avez des questions."
                : "Si votre situation venait à changer, n'hésitez pas à nous contacter."}
            </Text>
            <Text style={signatureText}>
              Avec joie,
              <br />
              <strong>L&apos;équipe CCAC</strong>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Hr style={{ ...divider, marginBottom: 16 }} />
            <Text style={footerText}>
              Cet email de confirmation a été envoyé à <strong>{email}</strong> suite à votre
              inscription sur le site de la Retraite des Couples CCAC.
            </Text>
            <Text style={{ ...footerText, marginTop: 4 }}>
              Si vous n&apos;êtes pas à l&apos;origine de cette inscription, veuillez ignorer cet email.
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
  maxWidth: 580,
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: 16,
  overflow: "hidden",
  border: "1px solid #e2e8f0",
};

const headerAccent: React.CSSProperties = {
  backgroundColor: "#c9952a",
  height: 5,
};

const header: React.CSSProperties = {
  backgroundColor: "#0f172a",
  padding: "28px 36px 24px",
};

const eyebrow: React.CSSProperties = {
  color: "#c9952a",
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  margin: "0 0 10px",
};

const headerTitle: React.CSSProperties = {
  color: "#ffffff",
  fontSize: 20,
  fontWeight: 700,
  margin: 0,
  lineHeight: 1.35,
};

const greetingSection: React.CSSProperties = {
  padding: "28px 36px 20px",
};

const greetingText: React.CSSProperties = {
  fontSize: 16,
  color: "#0f172a",
  margin: "0 0 10px",
};

const bodyText: React.CSSProperties = {
  fontSize: 14,
  color: "#475569",
  lineHeight: 1.7,
  margin: "0 0 10px",
};

const card: React.CSSProperties = {
  margin: "0 36px 20px",
  padding: "20px 22px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
};

const infoCard: React.CSSProperties = {
  margin: "0 36px 20px",
  padding: "20px 22px",
  backgroundColor: "#fffbeb",
  border: "1px solid #fde68a",
  borderRadius: 12,
};

const cardTitle: React.CSSProperties = {
  fontSize: 12,
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

const detailLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  margin: "0 0 2px",
};

const detailValue: React.CSSProperties = {
  fontSize: 14,
  color: "#0f172a",
  margin: 0,
  lineHeight: 1.5,
};

const infoItemTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#0f172a",
  margin: "0 0 2px",
};

const infoItemBody: React.CSSProperties = {
  fontSize: 13,
  color: "#64748b",
  margin: 0,
  lineHeight: 1.5,
};

const closingSection: React.CSSProperties = {
  padding: "8px 36px 24px",
};

const signatureText: React.CSSProperties = {
  fontSize: 14,
  color: "#0f172a",
  margin: "20px 0 0",
  lineHeight: 1.6,
};

const footer: React.CSSProperties = {
  padding: "0 36px 24px",
};

const footerText: React.CSSProperties = {
  fontSize: 11,
  color: "#94a3b8",
  margin: 0,
  lineHeight: 1.6,
};
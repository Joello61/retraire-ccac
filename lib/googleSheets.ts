// src/lib/googleSheets.ts
// Centralise la connexion à Google Sheets et l'ajout des lignes d'inscription.
//
// Nécessite le package "googleapis" (npm install googleapis) et les
// variables d'environnement suivantes :
//   GOOGLE_CLIENT_EMAIL  - email du compte de service (ex: xxx@xxx.iam.gserviceaccount.com)
//   GOOGLE_PRIVATE_KEY   - clé privée du compte de service (avec les \n échappés)
//   GOOGLE_SHEET_ID      - ID du spreadsheet (dans l'URL, entre /d/ et /edit)
//   GOOGLE_SHEET_NAME    - nom de l'onglet cible (optionnel, défaut "Registration")
//
// Le compte de service doit avoir été partagé en éditeur sur le Sheet cible.
//
// En-tête attendu dans le Sheet (colonnes A à N) :
// Date d'inscription | Nom du foyer | Email | Téléphone | Présence |
// Type | Prénom | Nom | Âge | Allergies / Notes | Commentaires généraux |
// ID d'inscription | Nombre d'adultes | Nombre d'enfants

import { google } from "googleapis";

//-------------------------------------------------------------------------
// Types
//-------------------------------------------------------------------------

export type ParticipantType = "adult" | "child";

export interface SheetParticipant {
  type: ParticipantType;
  firstName: string;
  lastName: string;
  age?: string;
  allergies?: string;
}

export interface SheetRegistrationData {
  fullName: string;
  email: string;
  phone?: string;
  attendance: "present" | "absent";
  participants: SheetParticipant[];
  comments?: string;
  // Comptes déclarés dans le formulaire. Si absents, on retombe sur un
  // décompte calculé à partir de `participants`.
  adultsCount?: number;
  childrenCount?: number;
}

// Résultat de l'ajout au Sheet. On ne throw plus silencieusement : l'appelant
// reçoit un statut explicite et peut décider comment réagir (log, retry,
// message à l'utilisateur, etc.).
export interface AppendResult {
  success: boolean;
  registrationId: string;
  error?: string;
}

//-------------------------------------------------------------------------
// Config
//-------------------------------------------------------------------------

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[googleSheets] Variable d'environnement manquante: ${name}`);
  }
  return value;
}

// Les retours à la ligne de la clé privée arrivent souvent échappés
// ("\\n") dans les variables d'environnement (Vercel, fichiers .env...).
// On les restaure avant de les passer au client Google, sinon l'auth échoue.
function getPrivateKey(): string {
  const raw = getRequiredEnv("GOOGLE_PRIVATE_KEY");
  return raw.includes("\\n") ? raw.replace(/\\n/g, "\n") : raw;
}

// Lecture différée de la config: on évite de lire (et donc potentiellement
// throw) les variables d'environnement au moment de l'import du module, ce
// qui peut poser problème pendant certaines étapes de build Next.js où les
// variables ne sont pas encore injectées.
function getSheetConfig() {
  return {
    id: getRequiredEnv("GOOGLE_SHEET_ID"),
    name: process.env.GOOGLE_SHEET_NAME ?? "Registration",
  };
}

// Le client est mis en cache au niveau du module: on évite de recréer une
// connexion JWT à chaque appel de route dans un même environnement serverless.
let cachedSheetsClient: ReturnType<typeof google.sheets> | null = null;

function getSheetsClient() {
  if (cachedSheetsClient) return cachedSheetsClient;

  const auth = new google.auth.JWT({
    email: getRequiredEnv("GOOGLE_CLIENT_EMAIL"),
    key: getPrivateKey(),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  cachedSheetsClient = google.sheets({ version: "v4", auth });
  return cachedSheetsClient;
}

//-------------------------------------------------------------------------
// Formatage des lignes
//-------------------------------------------------------------------------

const TYPE_LABELS: Record<ParticipantType, string> = {
  adult: "Adulte",
  child: "Enfant",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("fr-CA", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

// Construit les lignes à insérer: une ligne par participant, afin de
// pouvoir filtrer/trier facilement par type, âge ou allergie dans le Sheet.
// Si "absent" ou aucun participant déclaré, on insère quand même une ligne
// (champs participant vides) pour garder une trace de la réponse.
// Un même "registrationId" est répété sur toutes les lignes d'un même foyer,
// ce qui permet de regrouper/retrouver facilement une inscription complète.
// Les compteurs adultes/enfants sont également répétés sur chaque ligne du
// foyer (petite redondance volontaire, utile pour un pivot/filtre rapide
// dans le Sheet, ex: préparation des repas).
function buildRows(
  data: SheetRegistrationData,
  submittedAt: string,
  registrationId: string
): string[][] {
  const dateLabel = formatDate(submittedAt);
  const attendanceLabel = data.attendance === "present" ? "Présent" : "Absent";

  const adultsCount =
    data.adultsCount ?? data.participants.filter((p) => p.type === "adult").length;
  const childrenCount =
    data.childrenCount ?? data.participants.filter((p) => p.type === "child").length;

  if (data.participants.length === 0) {
    return [
      [
        dateLabel,
        data.fullName,
        data.email,
        data.phone ?? "",
        attendanceLabel,
        "",
        "",
        "",
        "",
        "",
        data.comments ?? "",
        registrationId,
        String(adultsCount),
        String(childrenCount),
      ],
    ];
  }

  return data.participants.map((p, index) => [
    dateLabel,
    data.fullName,
    data.email,
    data.phone ?? "",
    attendanceLabel,
    TYPE_LABELS[p.type],
    p.firstName,
    p.lastName,
    p.age ?? "",
    p.allergies ?? "",
    // Le commentaire général n'est reporté que sur la première ligne du
    // foyer pour éviter de le répéter sur chaque participant.
    index === 0 ? data.comments ?? "" : "",
    registrationId,
    String(adultsCount),
    String(childrenCount),
  ]);
}

//-------------------------------------------------------------------------
// API publique
//-------------------------------------------------------------------------

// Ajoute les lignes d'une inscription au Google Sheet.
//
// `registrationId` est fourni par l'appelant (généré une seule fois dans
// route.ts) plutôt que généré ici, afin que le même ID puisse être réutilisé
// dans les emails admin/confirmation et permette de recouper facilement une
// ligne du Sheet avec les emails envoyés pour la même inscription.
//
// Ne throw jamais : en cas d'échec, on logue et on retourne un objet
// { success: false, error } au lieu de simplement `false`, pour que
// l'appelant (route.ts) puisse décider explicitement s'il doit bloquer
// l'inscription ou non. Le Sheet étant désormais le registre officiel des
// participants, il est recommandé de traiter un échec ici comme bloquant
// (voir route.ts).
export async function appendRegistrationToSheet(
  data: SheetRegistrationData,
  submittedAt: string,
  registrationId: string
): Promise<AppendResult> {
  try {
    const sheets = getSheetsClient();
    const { id: spreadsheetId, name: sheetName } = getSheetConfig();
    const rows = buildRows(data, submittedAt, registrationId);

    await sheets.spreadsheets.values.append(
      {
        spreadsheetId,
        range: `${sheetName}!A:N`,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: rows },
      },
      // Timeout explicite : l'API Google peut parfois traîner, mieux vaut
      // échouer proprement après 8s que de bloquer la requête indéfiniment.
      { timeout: 8000 }
    );

    return { success: true, registrationId };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[googleSheets] Échec de l'ajout au Sheet:", message);
    return { success: false, registrationId, error: message };
  }
}
// src/lib/constants.ts
// Donnees statiques centralisees pour le site Retraite CCAC 2025

import {
  BookOpen,
  HandHeart,
  Music,
  Heart,
  Users,
  Baby,
  UtensilsCrossed,
  Flame,
  Home,
  Mic,
  Utensils,
  Star,
  Mail,
  Phone,
  type LucideIcon,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Informations generales de l'evenement
// ---------------------------------------------------------------------------

export const EVENT_INFO = {
  title: "Retraite Spirituelle",
  subtitle: "Couples Chrétiens & Amis au Canada",
  tagline: "Un temps de ressourcement, de prière et de renouveau pour les couples et leurs familles.",
  date: "Sam 15 août 2026",
  schedule: "8h00 à 16h00",
  isFree: true,
  freeBadge: "Participation gratuite",
  slogan: "Un couple solide, une famille équilibrée.",
  verse: "LA MULTIPLICATION : COUPLES TRANSFORMÉS ET RESTAURÉS, ALLEZ ET BATTISSEZ DES COUPLES SELON LE CŒUR DE DIEU.",
  verseRef: "GENÈSE 1 : 28",
  themeTitle: "Des couples selon le cœur de Dieu",
  organizerName: "CCAC",
  organizerFullName: "Couples Chrétiens & Amis au Canada",
} as const;

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export const CONTACT_INFO = {
  email: "ccacgroupe@gmail.com",
  phone1: "514 292-0449",
  phone1Raw: "+15142920449",
  phone2: "514 217-5032",
  phone2Raw: "+15142175032",
} as const;

// ---------------------------------------------------------------------------
// Cartes "Ce a quoi vous pouvez vous attendre"
// ---------------------------------------------------------------------------

export interface ExpectationCard {
  icon: LucideIcon;
  label: string;
  colorClass: string;
  bgClass: string;
}

export const EXPECTATION_CARDS: ExpectationCard[] = [
  {
    icon: BookOpen,
    label: "Enseignements bibliques",
    colorClass: "text-brand-purple",
    bgClass: "bg-brand-purple-soft",
  },
  {
    icon: HandHeart,
    label: "Temps de prière",
    colorClass: "text-pink-500",
    bgClass: "bg-pink-50",
  },
  {
    icon: Music,
    label: "Adoration",
    colorClass: "text-brand-gold",
    bgClass: "bg-amber-50",
  },
  {
    icon: Heart,
    label: "Ateliers pour couples",
    colorClass: "text-rose-500",
    bgClass: "bg-rose-50",
  },
  {
    icon: Users,
    label: "Échanges fraternels",
    colorClass: "text-emerald-600",
    bgClass: "bg-emerald-50",
  },
  {
    icon: Baby,
    label: "Activités pour enfants",
    colorClass: "text-sky-500",
    bgClass: "bg-sky-50",
  },
  {
    icon: UtensilsCrossed,
    label: "Repas partagé",
    colorClass: "text-orange-500",
    bgClass: "bg-orange-50",
  },
  {
    icon: Flame,
    label: "Intercession",
    colorClass: "text-brand-purple",
    bgClass: "bg-brand-purple-soft",
  },
];

// ---------------------------------------------------------------------------
// Programme de la journee (timeline)
// ---------------------------------------------------------------------------

export interface ScheduleItem {
  icon: LucideIcon;
  time: string;
  title: string;
  description?: string;
  accentClass: string;
}

export const SCHEDULE_ITEMS: ScheduleItem[] = [
  {
    icon: Home,
    time: "8h00 - 10h30",
    title: "Accueil & Salutations",
    description: "Adoration, prière & mot de bienvenue",
    accentClass: "bg-brand-purple",
  },
  {
    icon: BookOpen,
    time: "10h30 - 11h00",
    title: "Méditation biblique",
    description: "Moment d'étude et d'échange biblique",
    accentClass: "bg-brand-sky",
  },
  {
    icon: Mic,
    time: "11h30 - 15h00",
    title: "Enseignement",
    description:
      "Partage autour de la thématique de la retraite : Moi et ma famille nous servirons l'Éternel",
    accentClass: "bg-brand-gold",
  },
  {
    icon: Heart,
    time: "15h30 - 16h30",
    title: "Atelier en duo de couples",
    accentClass: "bg-rose-500",
  },
  {
    icon: HandHeart,
    time: "16h30 - 17h00",
    title: "Intercession",
    accentClass: "bg-brand-purple",
  },
  {
    icon: Utensils,
    time: "17h00 - 17h30",
    title: "Partage de repas",
    accentClass: "bg-emerald-600",
  },
  {
    icon: Star,
    time: "17h30 - 18h00",
    title: "Conclusion & prières",
    accentClass: "bg-brand-sky",
  },
];

// ---------------------------------------------------------------------------
// Informations de contact pour la section Contact
// ---------------------------------------------------------------------------

export interface ContactCard {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
  iconColorClass: string;
  iconBgClass: string;
}

export const CONTACT_CARDS: ContactCard[] = [
  {
    icon: Mail,
    label: "Email",
    value: CONTACT_INFO.email,
    href: `mailto:${CONTACT_INFO.email}`,
    iconColorClass: "text-brand-purple",
    iconBgClass: "bg-brand-purple-soft",
  },
  {
    icon: Phone,
    label: "Téléphone 1",
    value: CONTACT_INFO.phone1,
    href: `tel:${CONTACT_INFO.phone1Raw}`,
    iconColorClass: "text-pink-500",
    iconBgClass: "bg-pink-50",
  },
  {
    icon: Phone,
    label: "Téléphone 2",
    value: CONTACT_INFO.phone2,
    href: `tel:${CONTACT_INFO.phone2Raw}`,
    iconColorClass: "text-brand-gold",
    iconBgClass: "bg-amber-50",
  },
];

// ---------------------------------------------------------------------------
// Reseaux sociaux du footer (placeholders)
// ---------------------------------------------------------------------------

export const SOCIAL_LINKS = [
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Youtube", href: "#" },
] as const;
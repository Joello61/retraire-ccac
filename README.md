# ⛪ Retraite Spirituelle CCAC 2025 - Site Officiel

> **"Un couple solide, une famille équilibrée."**
> *Thème : Consécration des familles - Josué 24:14-15*

Ce projet est le site web officiel de la **Retraite Spirituelle 2025** organisée par le groupe **Couples Chrétiens & Amis au Canada (CCAC)**. L'événement aura lieu le **16 août 2025 de 8h00 à 16h00** et est entièrement gratuit (sur inscription).

---

## 🎨 Design & Expérience Utilisateur (UX/UI)

Le site a été conçu avec une esthétique moderne, épurée et chaleureuse, alignée sur l'identité visuelle de la retraite :
*   **Palette de couleurs harmonieuse :** Tons de crème (`#faf8f5`), beige (`#f3ede4`), bleu marine (`#0f172a`) et accents dorés (`#c9952a`) ou violets (`#4c1d95`).
*   **Aide à la navigation :** Barre de navigation flottante et floutée avec détection du scroll, suivi dynamique de la section active par Intersection Observer, et fermeture intelligente du menu mobile au clic en dehors.
*   **Sections fluides :** Animations soignées propulsées par Framer Motion.

---

## 🚀 Fonctionnalités Clés

*   **🧭 Navigation Flottante Responsive :** En version mobile, le logo de la navbar est accompagné de la marque **CCAC** en lettres capitales violettes et italiques, parfaitement centrée. Un menu déroulant mobile s'ouvre d'un clic et se ferme automatiquement si l'utilisateur clique ailleurs sur la page.
*   **✨ Galerie interactive ("Ce à quoi vous pouvez vous attendre") :** Une mise en page sur deux colonnes (6/12) présente la liste des activités (enseignements, prière, adoration, etc.) à gauche, et une image horizontale (paysage) correspondante à droite avec une description au survol (hover overlay).
*   **📅 Programme & Timeline :** Affichage chronologique clair du déroulé de la journée du 16 août 2025, illustré par des icônes descriptives et accompagné d'une image au format portrait.
*   **📍 Localisation avec Google Maps :** Intégration de l'API Google Maps avec la vue satellite activée par défaut, contrôles de zoom/dézoom activés, et un marqueur stylisé pointant sur le lieu exact de la retraite.
*   **✍️ Formulaire d'inscription intelligent en 3 étapes :**
    *   Pour éviter les longs formulaires fatigants, l'inscription est scindée en étapes avec une barre de progression animée.
    *   **Logique de progression dynamique :**
        *   *Si le visiteur est présent :* Il passe par l'Étape 1 (Informations personnelles), l'Étape 2 (Détails de la participation : nombre d'adultes, d'enfants, noms des participants, etc.) et l'Étape 3 (Commentaires et validation).
        *   *Si le visiteur ne peut pas assister :* Le formulaire saute intelligemment l'étape de participation pour l'amener directement de l'étape 1 à l'étape 3 (remarques/validation).
    *   Les boutons d'action restent toujours ancrés en bas de la carte, offrant une structure visuelle stable.
    *   Image d'illustration en format paysage et boîte d'informations pratiques disposées dans la colonne de droite.

---

## 🛠️ Stack Technique

*   **Framework :** [Next.js](https://nextjs.org/) (App Router, Turbopack)
*   **Langage :** [TypeScript](https://www.typescriptlang.org/)
*   **Stylisation :** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Animations :** [Framer Motion](https://www.framer.com/motion/)
*   **Icônes :** [Lucide React](https://lucide.dev/)

---

## 💻 Démarrage Rapide

### Prérequis
Avoir installé **Node.js** (v18+ recommandé) et **npm**.

### Installation
1. Installez les dépendances :
   ```bash
   npm install
   ```

2. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```
   Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour visualiser le site.

3. Compilation pour la production :
   ```bash
   npm run build
   ```

---

## 📁 Structure du Projet

```text
├── app/                  # Application Next.js (pages, layout, styles globaux)
├── components/           # Composants UI et Sections du site
│   ├── sections/         # Sections autonomes (Hero, Expectations, Registration, Location, etc.)
│   └── ui/               # Composants réutilisables (SectionHeading, etc.)
├── public/               # Assets statiques (images, logos)
├── lib/                  # Données statiques et constantes de configuration
└── package.json          # Dépendances et scripts npm
```

---
⛪ **CCAC 2025 - Couples Chrétiens & Amis au Canada**

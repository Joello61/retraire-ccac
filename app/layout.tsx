import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Retraite Spirituelle CCAC 2025 - Couples Chretiens & Amis au Canada",
  description:
    "Rejoignez-nous pour la Retraite Spirituelle des Couples Chretiens & Amis au Canada. Un temps de ressourcement, de priere et de renouveau pour les couples et leurs familles. 16 aout 2025.",
  keywords: [
    "retraite spirituelle",
    "couples chretiens",
    "CCAC",
    "Canada",
    "famille chretienne",
    "retraite couples",
  ],
  openGraph: {
    title: "Retraite Spirituelle CCAC 2025",
    description:
      "Un temps de ressourcement, de priere et de renouveau pour les couples et leurs familles.",
    type: "website",
    locale: "fr_CA",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e3a5f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
// src/components/sections/Footer.tsx
// Footer 4 colonnes : A propos / Contact / Evenement / Logo officiel

import {
  Mail,
  Phone,
  Calendar,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Heart,
} from 'lucide-react';
import { EVENT_INFO, CONTACT_INFO } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="section-navy pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Grille 4 colonnes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Colonne 1 - A propos */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-bold text-lg tracking-tight">
              {EVENT_INFO.organizerName}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              {EVENT_INFO.organizerFullName}
            </p>
            <p className="font-serif italic text-white/50 text-sm">
              &quot;{EVENT_INFO.slogan}&quot;
            </p>

            {/* Reseaux sociaux */}
            {/* Remplacer les href "#" par vos vraies URLs de reseaux sociaux */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Youtube"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Colonne 2 - Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-bold text-lg tracking-tight">
              Contact
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phone1Raw}`}
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  {CONTACT_INFO.phone1}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phone2Raw}`}
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  {CONTACT_INFO.phone2}
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 3 - Evenement */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-bold text-lg tracking-tight">
              Evenement
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Calendar className="w-4 h-4 shrink-0" />
                {EVENT_INFO.date}
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Clock className="w-4 h-4 shrink-0" />
                {EVENT_INFO.schedule}
              </li>
            </ul>
          </div>

          {/* Colonne 4 - Logo officiel */}
          {/* Quand le logo est disponible :
              1. Placer le fichier dans /public/images/logo-ccac.png
              2. Remplacer le bloc placeholder par :
                 <Image src="/images/logo-ccac.png" alt="Logo CCAC" width={160} height={160} className="object-contain" />
          */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-45 rounded-2xl p-6 flex flex-col items-center gap-3 bg-white/7 border border-white/12">
              <Heart className="w-12 h-12 text-brand-gold" />
              <div className="text-center">
                <p className="text-white font-bold text-base tracking-tight">
                  {EVENT_INFO.organizerName}
                </p>
                <p className="text-white/40 text-xs mt-0.5 uppercase tracking-widest">
                  Logo Officiel
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ligne copyright */}
        <div className="pt-8 text-center">
          <p className="text-white/40 text-xs">
            &copy; 2025 {EVENT_INFO.organizerFullName} - Tous droits reserves.
          </p>
        </div>
      </div>
    </footer>
  );
}

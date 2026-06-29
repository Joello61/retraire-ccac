// src/components/sections/Footer.tsx
// Footer 4 colonnes : A propos / Contact / Evenement / Logo officiel

import {
  Mail,
  Phone,
  Calendar,
  Clock,
} from 'lucide-react';
import { EVENT_INFO, CONTACT_INFO } from '@/lib/constants';
import Image from 'next/image';

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
              Événement
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
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-45 rounded-2xl p-6 flex flex-col items-center gap-3 bg-white/7 border border-white/12">
              <div className="relative w-24 h-24 shrink-0">
                <Image
                  src="/images/logo.png"
                  alt={EVENT_INFO.organizerName}
                  fill
                  className="object-contain"
                  sizes="96px"
                />
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-base tracking-tight">
                  {EVENT_INFO.organizerName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ligne copyright */}
        <div className="pt-8 text-center">
          <p className="text-white/40 text-xs">
            &copy; 2026 {EVENT_INFO.organizerFullName} - Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

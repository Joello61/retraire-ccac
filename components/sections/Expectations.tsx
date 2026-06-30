// src/components/sections/Expectations.tsx
// Section "Ce a quoi vous pouvez vous attendre" - 2 colonnes : liste interactive a gauche, image avec description au hover a droite

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { EXPECTATION_CARDS } from "@/lib/constants";
import Image from "next/image";

const CARDS_DATA = [
  {
    label: "Enseignements bibliques",
    description: "Approfondissez votre foi avec des partages bibliques concrets axés sur la vie de couple et de famille chrétienne.",
    image: "/images/galerie/photo1.jpeg",
  },
  {
    label: "Temps de prière",
    description: "Des moments privilégiés pour prier ensemble, élever vos requêtes à Dieu et fortifier la spiritualité de votre foyer.",
    image: "/images/galerie/photo10.jpeg",
  },
  {
    label: "Adoration",
    description: "Célébrez le Seigneur d'un seul cœur à travers des chants de louange et des moments d'intimité spirituelle intense.",
    image: "/images/galerie/photo3.jpeg",
  },
  {
    label: "Ateliers pour couples",
    description: "Participez à des exercices pratiques en tête-à-tête pour améliorer la communication, le pardon et la complicité.",
    image: "/images/galerie/photo4.jpeg",
  },
  {
    label: "Échanges fraternels",
    description: "Rencontrez et échangez avec d'autres couples chrétiens du Canada partageant les mêmes défis et aspirations.",
    image: "/images/galerie/photo6.jpeg",
  },
  {
    label: "Activités pour enfants",
    description: "Un encadrement complet et sécuritaire avec des jeux éducatifs et des enseignements adaptés pendant que vous vivez votre retraite.",
    image: "/images/galerie/photo5.jpeg",
  },
  {
    label: "Repas partagé",
    description: "Profitez d'un délicieux repas communautaire pour fraterniser en toute simplicité et convivialité.",
    image: "/images/galerie/photo7.jpeg",
  },
  {
    label: "Intercession",
    description: "Un ministère d'accompagnement par la prière pour porter ensemble vos fardeaux et confier vos familles au Seigneur.",
    image: "/images/galerie/photo8.jpeg",
  },
];

const cardsWithDetails = EXPECTATION_CARDS.map((card) => {
  const details = CARDS_DATA.find((d) => d.label === card.label) || {
    description: "",
    image: "/images/about.jpg",
  };
  return { ...card, ...details };
});

export default function Expectations() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCard = cardsWithDetails[activeIndex];
  const ActiveIcon = activeCard.icon;

  return (
    <section id="programme" className="section-cream py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading title="Ce à quoi vous pouvez vous attendre" />

        <div className="mt-14 grid md:grid-cols-12 gap-12 items-start">
          {/* Colonne gauche : Liste interactive (6/12 colonnes, grille interne de 2 colonnes) */}
          <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cardsWithDetails.map((card, index) => {
              const Icon = card.icon;
              const isActive = index === activeIndex;

              return (
                <button
                  key={card.label}
                  onClick={() => setActiveIndex(index)}
                  className={[
                    "w-full text-left flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 outline-none cursor-pointer",
                    isActive
                      ? "bg-brand-purple-soft border-brand-purple shadow-md"
                      : "bg-white border-brand-border hover:border-brand-sky hover:shadow-sm",
                  ].join(" ")}
                >
                  {/* Icône */}
                  <div
                    className={[
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      isActive ? "bg-brand-purple text-white" : card.bgClass + " " + card.colorClass,
                    ].join(" ")}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>

                  {/* Label */}
                  <div className="flex-1">
                    <p
                      className={[
                        "font-bold text-xs sm:text-sm leading-tight transition-colors",
                        isActive ? "text-brand-purple" : "text-brand-navy",
                      ].join(" ")}
                    >
                      {card.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Colonne droite : Image avec overlay au hover (6/12 colonnes) */}
          <div className="md:col-span-6 md:sticky md:top-24 flex flex-col gap-4">
            <div className="relative w-full aspect-16/10 rounded-2xl overflow-hidden shadow-xl group cursor-pointer bg-brand-navy">
              {/* Animation de transition d'image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCard.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={activeCard.image}
                    alt={activeCard.label}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Overlay affiché au survol (hover) */}
              <div className="absolute inset-0 bg-brand-navy/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-8 text-center text-white">
                <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center mb-4">
                  <ActiveIcon className="w-6 h-6 text-brand-gold" />
                </div>
                <h4 className="font-bold text-lg text-white mb-3">
                  {activeCard.label}
                </h4>
                <p className="text-white/80 text-sm leading-relaxed max-w-xs">
                  {activeCard.description}
                </p>
              </div>
            </div>

            {/* Note mobile / accessibilité (toujours visible) */}
            <div className="bg-white border border-brand-border rounded-xl p-4 md:hidden">
              <p className="text-brand-navy font-bold text-sm mb-1">{activeCard.label}</p>
              <p className="text-brand-gray text-xs leading-relaxed">{activeCard.description}</p>
            </div>

            <p className="hidden md:block text-center text-xs text-brand-gray italic">
              Survolez l&apos;image pour afficher les détails.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

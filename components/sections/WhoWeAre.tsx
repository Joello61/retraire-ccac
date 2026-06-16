// src/components/sections/WhoWeAre.tsx
// Section "Qui sommes-nous ?" - grille 2 colonnes avec texte à gauche, image de communauté à droite

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShieldCheck } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { EVENT_INFO } from "@/lib/constants";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.15,
    },
  },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function WhoWeAre() {
  return (
    <section id="qui-sommes-nous" className="section-cream py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-2 gap-14 items-center"
        >
          {/* Colonne de texte gauche */}
          <motion.div variants={fadeInLeft} className="flex flex-col gap-6">
            <SectionHeading
              title={EVENT_INFO.organizerFullName}
              centered={false}
            />

            <p className="text-brand-gray leading-relaxed text-base">
              Nous sommes un groupe de couples chrétiens et d&apos;amis vivant au Canada, unis par la foi, l&apos;amour de Dieu et l&apos;amitié fraternelle.
            </p>

            <p className="text-brand-gray leading-relaxed text-base">
              Notre mission est d&apos;accompagner, d&apos;encourager et d&apos;équiper les couples afin qu&apos;ils construisent des foyers épanouis, équilibrés et profondément enracinés dans les valeurs bibliques.
            </p>

            {/* Encadrés de valeurs clés */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-brand-border shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-brand-gold/15 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <h4 className="text-brand-navy font-bold text-sm">Amour & Famille</h4>
                  <p className="text-brand-gray text-xs mt-0.5">Foyers solides</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-brand-border shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-brand-purple-soft flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-brand-purple" />
                </div>
                <div>
                  <h4 className="text-brand-navy font-bold text-sm">Valeurs Bibliques</h4>
                  <p className="text-brand-gray text-xs mt-0.5">Fondement en Christ</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Colonne image droite */}
          <motion.div
            variants={fadeInRight}
            className="relative w-full aspect-16/10 rounded-2xl overflow-hidden shadow-xl"
          >
            <Image
              src="/images/communaute.jpg"
              alt="Notre communauté de couples au Canada"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Overlay dégradé subtil pour la finition */}
            <div className="absolute inset-0 bg-linear-to-t from-brand-navy/10 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

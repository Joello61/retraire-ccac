// src/components/sections/Theme.tsx
// Section "Consecration des familles" - fond bleu marine uni, verset et image famille
// Aucun degre - aplat de couleur pur bg-brand-blue (#1e3a5f)

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { EVENT_INFO } from "@/lib/constants";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.18,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function Theme() {
  return (
    <section
      id="theme"
      className="py-20"
      style={{ backgroundColor: "var(--color-brand-blue)" }}
    >
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col items-center gap-10"
        >
          {/* Titre */}
          <motion.div variants={fadeInUp} className="w-full">
            <SectionHeading title={EVENT_INFO.themeTitle} light />
          </motion.div>

          {/* Bloc verset */}
          <motion.div
            variants={fadeInUp}
            className="w-full rounded-2xl p-8 text-center"
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <p className="font-serif italic text-2xl md:text-3xl text-white leading-relaxed">
              &quot;{EVENT_INFO.verse}&quot;
            </p>
            <p className="mt-4 text-sm font-medium text-white/60 uppercase tracking-widest">
              {EVENT_INFO.verseRef}
            </p>
          </motion.div>

          {/* Image famille */}
          {/* Remplacer par votre image : /public/images/famille.jpg */}
          {/* Dimensions recommandees : 900x500px, famille en silhouette ou en priere */}
          <motion.div
            variants={fadeInUp}
            className="w-full rounded-2xl overflow-hidden shadow-lg aspect-video relative"
          >
            <Image
              src="/images/famille.jpg"
              alt="Famille en priere"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
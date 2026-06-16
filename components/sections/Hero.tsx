// src/components/sections/Hero.tsx
// Section hero principale avec image de fond, overlay navy, badges et CTA

"use client";

import Image from "next/image";
import { Calendar, Clock, Gift, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { EVENT_INFO } from "@/lib/constants";

// Variantes d'animation Framer Motion
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Image de fond */}
      {/* Remplacer par votre image : /public/images/hero.jpg */}
      {/* Dimensions recommandees : 1920x1080px minimum */}
      <Image
        src="/images/hero.jpg"
        alt="Retraite Spirituelle CCAC 2025"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Overlay brand purple avec opacite de 65% */}
      <div className="absolute inset-0 bg-brand-blue/70" />

      {/* Contenu central */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.p
            variants={itemVariants}
            className="text-brand-gold font-semibold text-sm uppercase tracking-widest mb-6"
          >
            {EVENT_INFO.organizerFullName}
          </motion.p>

          {/* Titre principal */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6"
          >
            {EVENT_INFO.title}{" "}
            <span className="block">{EVENT_INFO.subtitle}</span>
          </motion.h1>

          {/* Sous-titre */}
          <motion.p
            variants={itemVariants}
            className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
          >
            {EVENT_INFO.tagline}
          </motion.p>

          {/* Badges date / horaire / gratuit */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
          >
            <span className="flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm">
              <Calendar className="w-4 h-4 text-brand-gold" />
              {EVENT_INFO.date}
            </span>
            <span className="flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm">
              <Clock className="w-4 h-4 text-brand-gold" />
              {EVENT_INFO.schedule}
            </span>
            <span className="flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm">
              <Gift className="w-4 h-4 text-brand-gold" />
              {EVENT_INFO.freeBadge}
            </span>
          </motion.div>

          {/* Bouton CTA */}
          <motion.div variants={itemVariants}>
            <a href="#inscription" className="btn-primary text-base px-8 py-4">
              Je m&apos;inscris maintenant
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Indicateur de défilement */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-white/50 text-xs uppercase tracking-widest">
          Découvrir
        </span>
        <ChevronDown className="w-5 h-5 text-white/50 animate-bounce" />
      </div>
    </section>
  );
}
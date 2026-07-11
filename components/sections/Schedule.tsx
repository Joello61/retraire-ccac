// src/components/sections/Schedule.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { SCHEDULE_CHAPTERS } from "@/lib/constants";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.15,
    },
  },
};

const chapterVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Micro-stagger discret sur les lignes à l'intérieur d'un chapitre
const rowsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

export default function Schedule() {
  return (
    <section id="programme-journee" className="section-cream py-20">
      <div className="max-w-4xl mx-auto px-6">
        <SectionHeading title="Programme de la journée" />

        <p className="mt-4 text-center text-brand-gray text-base leading-relaxed max-w-xl mx-auto">
          Une journée pensée pour se ressourcer, grandir ensemble et partager
          un moment fraternel.
        </p>

        {/* Image repensée : bannière compacte, non sticky */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full h-56 md:h-72 rounded-2xl overflow-hidden shadow-md mt-10"
        >
          <Image
            src="/images/galerie/photo19.jpeg"
            alt="Illustration de la retraite"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </motion.div>

        {/* Chapitres du programme */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 flex flex-col gap-6"
        >
          {SCHEDULE_CHAPTERS.map((chapter) => {
            const Icon = chapter.icon;

            // Traitement distinct pour le temps fort de la journée (Enseignement)
            if (chapter.highlight) {
              return (
                <motion.div
                  key={chapter.label}
                  variants={chapterVariants}
                  className={[
                    "relative rounded-2xl bg-brand-purple-soft",
                    "border-2 border-brand-gold/50 shadow-md",
                    "p-6 md:p-8",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full bg-brand-gold flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
                    </div>
                    <span className="text-xs font-bold tracking-wide uppercase text-brand-purple">
                      {chapter.label}
                    </span>
                  </div>

                  {chapter.items.map((item) => (
                    <div key={item.title} className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-brand-purple">
                        {item.time}
                      </span>
                      <h3 className="text-brand-navy font-bold text-lg md:text-xl leading-snug">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-brand-gray text-sm leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}

                  <span
                    className={[
                      "inline-flex w-fit items-center mt-4",
                      "bg-brand-gold text-white",
                      "text-xs font-bold tracking-wide uppercase",
                      "px-3 py-1 rounded-full",
                    ].join(" ")}
                  >
                    Temps fort de la journée
                  </span>
                </motion.div>
              );
            }

            // Chapitres standards (Matin, Après-midi, Clôture)
            return (
              <motion.div
                key={chapter.label}
                variants={chapterVariants}
                className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 md:p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-brand-purple flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-white" strokeWidth={1.8} />
                  </div>
                  <span className="text-xs font-bold tracking-wide uppercase text-brand-purple">
                    {chapter.label}
                  </span>
                </div>

                <motion.div
                  variants={rowsContainerVariants}
                  className="flex flex-col"
                >
                  {chapter.items.map((item, index) => (
                    <motion.div
                      key={item.title}
                      variants={rowVariants}
                      className={[
                        "flex items-baseline gap-4 py-2.5",
                        index !== chapter.items.length - 1
                          ? "border-b border-slate-100"
                          : "",
                      ].join(" ")}
                    >
                      <span className="text-sm text-brand-gray min-w-16 shrink-0">
                        {item.time}
                      </span>
                      <span className="text-sm text-brand-navy font-medium">
                        {item.title}
                        {item.description && (
                          <span className="text-brand-gray font-normal">
                            {" "}
                            - {item.description}
                          </span>
                        )}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
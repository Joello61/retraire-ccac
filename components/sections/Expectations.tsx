// src/components/sections/Expectations.tsx
// Section "Ce a quoi vous pouvez vous attendre" - grille de 8 cartes avec icones

"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { EXPECTATION_CARDS } from "@/lib/constants";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Expectations() {
  return (
    <section id="programme" className="section-cream py-20">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading title="Ce a quoi vous pouvez vous attendre" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {EXPECTATION_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                variants={cardVariants}
                className="card flex flex-col items-center text-center gap-4 p-6"
              >
                <div
                  className={[
                    "w-14 h-14 rounded-full flex items-center justify-center shrink-0",
                    card.bgClass,
                  ].join(" ")}
                >
                  <Icon className={["w-6 h-6", card.colorClass].join(" ")} />
                </div>
                <p className="text-brand-navy font-semibold text-sm leading-snug">
                  {card.label}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
// src/components/sections/WhoWeAre.tsx
// Section "Qui sommes-nous ?" - texte centre sobre sur fond creme

"use client";

import { motion } from "framer-motion";
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

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function WhoWeAre() {
  return (
    <section id="qui-sommes-nous" className="section-cream py-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col items-center"
        >
          <motion.div variants={fadeInUp} className="w-full">
            <SectionHeading title={EVENT_INFO.organizerFullName} />
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="mt-8 max-w-2xl text-center flex flex-col gap-5"
          >
            <p className="text-brand-gray leading-relaxed text-base">
              Nous sommes un groupe de couples chretiens et d&apos;amis vivant au
              Canada, unis par la foi et l&apos;amitie.
            </p>

            <p className="text-brand-gray leading-relaxed text-base">
              Notre mission est d&apos;accompagner, encourager et fortifier les
              couples chretiens afin qu&apos;ils vivent une vie de couple et de
              famille epanouie, equilibree et enracinee dans les valeurs
              bibliques.
            </p>
          </motion.div>

          {/* Separateur decoratif */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 flex items-center gap-4 w-full max-w-xs"
          >
            <div className="flex-1 h-px bg-brand-border" />
            <div className="w-2 h-2 rounded-full bg-brand-gold" />
            <div className="flex-1 h-px bg-brand-border" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
// src/components/sections/Schedule.tsx
// Section "Programme de la journee" - timeline verticale elegante avec animations au scroll

"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { SCHEDULE_ITEMS } from "@/lib/constants";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Schedule() {
  return (
    <section id="programme-journee" className="section-cream py-20">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeading title="Programme de la journee" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative mt-14"
        >
          {/* Ligne verticale continue */}
          <div
            className="absolute top-0 bottom-0 w-px bg-brand-border"
            style={{ left: "1.4rem" }}
          />

          {/* Items de la timeline */}
          <div className="flex flex-col">
            {SCHEDULE_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const isLast = index === SCHEDULE_ITEMS.length - 1;

              return (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className={[
                    "relative flex gap-6",
                    isLast ? "pb-0" : "pb-10",
                  ].join(" ")}
                >
                  {/* Cercle icone positionne sur la ligne */}
                  <div className="relative z-10 shrink-0">
                    <div
                      className={[
                        "w-11 h-11 rounded-full flex items-center justify-center shadow-sm",
                        item.accentClass,
                      ].join(" ")}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Contenu de l'etape */}
                  <div className="pt-1 pb-2 flex flex-col gap-2">
                    {/* Badge horaire */}
                    <span className="inline-flex w-fit items-center bg-brand-purple-soft text-brand-purple text-xs font-semibold px-3 py-1 rounded-full">
                      {item.time}
                    </span>

                    {/* Titre */}
                    <h3 className="text-brand-navy font-bold text-lg leading-snug">
                      {item.title}
                    </h3>

                    {/* Description optionnelle */}
                    {item.description && (
                      <p className="text-brand-gray text-sm leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
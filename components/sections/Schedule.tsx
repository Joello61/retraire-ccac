// src/components/sections/Schedule.tsx
"use client";

import Image from "next/image";
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

// Diamètre du cercle = 56px (w-14) - centre à 28px du bord gauche
const DOT_SIZE   = "w-14 h-14"; // 56px
const LINE_LEFT  = "left-[28px]"; // centre exact du cercle
const LINE_INSET = "translate-x-[-50%]"; // centre la ligne sur le point

export default function Schedule() {
  return (
    <section id="programme-journee" className="section-cream py-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading title="Programme de la journée" />

        <div className="mt-14 grid md:grid-cols-12 gap-12 items-start">

          {/* Timeline */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative md:col-span-7"
          >
            {/* Ligne verticale - centrée exactement sur le cercle de 56px */}
            <div
              className={[
                "absolute top-0 bottom-0 w-0.5 bg-brand-purple/20",
                LINE_LEFT,
                LINE_INSET,
              ].join(" ")}
            />

            <div className="flex flex-col">
              {SCHEDULE_ITEMS.map((item, index) => {
                const Icon   = item.icon;
                const isLast = index === SCHEDULE_ITEMS.length - 1;

                return (
                  <motion.div
                    key={item.title}
                    variants={itemVariants}
                    className={[
                      "relative flex gap-5",
                      isLast ? "pb-0" : "pb-6",
                    ].join(" ")}
                  >
                    {/* Cercle icône */}
                    <div className="relative z-10 shrink-0">
                      <div
                        className={[
                          DOT_SIZE,
                          "rounded-full flex items-center justify-center",
                          "ring-4 ring-white shadow-md",
                          item.accentClass,
                        ].join(" ")}
                      >
                        <Icon className="w-6 h-6 text-white" strokeWidth={1.8} />
                      </div>
                    </div>

                    {/* Carte contenu */}
                    <div
                      className={[
                        "flex-1 bg-white rounded-xl p-5",
                        "shadow-sm border border-slate-100",
                        "flex flex-col gap-2",
                        // Alignement vertical : on centre la carte sur le cercle
                        "mt-1",
                      ].join(" ")}
                    >
                      {/* Badge horaire - mis en avant */}
                      <span
                        className={[
                          "inline-flex w-fit items-center",
                          "bg-brand-purple-soft text-brand-purple",
                          "text-xs font-bold tracking-wide uppercase",
                          "px-3 py-1 rounded-full",
                        ].join(" ")}
                      >
                        {item.time}
                      </span>

                      {/* Titre */}
                      <h3 className="text-brand-navy font-bold text-base leading-snug">
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

          {/* Image sticky */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="md:col-span-5 md:sticky md:top-24"
          >
            <div className="relative w-full aspect-16/10 md:aspect-3/4 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/galerie/photo11.jpeg"
                alt="Illustration de la retraite"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
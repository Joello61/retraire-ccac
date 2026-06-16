// src/components/sections/Contact.tsx
// Section "Besoin d'informations ?" - 3 cartes contact avec icones Lucide

"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { CONTACT_CARDS } from "@/lib/constants";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1,
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

export default function Contact() {
  return (
    <section id="contact" className="section-light py-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
        >
          <motion.div variants={cardVariants}>
            <SectionHeading title="Besoin d'informations ?" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {CONTACT_CARDS.map((contact) => {
              const Icon = contact.icon;
              return (
                <motion.a
                  key={contact.label}
                  href={contact.href}
                  variants={cardVariants}
                  className="card flex flex-col items-center text-center gap-4 p-8 no-underline"
                >
                  <div
                    className={[
                      "w-14 h-14 rounded-full flex items-center justify-center shrink-0",
                      contact.iconBgClass,
                    ].join(" ")}
                  >
                    <Icon
                      className={["w-6 h-6", contact.iconColorClass].join(" ")}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-brand-navy font-semibold text-sm">
                      {contact.label}
                    </p>
                    <p className="text-brand-purple font-medium text-sm">
                      {contact.value}
                    </p>
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
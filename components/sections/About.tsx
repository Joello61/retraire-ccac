// src/components/sections/About.tsx
// Section "A propos de la retraite" - image gauche, texte droite, slogan mis en valeur

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { EVENT_INFO } from "@/lib/constants";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function About() {
  return (
    <section id="a-propos" className="section-beige py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-2 gap-14 items-center"
        >
          {/* Image gauche */}
          {/* Remplacer par votre image : /public/images/about.jpg */}
          {/* Dimensions recommandees : 800x600px, couple en priere */}
          <motion.div
            variants={fadeInLeft}
            className="relative w-full aspect-16/10 rounded-2xl overflow-hidden shadow-lg"
          >
            <Image
              src="/images/galerie/photo1.jpeg"
              alt="Couple en prière"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          {/* Texte droite */}
          <motion.div
            variants={fadeInRight}
            className="flex flex-col gap-6"
          >
            <SectionHeading
              title="Rejoignez-nous pour une retraite de couple centrée sur Christ"
              centered={false}
            />

            <p className="text-brand-gray leading-relaxed">
              Cette retraite spirituelle est organisée par le{" "}
              <strong className="text-brand-navy">
                {EVENT_INFO.organizerName} ({EVENT_INFO.organizerFullName})
              </strong>
              .
            </p>

            <p className="text-brand-gray leading-relaxed">
              Nous croyons qu&apos;un couple solide contribue à bâtir une famille
              équilibrée et épanouie. À travers nos rencontres et activités,
              nous accompagnons les couples dans leur croissance spirituelle,
              relationnelle et familiale.
            </p>

            <p className="text-brand-gray leading-relaxed">
              Nous espérons que vous vivrez cette retraite comme un véritable
              moment de ressourcement.
            </p>

            {/* Bloc slogan */}
            <motion.div
              variants={fadeInUp}
              className="mt-2 bg-brand-purple rounded-xl p-6 text-center"
            >
              <p className="font-serif italic text-xl text-white leading-snug">
                &quot;{EVENT_INFO.slogan}&quot;
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
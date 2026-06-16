// src/components/sections/ChildrenRetreat.tsx
// Section "Les enfants aussi ont leur retraite !" - texte gauche, grille d'images droite

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

const fadeInLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.15,
    },
  },
};

export default function ChildrenRetreat() {
  return (
    <section id="enfants" className="section-light py-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-2 gap-14 items-center"
        >
          {/* Texte gauche */}
          <motion.div variants={fadeInLeft} className="flex flex-col gap-6">
            <SectionHeading
              title="Les enfants aussi ont leur retraite !"
              centered={false}
            />

            <p className="text-brand-gray leading-relaxed">
              Pendant que les parents vivent leur retraite spirituelle, un
              programme specialement concu pour les enfants se deroule en
              parallele.
            </p>

            <p className="text-brand-gray leading-relaxed">
              Anime par une equipe devouee et experimentee, ce moment offre aux
              enfants un espace securitaire et stimulant pour decouvrir les
              valeurs chretiennes de maniere adaptee a leur age.
            </p>
          </motion.div>

          {/* Grille d'images droite */}
          {/* Images recommandees : enfants en activites, 600x400px minimum */}
          {/* /public/images/enfants-1.jpg - enfant en priere */}
          {/* /public/images/enfants-2.jpg - groupe d'enfants joyeux */}
          {/* /public/images/enfants-3.jpg - activite de groupe */}
          <motion.div variants={fadeInRight} className="grid grid-cols-2 gap-4">
            {/* Image haut gauche */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
              <Image
                src="/images/enfants-1.jpg"
                alt="Enfant en priere"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>

            {/* Image haut droite */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
              <Image
                src="/images/enfants-2.jpg"
                alt="Enfants joyeux"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>

            {/* Image bas - pleine largeur */}
            <div className="col-span-2 relative aspect-[16/7] rounded-2xl overflow-hidden shadow-md">
              <Image
                src="/images/enfants-3.jpg"
                alt="Activite de groupe pour enfants"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
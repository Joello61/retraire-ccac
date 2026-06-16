// src/components/sections/VideoShowcase.tsx
// Section video dans un cadre de telephone moderne
// Pour ajouter la video : placez votre fichier dans /public/videos/retraite.mp4
// et decommenter le bloc <video> ci-dessous

'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function VideoShowcase() {
  return (
    <section className="section-light py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ staggerChildren: 0.15 }}
        >
          <motion.div variants={fadeInUp}>
            <SectionHeading
              title="Decouvrez nos rencontres"
              subtitle="Decouvrez l'ambiance de nos precedentes rencontres et retraites spirituelles."
            />
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-14 flex justify-center">
            {/* Cadre telephone */}
            <div className="phone-frame">
              <div className="phone-screen">
                {/* --- Decommenter ce bloc quand la video est disponible ---
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/videos/retraite.mp4" type="video/mp4" />
                </video>
                --------------------------------------------------------- */}

                {/* Placeholder video */}
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-brand-blue px-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-brand-gold" />
                  </div>
                  <p className="text-white font-bold text-sm leading-snug">
                    Video de la retraite
                  </p>
                  <p className="text-white/60 text-xs">Format vertical 9:16</p>
                  <p className="text-brand-gold text-xs leading-snug">
                    Remplacez ce placeholder par votre video en modifiant le
                    code ci-dessus
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Note developpeur */}
          <motion.p
            variants={fadeInUp}
            className="mt-6 text-center text-xs text-brand-gray italic"
          >
            Pour ajouter votre video : placez votre fichier video dans
            /public/videos/ et decommenter le code video
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

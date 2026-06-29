'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import SectionHeading from '@/components/ui/SectionHeading';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const photos = [
  '/images/galerie/photo1.jpeg',
  '/images/galerie/photo2.jpeg',
  '/images/galerie/photo3.jpeg',
  '/images/galerie/photo4.jpeg',
  '/images/galerie/photo5.jpeg',
];

export default function VideoShowcase() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setCurrent((i) => (i + 1) % photos.length);

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
              title="Découvrez nos rencontres"
              subtitle="Découvrez l'ambiance de nos précédentes rencontres et retraites spirituelles."
            />
          </motion.div>

          {/* Deux colonnes */}
          <motion.div
            variants={fadeInUp}
            className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
          >
            {/* Colonne gauche — Vidéo */}
            <div
              className="relative w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10"
              style={{ aspectRatio: '640 / 352' }}
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/videos/retraite.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Colonne droite — Carrousel */}
            <div className="flex flex-col gap-4">
              {/* Image + flèches */}
              <div
                className="relative w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10"
                style={{ aspectRatio: '640 / 352' }}
              >
                {photos.map((src, i) => (
                  <Image
                    key={src}
                    src={src}
                    alt={`Photo retraite ${i + 1}`}
                    fill
                    className={`object-cover transition-opacity duration-500 ${
                      i === current ? 'opacity-100' : 'opacity-0'
                    }`}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={i === 0}
                  />
                ))}

                {/* Flèche gauche */}
                <button
                  onClick={prev}
                  aria-label="Photo précédente"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Flèche droite */}
                <button
                  onClick={next}
                  aria-label="Photo suivante"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Compteur */}
                <span className="absolute top-3 right-4 z-10 text-xs text-white/70 bg-black/30 px-2 py-0.5 rounded-full">
                  {current + 1} / {photos.length}
                </span>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Aller à la photo ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current
                        ? 'bg-brand-gold w-5'
                        : 'w-2 bg-brand-gray/30 hover:bg-brand-gray/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
// src/components/sections/Location.tsx
// Section "Lieu de l'evenement" - carte Google Maps avec emplacement pour adresse
//
// Pour activer la carte :
// 1. Obtenez votre URL Google Maps embed depuis maps.google.com
//    (Partager > Integrer une carte > copier l'URL src de l'iframe)
// 2. Remplacez VOTRE_URL_MAPS_ICI par cette URL dans le bloc iframe ci-dessous
// 3. Decommenter le bloc iframe et commenter le bloc placeholder

"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

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

export default function Location() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const address = process.env.NEXT_PUBLIC_EVENT_LOCATION;
  const showMap = !!apiKey && !!address;

  return (
    <section id="lieu" className="section-light py-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Titre */}
          <motion.div variants={fadeInUp}>
            <SectionHeading title="Lieu de l'événement" />
          </motion.div>

          {/* Message adresse dynamique */}
          <motion.div
            variants={fadeInUp}
            className="mt-6 flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4 text-brand-purple shrink-0" />
            <p className="text-brand-gray text-sm">
              {showMap ? address : "L'adresse exacte sera communiquée ultérieurement"}
            </p>
          </motion.div>

          {/* Bloc carte */}
          <motion.div
            variants={fadeInUp}
            className="mt-10 rounded-2xl overflow-hidden shadow-md"
          >
            {showMap ? (
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(address)}&maptype=satellite`}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lieu de l'événement"
                className="w-full h-80 md:h-96"
              />
            ) : (
              /* Placeholder carte si variables d'environnement non definies */
              <div className="w-full h-80 md:h-96 bg-brand-gray-light flex flex-col items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-full bg-brand-purple-soft flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-brand-purple" />
                </div>
                <p className="text-brand-gray text-sm font-medium">
                  La carte Google Maps sera disponible prochainement
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
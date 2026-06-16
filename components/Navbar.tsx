// src/components/sections/Navbar.tsx
// Navbar flottante responsive avec icones Lucide, detection du scroll et menu mobile

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  CalendarDays,
  Users,
  BookOpen,
  MapPin,
  ClipboardList,
  Phone,
  Menu,
  X,
} from "lucide-react";
import { EVENT_INFO } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Definition des liens de navigation
// ---------------------------------------------------------------------------

interface NavLink {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_LINKS: NavLink[] = [
  { label: "Programme",   href: "#programme",        icon: CalendarDays  },
  { label: "À propos",    href: "#a-propos",          icon: Heart         },
  { label: "Qui sommes-nous", href: "#qui-sommes-nous", icon: Users       },
  { label: "Journée",     href: "#programme-journee", icon: BookOpen      },
  { label: "Lieu",        href: "#lieu",              icon: MapPin        },
  { label: "Inscription", href: "#inscription",       icon: ClipboardList },
  { label: "Contact",     href: "#contact",           icon: Phone         },
];

// ---------------------------------------------------------------------------
// Variantes d'animation menu mobile
// ---------------------------------------------------------------------------

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.25, ease: "easeOut" },
  }),
};

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [activeHref, setActiveHref] = useState("");
  const headerRef                   = useRef<HTMLElement>(null);

  // Detection du scroll pour l'effet flottant
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermeture du menu mobile au resize vers desktop
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Fermeture du menu mobile au clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuOpen &&
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Suivi de la section active via IntersectionObserver
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveHref(`#${id}`);
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  function handleLinkClick(href: string) {
    setActiveHref(href);
    setMenuOpen(false);
  }

  // ---------------------------------------------------------------------------
  // Rendu
  // ---------------------------------------------------------------------------

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
    >
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
        className={[
          "w-full max-w-6xl rounded-2xl transition-all duration-300",
          scrolled
            ? "bg-white/95 shadow-lg border border-brand-border backdrop-blur-md"
            : "bg-white/80 shadow-md border border-white/60 backdrop-blur-sm",
        ].join(" ")}
      >
        <div className="relative flex items-center justify-between px-5 py-3">

          {/* Logo / nom */}
          <a
            href="#"
            onClick={() => handleLinkClick("")}
            className="flex items-center gap-2 shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-brand-navy text-sm leading-tight hidden sm:block">
              {EVENT_INFO.organizerName}
            </span>
          </a>

          {/* Nom du centre (CCAC) au milieu sur mobile uniquement */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:hidden pointer-events-none">
            <span className="font-extrabold text-brand-purple text-xl italic tracking-widest uppercase">
              CCAC
            </span>
          </div>

          {/* Liens desktop */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = activeHref === link.href;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => handleLinkClick(link.href)}
                    className={[
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors",
                      isActive
                        ? "bg-brand-purple-soft text-brand-purple"
                        : "text-brand-gray hover:text-brand-navy hover:bg-brand-gray-light",
                    ].join(" ")}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* CTA desktop */}
          <a
            href="#inscription"
            onClick={() => handleLinkClick("#inscription")}
            className="hidden lg:inline-flex btn-primary text-xs px-4 py-2.5"
          >
            Je m&apos;inscris
          </a>

          {/* Bouton menu mobile */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-brand-navy hover:bg-brand-gray-light transition-colors"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Menu mobile deroulant */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="lg:hidden border-t border-brand-border mx-2 mb-2"
            >
              <ul className="flex flex-col py-3 px-2 gap-1">
                {NAV_LINKS.map((link, i) => {
                  const Icon = link.icon;
                  const isActive = activeHref === link.href;
                  return (
                    <motion.li
                      key={link.href}
                      custom={i}
                      variants={mobileItemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <a
                        href={link.href}
                        onClick={() => handleLinkClick(link.href)}
                        className={[
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors",
                          isActive
                            ? "bg-brand-purple-soft text-brand-purple"
                            : "text-brand-gray hover:text-brand-navy hover:bg-brand-gray-light",
                        ].join(" ")}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {link.label}
                      </a>
                    </motion.li>
                  );
                })}

                {/* CTA mobile */}
                <li className="pt-2 px-2">
                  <a
                    href="#inscription"
                    onClick={() => handleLinkClick("#inscription")}
                    className="btn-primary w-full justify-center text-sm"
                  >
                    Je m&apos;inscris maintenant
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
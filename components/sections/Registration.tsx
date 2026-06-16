// src/components/sections/Registration.tsx
// Section "Inscription" - formulaire complet avec gestion d'etat React
// Pret a etre connecte a un service d'email (Resend, EmailJS, Formspree, etc.)

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Info } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AttendanceChoice = "present" | "absent" | "";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  adultsCount: string;
  childrenCount: string;
  participantNames: string;
  childrenAges: string;
  comments: string;
  attendance: AttendanceChoice;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

// ---------------------------------------------------------------------------
// Valeurs initiales du formulaire
// ---------------------------------------------------------------------------

const INITIAL_FORM: FormState = {
  fullName: "",
  email: "",
  phone: "",
  adultsCount: "",
  childrenCount: "",
  participantNames: "",
  childrenAges: "",
  comments: "",
  attendance: "",
};

// ---------------------------------------------------------------------------
// Sous-composant : champ de saisie
// ---------------------------------------------------------------------------

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, required = false, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-brand-navy">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

// Classes partagees pour les inputs
const inputClass =
  "w-full border border-brand-border rounded-lg px-4 py-3 text-brand-navy text-sm bg-white placeholder:text-brand-gray/60 focus:outline-none focus:ring-2 focus:ring-brand-sky focus:border-transparent transition-shadow";

const textareaClass =
  "w-full border border-brand-border rounded-lg px-4 py-3 text-brand-navy text-sm bg-white placeholder:text-brand-gray/60 focus:outline-none focus:ring-2 focus:ring-brand-sky focus:border-transparent transition-shadow resize-none";

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export default function Registration() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleAttendance(value: AttendanceChoice) {
    setForm((prev) => ({ ...prev, attendance: value }));
  }

  async function handleSubmit() {
    if (!form.fullName || !form.email || !form.attendance) return;

    setStatus("loading");

    // --- Connecter ici votre service d'email ---
    // Exemple avec Formspree : fetch("https://formspree.io/f/VOTRE_ID", { method: "POST", body: JSON.stringify(form) })
    // Exemple avec EmailJS  : emailjs.send("SERVICE_ID", "TEMPLATE_ID", form)
    // Exemple avec Resend   : fetch("/api/contact", { method: "POST", body: JSON.stringify(form) })
    // ------------------------------------------

    // Simulation temporaire (a retirer lors de l'integration)
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus("success");
  }

  // ---------------------------------------------------------------------------
  // Rendu succes
  // ---------------------------------------------------------------------------

  if (status === "success") {
    return (
      <section id="inscription" className="section-beige py-20">
        <div className="max-w-xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold text-brand-navy">
                Inscription envoyee !
              </h3>
              <p className="text-brand-gray leading-relaxed">
                Merci {form.fullName}. Votre inscription a bien ete recue. Nous
                vous contacterons prochainement avec les details de l&apos;evenement.
              </p>
            </div>
            <button
              onClick={() => {
                setForm(INITIAL_FORM);
                setStatus("idle");
              }}
              className="btn-outline"
            >
              Soumettre une autre inscription
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // Rendu formulaire
  // ---------------------------------------------------------------------------

  return (
    <section id="inscription" className="section-beige py-20">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SectionHeading title="S'inscrire a la retraite" />

          {/* Message informatif */}
          <div className="mt-8 flex gap-3 bg-white border-l-4 border-brand-blue rounded-r-xl p-4 shadow-sm">
            <Info className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
            <p className="text-brand-gray text-sm leading-relaxed">
              L&apos;evenement se deroulera de 8h a 18h precises. Veuillez indiquer
              le nombre de personnes (conjoint, conjointe et enfants) ainsi que
              les noms de chaque participant et l&apos;age des enfants.
            </p>
          </div>

          {/* Formulaire */}
          <div className="mt-10 flex flex-col gap-6">

            {/* Choix de presence */}
            <Field label="Votre presence" required>
              <div className="flex flex-col sm:flex-row gap-3 mt-1">
                <button
                  onClick={() => handleAttendance("present")}
                  className={[
                    "flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors",
                    form.attendance === "present"
                      ? "border-brand-purple bg-brand-purple-soft text-brand-purple"
                      : "border-brand-border bg-white text-brand-gray",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                      form.attendance === "present"
                        ? "border-brand-purple"
                        : "border-brand-gray/40",
                    ].join(" ")}
                  >
                    {form.attendance === "present" && (
                      <span className="w-2 h-2 rounded-full bg-brand-purple" />
                    )}
                  </span>
                  Je serai present(e)
                </button>

                <button
                  onClick={() => handleAttendance("absent")}
                  className={[
                    "flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors",
                    form.attendance === "absent"
                      ? "border-rose-400 bg-rose-50 text-rose-600"
                      : "border-brand-border bg-white text-brand-gray",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                      form.attendance === "absent"
                        ? "border-rose-400"
                        : "border-brand-gray/40",
                    ].join(" ")}
                  >
                    {form.attendance === "absent" && (
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                    )}
                  </span>
                  Je ne pourrai pas assister
                </button>
              </div>
            </Field>

            {/* Grille principale */}
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Nom complet" required>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Votre nom et prenom"
                  className={inputClass}
                />
              </Field>

              <Field label="Adresse email" required>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  className={inputClass}
                />
              </Field>

              <Field label="Telephone">
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="514 000-0000"
                  className={inputClass}
                />
              </Field>

              <Field label="Nombre d'adultes">
                <input
                  type="number"
                  name="adultsCount"
                  value={form.adultsCount}
                  onChange={handleChange}
                  placeholder="Ex : 2"
                  min="1"
                  className={inputClass}
                />
              </Field>

              <Field label="Nombre d'enfants">
                <input
                  type="number"
                  name="childrenCount"
                  value={form.childrenCount}
                  onChange={handleChange}
                  placeholder="Ex : 3"
                  min="0"
                  className={inputClass}
                />
              </Field>
            </div>

            {/* Champs pleine largeur */}
            <Field label="Noms des participants">
              <textarea
                name="participantNames"
                value={form.participantNames}
                onChange={handleChange}
                placeholder="Ex : Jean Dupont, Marie Dupont, Lucas (8 ans)..."
                rows={3}
                className={textareaClass}
              />
            </Field>

            <Field label="Ages des enfants">
              <textarea
                name="childrenAges"
                value={form.childrenAges}
                onChange={handleChange}
                placeholder="Ex : Lucas 8 ans, Emma 5 ans, Noah 3 ans..."
                rows={2}
                className={textareaClass}
              />
            </Field>

            <Field label="Commentaires ou questions">
              <textarea
                name="comments"
                value={form.comments}
                onChange={handleChange}
                placeholder="Besoins particuliers, questions, informations supplementaires..."
                rows={4}
                className={textareaClass}
              />
            </Field>

            {/* Erreur validation */}
            {status === "error" && (
              <div className="flex items-center gap-2 text-rose-600 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Une erreur est survenue. Veuillez reessayer ou nous contacter
                directement.
              </div>
            )}

            {/* Bouton submit */}
            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "loading" ? (
                <>
                  <span className="w-4 h-4 border-2 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Envoyer mon inscription
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
// src/components/sections/Registration.tsx
// Section "Inscription" - formulaire complet avec gestion d'etat React
// Connecté à /api/registration via Resend

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Info, ArrowLeft, ArrowRight } from "lucide-react";
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

// Framer Motion Variants for Step Transition
const stepVariants = {
  enter: (dir: "next" | "back") => ({
    x: dir === "next" ? 30 : -30,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (dir: "next" | "back") => ({
    x: dir === "next" ? -30 : 30,
    opacity: 0,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  }),
};

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export default function Registration() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"next" | "back">("next");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleAttendance(value: AttendanceChoice) {
    setForm((prev) => ({ ...prev, attendance: value }));
  }

  function handleNext() {
    if (step === 1 && isStep1Valid) {
      setDirection("next");
      if (form.attendance === "absent") {
        setStep(3);
      } else {
        setStep(2);
      }
    } else if (step === 2) {
      setDirection("next");
      setStep(3);
    }
  }

  function handleBack() {
    setDirection("back");
    if (step === 3 && form.attendance === "absent") {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    }
  }

  async function handleSubmit() {
    if (!form.fullName || !form.email || !form.attendance) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Une erreur est survenue.");
      }

      setStatus("success");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue. Veuillez réessayer.";
      setErrorMessage(message);
      setStatus("error");
    }
  }

  // Validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isStep1Valid =
    form.fullName.trim() !== "" &&
    form.email.trim() !== "" &&
    isEmailValid &&
    form.attendance !== "";

  // Dynamic step titles and progress calculations
  const totalSteps = form.attendance === "absent" ? 2 : 3;
  let currentStepDisplay = 1;
  let progressWidth = "33.33%";
  let stepTitle = "";

  if (step === 1) {
    currentStepDisplay = 1;
    progressWidth = totalSteps === 2 ? "50%" : "33.33%";
    stepTitle = "Informations personnelles";
  } else if (step === 2) {
    currentStepDisplay = 2;
    progressWidth = "66.66%";
    stepTitle = "Détails de la participation";
  } else if (step === 3) {
    currentStepDisplay = totalSteps;
    progressWidth = "100%";
    stepTitle = "Remarques & Commentaires";
  }

  return (
    <section id="inscription" className="section-beige py-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading title="S'inscrire à la retraite" />

        {/* Grille principale : Form a gauche, Image/Info a droite */}
        <div className="mt-12 grid md:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Colonne gauche : Formulaire ou Message de succes */}
          <div className="md:col-span-7 bg-white rounded-2xl border border-brand-border p-6 md:p-8 shadow-sm min-h-115 flex flex-col">
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center text-center gap-6 py-10 my-auto"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-brand-navy">
                    Inscription envoyée !
                  </h3>
                  <p className="text-brand-gray text-sm leading-relaxed max-w-md">
                    Merci <strong className="text-brand-navy">{form.fullName}</strong>. Votre inscription a bien été reçue. Nous
                    vous contacterons prochainement avec les détails de l&apos;événement.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setForm(INITIAL_FORM);
                    setStatus("idle");
                    setErrorMessage("");
                    setStep(1);
                  }}
                  className="btn-outline px-5 py-2.5 text-sm"
                >
                  Soumettre une autre inscription
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col flex-1 gap-6">

                {/* Header Etape / Barre de progression */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-sky">
                      Étape {currentStepDisplay} sur {totalSteps}
                    </span>
                    <span className="text-sm font-semibold text-brand-navy">
                      {stepTitle}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-brand-gray-light rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-gold rounded-full transition-all duration-300 ease-out"
                      style={{ width: progressWidth }}
                    />
                  </div>
                </div>

                {/* Formulaire animé */}
                <div className="grow">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="flex flex-col gap-5"
                    >
                      {step === 1 && (
                        <>
                          {/* Choix de présence */}
                          <Field label="Votre présence" required>
                            <div className="flex flex-col sm:flex-row gap-3 mt-1">
                              <button
                                type="button"
                                onClick={() => handleAttendance("present")}
                                className={[
                                  "flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors cursor-pointer",
                                  form.attendance === "present"
                                    ? "border-brand-purple bg-brand-purple-soft text-brand-purple"
                                    : "border-brand-border bg-white text-brand-gray hover:bg-brand-gray-light",
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
                                Je serai présent(e)
                              </button>

                              <button
                                type="button"
                                onClick={() => handleAttendance("absent")}
                                className={[
                                  "flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors cursor-pointer",
                                  form.attendance === "absent"
                                    ? "border-rose-400 bg-rose-50 text-rose-600"
                                    : "border-brand-border bg-white text-brand-gray hover:bg-brand-gray-light",
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

                          {/* Nom complet */}
                          <Field label="Nom complet" required>
                            <input
                              type="text"
                              name="fullName"
                              value={form.fullName}
                              onChange={handleChange}
                              placeholder="Votre nom et prénom"
                              className={inputClass}
                            />
                          </Field>

                          {/* Email & Phone */}
                          <div className="grid sm:grid-cols-2 gap-4">
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

                            <Field label="Téléphone">
                              <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="514 000-0000"
                                className={inputClass}
                              />
                            </Field>
                          </div>
                        </>
                      )}

                      {step === 2 && form.attendance === "present" && (
                        <>
                          {/* Adultes & Enfants */}
                          <div className="grid grid-cols-2 gap-4">
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

                          {/* Noms des participants */}
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

                          {/* Âges des enfants */}
                          <Field label="Âges des enfants">
                            <textarea
                              name="childrenAges"
                              value={form.childrenAges}
                              onChange={handleChange}
                              placeholder="Ex : Lucas 8 ans, Emma 5 ans, Noah 3 ans..."
                              rows={2}
                              className={textareaClass}
                            />
                          </Field>
                        </>
                      )}

                      {step === 3 && (
                        <>
                          {form.attendance === "absent" && (
                            <div className="bg-brand-gray-light/50 border border-brand-border rounded-xl p-4 text-sm text-brand-gray">
                              <p className="leading-relaxed">
                                Puisque vous ne pouvez pas assister, vous pouvez laisser un message ou une remarque ci-dessous à l&apos;intention des organisateurs si vous le souhaitez.
                              </p>
                            </div>
                          )}

                          {/* Commentaires */}
                          <Field label="Commentaires ou questions">
                            <textarea
                              name="comments"
                              value={form.comments}
                              onChange={handleChange}
                              placeholder="Besoins particuliers, questions, informations supplémentaires..."
                              rows={5}
                              className={textareaClass}
                            />
                          </Field>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Actions (Retour / Suivant / Valider) */}
                <div className="border-t border-brand-border pt-4 mt-auto">
                  {/* Erreur de soumission */}
                  {status === "error" && (
                    <div className="flex items-center gap-2 text-rose-600 text-xs sm:text-sm mb-4">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {errorMessage || "Une erreur est survenue. Veuillez réessayer ou nous contacter directement."}
                    </div>
                  )}

                  <div className="flex justify-between items-center gap-4">
                    {step < 3 ? (
                      <>
                        {step > 1 && (
                          <button
                            type="button"
                            onClick={handleBack}
                            className="btn-outline px-6 py-3 text-sm flex items-center gap-2 cursor-pointer"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            Retour
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleNext}
                          disabled={step === 1 && !isStep1Valid}
                          className="btn-primary w-full sm:w-auto ml-auto px-6 py-3 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Suivant
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handleBack}
                          disabled={status === "loading"}
                          className="btn-outline px-6 py-3 text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Retour
                        </button>

                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={status === "loading"}
                          className="btn-primary px-6 py-3 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {status === "loading" ? (
                            <>
                              <span className="w-4 h-4 border-2 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin" />
                              Envoi en cours...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Confirmer l&apos;inscription
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Colonne droite : Image en paysage & Boite d'infos */}
          <div className="md:col-span-5 md:sticky md:top-24 flex flex-col gap-6">
            {/* Image paysage 16/10 */}
            <div className="relative w-full aspect-16/10 rounded-2xl overflow-hidden shadow-lg border border-brand-border/40">
              <Image
                src="/images/hero4.jpeg"
                alt="Retraite des couples CCAC"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
            </div>

            {/* Boite informative */}
            <div className="bg-white border-l-4 border-brand-blue rounded-r-xl p-5 shadow-sm border">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-bold text-brand-navy">Informations importantes</h4>
                  <p className="text-brand-gray text-xs sm:text-sm leading-relaxed">
                    L&apos;événement se déroulera de 8h à 16h précises. Veuillez indiquer le nombre de personnes (conjoint, conjointe et enfants) ainsi que les noms de chaque participant et l&apos;âge des enfants.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
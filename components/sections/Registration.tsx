// src/components/sections/Registration.tsx
// Section "Inscription" - formulaire complet avec gestion d'etat React
// Connecté à /api/registration
//
// Parcours :
//   1) Informations personnelles + présence
//   2) Nombre d'adultes / d'enfants (uniquement si présent)
//   3) Un écran par participant (prénom, nom, âge si enfant, allergies)
//   4) Commentaires globaux
//
// Si "absent" : on saute directement de l'étape 1 aux commentaires.

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Info, ArrowLeft, ArrowRight, User, Baby } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AttendanceChoice = "present" | "absent" | "";
type ParticipantType = "adult" | "child";

interface Participant {
  id: string;
  type: ParticipantType;
  firstName: string;
  lastName: string;
  age: string; // uniquement pertinent pour les enfants
  allergies: string;
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  adultsCount: string;
  childrenCount: string;
  participants: Participant[];
  comments: string;
  attendance: AttendanceChoice;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

// Une "phase" regroupe un ou plusieurs écrans. La phase "participants"
// contient plusieurs sous-écrans (un par personne), pilotés par participantIndex.
type Phase = "info" | "counts" | "participants" | "comments";

// ---------------------------------------------------------------------------
// Constantes / helpers
// ---------------------------------------------------------------------------

const MAX_PARTICIPANTS_PER_TYPE = 15;

const INITIAL_FORM: FormState = {
  fullName: "",
  email: "",
  phone: "",
  adultsCount: "",
  childrenCount: "",
  participants: [],
  comments: "",
  attendance: "",
};

function createParticipant(type: ParticipantType): Participant {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    firstName: "",
    lastName: "",
    age: "",
    allergies: "",
  };
}

// Reconstruit la liste des participants à partir des compteurs, en
// préservant les infos déjà saisies si l'utilisateur revient modifier les nombres.
function syncParticipants(
  adultsCount: string,
  childrenCount: string,
  existing: Participant[]
): Participant[] {
  const adults = Math.min(
    Math.max(parseInt(adultsCount || "0", 10) || 0, 0),
    MAX_PARTICIPANTS_PER_TYPE
  );
  const children = Math.min(
    Math.max(parseInt(childrenCount || "0", 10) || 0, 0),
    MAX_PARTICIPANTS_PER_TYPE
  );

  const existingAdults = existing.filter((p) => p.type === "adult");
  const existingChildren = existing.filter((p) => p.type === "child");

  const nextAdults = Array.from(
    { length: adults },
    (_, i) => existingAdults[i] ?? createParticipant("adult")
  );
  const nextChildren = Array.from(
    { length: children },
    (_, i) => existingChildren[i] ?? createParticipant("child")
  );

  return [...nextAdults, ...nextChildren];
}

function participantLabel(participants: Participant[], index: number): string {
  const p = participants[index];
  if (!p) return "";
  const sameTypeBefore = participants.slice(0, index).filter((x) => x.type === p.type).length;
  return `${p.type === "adult" ? "Adulte" : "Enfant"} ${sameTypeBefore + 1}`;
}

// ---------------------------------------------------------------------------
// Sous-composant : champ de saisie
// ---------------------------------------------------------------------------

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

function Field({ label, required = false, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-brand-navy">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-brand-gray/70">{hint}</p>}
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
  const [phase, setPhase] = useState<Phase>("info");
  const [participantIndex, setParticipantIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "back">("next");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleParticipantChange(
    index: number,
    field: "firstName" | "lastName" | "age" | "allergies",
    value: string
  ) {
    setForm((prev) => {
      const next = [...prev.participants];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, participants: next };
    });
  }

  function handleAttendance(value: AttendanceChoice) {
    setForm((prev) => ({ ...prev, attendance: value }));
  }

  // -------------------------------------------------------------------
  // Validation par écran
  // -------------------------------------------------------------------

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isInfoValid =
    form.fullName.trim() !== "" &&
    form.email.trim() !== "" &&
    isEmailValid &&
    form.attendance !== "";

  const totalPeopleAnnounced =
    (parseInt(form.adultsCount || "0", 10) || 0) +
    (parseInt(form.childrenCount || "0", 10) || 0);
  const isCountsValid = totalPeopleAnnounced >= 1;

  const currentParticipant = form.participants[participantIndex];
  const isCurrentParticipantValid = currentParticipant
    ? currentParticipant.firstName.trim() !== "" &&
      currentParticipant.lastName.trim() !== "" &&
      (currentParticipant.type === "adult" || currentParticipant.age.trim() !== "")
    : true;

  // -------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------

  function handleNext() {
    setDirection("next");

    if (phase === "info") {
      if (!isInfoValid) return;
      setPhase(form.attendance === "absent" ? "comments" : "counts");
      return;
    }

    if (phase === "counts") {
      if (!isCountsValid) return;
      const nextParticipants = syncParticipants(
        form.adultsCount,
        form.childrenCount,
        form.participants
      );
      setForm((prev) => ({ ...prev, participants: nextParticipants }));
      if (nextParticipants.length === 0) {
        setPhase("comments");
        return;
      }
      setParticipantIndex(0);
      setPhase("participants");
      return;
    }

    if (phase === "participants") {
      if (!isCurrentParticipantValid) return;
      if (participantIndex < form.participants.length - 1) {
        setParticipantIndex((i) => i + 1);
      } else {
        setPhase("comments");
      }
      return;
    }
  }

  function handleBack() {
    setDirection("back");

    if (phase === "comments") {
      if (form.attendance === "absent") {
        setPhase("info");
        return;
      }
      if (form.participants.length > 0) {
        setParticipantIndex(form.participants.length - 1);
        setPhase("participants");
      } else {
        setPhase("counts");
      }
      return;
    }

    if (phase === "participants") {
      if (participantIndex > 0) {
        setParticipantIndex((i) => i - 1);
      } else {
        setPhase("counts");
      }
      return;
    }

    if (phase === "counts") {
      setPhase("info");
      return;
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

  // -------------------------------------------------------------------
  // Progression / titres d'écran
  // -------------------------------------------------------------------

  const isAbsent = form.attendance === "absent";
  // Ecrans : info(1) + counts(1) + participants(N) + comments(1)
  const totalScreens = isAbsent ? 2 : 3 + form.participants.length;

  let currentScreen = 1;
  let stepTitle = "";

  if (phase === "info") {
    currentScreen = 1;
    stepTitle = "Informations personnelles";
  } else if (phase === "counts") {
    currentScreen = 2;
    stepTitle = "Nombre de participants";
  } else if (phase === "participants") {
    currentScreen = 3 + participantIndex;
    stepTitle = participantLabel(form.participants, participantIndex);
  } else if (phase === "comments") {
    currentScreen = totalScreens;
    stepTitle = "Remarques & Commentaires";
  }

  const progressWidth = `${Math.min((currentScreen / totalScreens) * 100, 100)}%`;

  const isNextDisabled =
    (phase === "info" && !isInfoValid) ||
    (phase === "counts" && !isCountsValid) ||
    (phase === "participants" && !isCurrentParticipantValid);

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
                    setPhase("info");
                    setParticipantIndex(0);
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
                      Étape {currentScreen} sur {totalScreens}
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
                      key={phase === "participants" ? `participant-${participantIndex}` : phase}
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="flex flex-col gap-5"
                    >
                      {phase === "info" && (
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

                      {phase === "counts" && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <Field label="Nombre d'adultes" required>
                              <input
                                type="number"
                                name="adultsCount"
                                value={form.adultsCount}
                                onChange={handleChange}
                                placeholder="Ex : 2"
                                min="0"
                                className={inputClass}
                              />
                            </Field>

                            <Field label="Nombre d'enfants" required>
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
                          <p className="text-xs text-brand-gray/70 -mt-2">
                            À l&apos;étape suivante, nous vous demanderons le prénom, le nom
                            {" "}et quelques informations pour chaque personne.
                          </p>
                        </>
                      )}

                      {phase === "participants" && currentParticipant && (
                        <div className="rounded-xl border border-brand-border bg-brand-gray-light/40 p-5 flex flex-col gap-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={[
                                "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                                currentParticipant.type === "adult"
                                  ? "bg-brand-purple-soft text-brand-purple"
                                  : "bg-amber-50 text-amber-600",
                              ].join(" ")}
                            >
                              {currentParticipant.type === "adult" ? (
                                <User className="w-4 h-4" />
                              ) : (
                                <Baby className="w-4 h-4" />
                              )}
                            </span>
                            <span className="text-sm font-bold text-brand-navy">
                              {participantLabel(form.participants, participantIndex)}
                            </span>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Prénom" required>
                              <input
                                type="text"
                                value={currentParticipant.firstName}
                                onChange={(e) =>
                                  handleParticipantChange(participantIndex, "firstName", e.target.value)
                                }
                                placeholder="Prénom"
                                className={inputClass}
                              />
                            </Field>

                            <Field label="Nom" required>
                              <input
                                type="text"
                                value={currentParticipant.lastName}
                                onChange={(e) =>
                                  handleParticipantChange(participantIndex, "lastName", e.target.value)
                                }
                                placeholder="Nom"
                                className={inputClass}
                              />
                            </Field>
                          </div>

                          {currentParticipant.type === "child" && (
                            <Field label="Âge" required>
                              <input
                                type="number"
                                min="0"
                                value={currentParticipant.age}
                                onChange={(e) =>
                                  handleParticipantChange(participantIndex, "age", e.target.value)
                                }
                                placeholder="Ex : 8"
                                className={inputClass}
                              />
                            </Field>
                          )}

                          <Field
                            label="Allergies ou informations complémentaires"
                            hint="Optionnel - indiquez « Aucune » si rien à signaler"
                          >
                            <textarea
                              value={currentParticipant.allergies}
                              onChange={(e) =>
                                handleParticipantChange(participantIndex, "allergies", e.target.value)
                              }
                              placeholder="Ex : Allergie aux arachides, régime végétarien..."
                              rows={2}
                              className={textareaClass}
                            />
                          </Field>
                        </div>
                      )}

                      {phase === "comments" && (
                        <>
                          {isAbsent && (
                            <div className="bg-brand-gray-light/50 border border-brand-border rounded-xl p-4 text-sm text-brand-gray">
                              <p className="leading-relaxed">
                                Puisque vous ne pouvez pas assister, vous pouvez laisser un message ou une remarque ci-dessous à l&apos;intention des organisateurs si vous le souhaitez.
                              </p>
                            </div>
                          )}

                          {/* Commentaires globaux */}
                          <Field
                            label="Informations complémentaires générales"
                            hint="Ex : besoins d'accessibilité, questions logistiques, précisions sur votre arrivée..."
                          >
                            <textarea
                              name="comments"
                              value={form.comments}
                              onChange={handleChange}
                              placeholder="Toute autre information utile pour les organisateurs..."
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
                    {phase !== "comments" ? (
                      <>
                        {phase !== "info" && (
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
                          disabled={isNextDisabled}
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
                src="/images/hero.jpeg"
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
                    L&apos;événement se déroulera de 8h à 16h précises. Nous vous guiderons pas à pas pour renseigner le prénom, le nom, etpour les enfants l&apos;âge de chaque participant, ainsi que toute allergie à signaler.
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
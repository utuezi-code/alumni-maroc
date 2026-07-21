"use client";

import { FormEvent, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

const SECTORS = [
  "Banque / Finance",
  "Administration publique",
  "Industrie",
  "Tech",
  "Agro-industrie",
  "Défense / Sécurité",
  "Conseil",
  "Santé",
  "Éducation",
  "Autre",
];

type Status = { message: string; state: "success" | "error" | null };

export default function RegistrationForm() {
  const [status, setStatus] = useState<Status>({ message: "", state: null });
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus({ message: "", state: null });

    if (!form.reportValidity()) {
      setTouched(true);
      return;
    }

    if (!supabase || !isSupabaseConfigured) {
      setStatus({
        message:
          "Le formulaire n'est pas encore connecté à la base de données. Configurez les variables d'environnement Supabase.",
        state: "error",
      });
      return;
    }

    const data = new FormData(form);
    const payload = {
      full_name: data.get("fullName")?.toString().trim(),
      school: data.get("school")?.toString().trim(),
      graduation_year: Number(data.get("graduationYear")),
      nationality: data.get("nationality")?.toString().trim(),
      sector: data.get("sector")?.toString().trim(),
      email: data.get("email")?.toString().trim(),
      whatsapp: data.get("whatsapp")?.toString().trim() || null,
    };

    setLoading(true);
    const { error } = await supabase.from("inscriptions").insert([payload]);
    setLoading(false);

    if (error) {
      console.error(error);
      setStatus({
        message: "Une erreur est survenue. Merci de réessayer dans un instant.",
        state: "error",
      });
      return;
    }

    setStatus({
      message: "Inscription enregistrée. Bienvenue dans la communauté !",
      state: "success",
    });
    form.reset();
    setTouched(false);
  }

  const fieldClass = touched ? "is-touched" : "";

  return (
    <section className="registration" id="inscription">
      <div className="registration__inner">
        <div className="registration__intro">
          <h2>Rejoindre l&apos;annuaire</h2>
          <p>
            Deux minutes pour intégrer la communauté. Vos informations ne
            servent qu&apos;à construire l&apos;annuaire des membres.
          </p>
        </div>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form__row">
            <label htmlFor="fullName">
              Nom complet <span aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              autoComplete="name"
              required
              className={fieldClass}
            />
          </div>

          <div className="form__row">
            <label htmlFor="school">
              École / université au Maroc <span aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="school"
              name="school"
              required
              className={fieldClass}
            />
          </div>

          <div className="form__row form__row--split">
            <div className="form__field">
              <label htmlFor="graduationYear">
                Année de sortie <span aria-hidden="true">*</span>
              </label>
              <input
                type="number"
                id="graduationYear"
                name="graduationYear"
                min={1980}
                max={2030}
                inputMode="numeric"
                required
                className={fieldClass}
              />
            </div>
            <div className="form__field">
              <label htmlFor="nationality">
                Nationalité <span aria-hidden="true">*</span>
              </label>
              <input
                type="text"
                id="nationality"
                name="nationality"
                required
                className={fieldClass}
              />
            </div>
          </div>

          <div className="form__row">
            <label htmlFor="sector">
              Secteur d&apos;activité <span aria-hidden="true">*</span>
            </label>
            <select
              id="sector"
              name="sector"
              required
              defaultValue=""
              className={fieldClass}
            >
              <option value="" disabled>
                Sélectionnez un secteur
              </option>
              {SECTORS.map((sector) => (
                <option value={sector} key={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>

          <div className="form__row form__row--split">
            <div className="form__field">
              <label htmlFor="email">
                Email <span aria-hidden="true">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                className={fieldClass}
              />
            </div>
            <div className="form__field">
              <label htmlFor="whatsapp">WhatsApp</label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                autoComplete="tel"
                placeholder="+225 07 00 00 00 00"
                className={fieldClass}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn--accent btn--lg form__submit"
            disabled={loading}
          >
            <span className="form__submit-label">
              {loading ? "Envoi en cours…" : "Envoyer mon inscription"}
            </span>
          </button>

          <p className="form__status" role="status" aria-live="polite" data-state={status.state ?? undefined}>
            {status.message}
          </p>
        </form>
      </div>
    </section>
  );
}

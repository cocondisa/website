"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/ui/Button";
import type { CreneauDisponible } from "@/types";

export default function BookingForm({
  creneau,
  onCreneauIndisponible,
}: {
  creneau: CreneauDisponible;
  onCreneauIndisponible: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      creneauId: creneau.id,
      nomComplet: String(formData.get("nomComplet") ?? ""),
      email: String(formData.get("email") ?? ""),
      telephone: String(formData.get("telephone") ?? ""),
      infosBebe: String(formData.get("infosBebe") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        setError(
          "Ce créneau vient d'être réservé par quelqu'un d'autre. Merci de choisir un autre horaire."
        );
        onCreneauIndisponible();
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Une erreur est survenue. Merci de réessayer.");
        setSubmitting(false);
        return;
      }

      const data = await res.json();
      if (!data.checkoutUrl) {
        setError("Une erreur est survenue. Merci de réessayer.");
        setSubmitting(false);
        return;
      }
      // Pas de setSubmitting(false) ici : la page quitte vers Stripe Checkout.
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Une erreur réseau est survenue. Merci de réessayer.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Nom complet" name="nomComplet" required autoComplete="name" />
        <Field label="Téléphone" name="telephone" type="tel" required autoComplete="tel" />
      </div>

      <Field label="E-mail" name="email" type="email" required autoComplete="email" />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="infosBebe" className="text-sm font-medium text-walnut">
          Informations sur bébé{" "}
          <span className="font-normal text-body">(optionnel)</span>
        </label>
        <textarea
          id="infosBebe"
          name="infosBebe"
          rows={2}
          className="rounded-xl border border-border bg-parchment px-4 py-2.5 text-sm text-walnut focus:border-accent focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          placeholder="Âge, particularités, etc."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-walnut">
          Message <span className="font-normal text-body">(optionnel)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className="rounded-xl border border-border bg-parchment px-4 py-2.5 text-sm text-walnut focus:border-accent focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-error">
          {error}
        </p>
      )}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Envoi en cours…" : "Confirmer le rendez-vous"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-walnut">
        {label} {required && <span className="text-error">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="rounded-xl border border-border bg-parchment px-4 py-2.5 text-sm text-walnut focus:border-accent focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      />
    </div>
  );
}

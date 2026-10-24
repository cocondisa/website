"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { isPrestationId, prestationsList, type PrestationId } from "@/lib/prestations";

// La garde de nuit a un tarif variable (distance du domicile) : son prix
// n'est connu qu'à la réservation, donc pas proposable en carte cadeau.
const prestationsOffrables = prestationsList.filter((p) => !p.tarifVariable);

export default function OffrirForm() {
  const searchParams = useSearchParams();
  const prestationParam = searchParams.get("prestation");
  const prestationInitiale =
    prestationParam && isPrestationId(prestationParam) && prestationsOffrables.some((p) => p.id === prestationParam)
      ? prestationParam
      : null;

  const [prestationId, setPrestationId] = useState<PrestationId | null>(prestationInitiale);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prestation = prestationId ? prestationsOffrables.find((p) => p.id === prestationId) : null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!prestationId) return;
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      prestationId,
      acheteurNom: String(formData.get("acheteurNom") ?? ""),
      acheteurEmail: String(formData.get("acheteurEmail") ?? ""),
      destinataireEmail: String(formData.get("destinataireEmail") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const res = await fetch("/api/cartes-cadeaux", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

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
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Une erreur réseau est survenue. Merci de réessayer.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-10">
      <div>
        <h2 className="text-xl font-semibold text-walnut">1. Choisissez une prestation</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {prestationsOffrables.map((p) => {
            const isSelected = p.id === prestationId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPrestationId(p.id)}
                aria-pressed={isSelected}
                className={`flex flex-col gap-1.5 rounded-2xl border p-5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                  isSelected
                    ? "border-accent bg-accent/10"
                    : "border-border bg-white/60 hover:border-accent"
                }`}
              >
                <p className="text-base font-semibold text-walnut">{p.nom}</p>
                <p className="text-sm font-medium text-sage">{p.prixLabel}</p>
              </button>
            );
          })}
        </div>
      </div>

      {prestation && (
        <div>
          <h2 className="text-xl font-semibold text-walnut">2. Vos informations</h2>
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5" noValidate>
            <p className="rounded-xl border border-border bg-peach/40 px-4 py-3 text-sm text-walnut">
              Cadeau choisi : <strong>{prestation.nom}</strong> — {prestation.prixLabel}
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Votre nom" name="acheteurNom" required autoComplete="name" />
              <Field label="Votre e-mail" name="acheteurEmail" type="email" required autoComplete="email" />
            </div>

            <Field
              label="E-mail du destinataire"
              name="destinataireEmail"
              type="email"
              required
              autoComplete="off"
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm font-medium text-walnut">
                Message <span className="font-normal text-body">(optionnel)</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                className="rounded-xl border border-border bg-parchment px-4 py-2.5 text-sm text-walnut focus:border-accent focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                placeholder="Un petit mot pour accompagner le cadeau..."
              />
            </div>

            {error && (
              <p role="alert" className="text-sm font-medium text-error">
                {error}
              </p>
            )}

            <Button type="submit" disabled={submitting}>
              {submitting ? "Redirection vers le paiement…" : `Offrir pour ${prestation.prixLabel}`}
            </Button>
          </form>
        </div>
      )}
    </div>
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

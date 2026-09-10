"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

type CreneauAdmin = {
  id: string;
  date: string;
  dureeMinutes: number;
  disponible: boolean;
  reservation: {
    id: string;
    nomComplet: string;
    email: string;
    telephone: string;
    statut: "EN_ATTENTE_PAIEMENT" | "CONFIRMEE" | "ANNULEE";
  } | null;
};

const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

const statutLabels: Record<string, { label: string; className: string }> = {
  EN_ATTENTE_PAIEMENT: { label: "Paiement en cours", className: "bg-peach/60 text-walnut" },
  CONFIRMEE: { label: "Confirmé", className: "bg-success/20 text-success" },
  ANNULEE: { label: "Annulé", className: "bg-error/10 text-error" },
};

export default function AdminDashboard() {
  const router = useRouter();
  const [creneaux, setCreneaux] = useState<CreneauAdmin[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/creneaux")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setCreneaux(data.creneaux);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger les créneaux.");
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  function reload() {
    setRefreshKey((key) => key + 1);
  }

  async function handleAddCreneau(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSubmitting(true);

    // On capture la référence avant l'await : React remet
    // `event.currentTarget` à null une fois le gestionnaire suspendu.
    const form = event.currentTarget;
    const formData = new FormData(form);
    const jour = String(formData.get("jour") ?? "");
    const heure = String(formData.get("heure") ?? "");

    if (!jour || !heure) {
      setFormError("Merci de renseigner une date et une heure.");
      setSubmitting(false);
      return;
    }

    const date = new Date(`${jour}T${heure}:00`);

    try {
      const res = await fetch("/api/admin/creneaux", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: date.toISOString(), dureeMinutes: 90 }),
      });

      if (!res.ok) {
        setFormError("Impossible d'ajouter ce créneau.");
        return;
      }

      form.reset();
      reload();
    } catch {
      setFormError("Une erreur réseau est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce créneau ?")) return;

    const res = await fetch(`/api/admin/creneaux/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.error ?? "Impossible de supprimer ce créneau.");
      return;
    }
    reload();
  }

  async function handleCancelReservation(reservationId: string) {
    if (!confirm("Annuler cette réservation et libérer le créneau ?")) return;

    const res = await fetch(`/api/admin/reservations/${reservationId}`, {
      method: "PATCH",
    });
    if (!res.ok) {
      alert("Impossible d'annuler cette réservation.");
      return;
    }
    reload();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-walnut">Gestion des créneaux</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-accent underline underline-offset-4"
        >
          Se déconnecter
        </button>
      </div>

      <form
        onSubmit={handleAddCreneau}
        className="flex flex-wrap items-end gap-4 rounded-2xl border border-border bg-white/60 p-6"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="jour" className="text-sm font-medium text-walnut">
            Date
          </label>
          <input
            id="jour"
            name="jour"
            type="date"
            required
            className="rounded-xl border border-border bg-parchment px-3 py-2 text-sm text-walnut focus:border-accent focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="heure" className="text-sm font-medium text-walnut">
            Heure
          </label>
          <input
            id="heure"
            name="heure"
            type="time"
            required
            className="rounded-xl border border-border bg-parchment px-3 py-2 text-sm text-walnut focus:border-accent focus:outline-none"
          />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Ajout…" : "Ajouter le créneau"}
        </Button>
        {formError && (
          <p role="alert" className="w-full text-sm font-medium text-error">
            {formError}
          </p>
        )}
      </form>

      {error && <p className="text-sm text-error">{error}</p>}

      {!creneaux ? (
        <p className="text-sm text-body">Chargement…</p>
      ) : creneaux.length === 0 ? (
        <p className="text-sm text-body">Aucun créneau à venir. Ajoutez-en un ci-dessus.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-white/60">
          {creneaux.map((creneau) => {
            const statut = creneau.reservation
              ? statutLabels[creneau.reservation.statut]
              : null;

            return (
              <div
                key={creneau.id}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
              >
                <div>
                  <p className="text-sm font-semibold capitalize text-walnut">
                    {dateTimeFormatter.format(new Date(creneau.date))}
                  </p>
                  {creneau.reservation ? (
                    <p className="text-xs text-body">
                      {creneau.reservation.nomComplet} — {creneau.reservation.email} —{" "}
                      {creneau.reservation.telephone}
                    </p>
                  ) : (
                    <p className="text-xs text-body">Disponible</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {statut && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statut.className}`}
                    >
                      {statut.label}
                    </span>
                  )}
                  {creneau.reservation && creneau.reservation.statut !== "ANNULEE" ? (
                    <button
                      type="button"
                      onClick={() => handleCancelReservation(creneau.reservation!.id)}
                      className="text-sm text-error underline underline-offset-4"
                    >
                      Annuler la réservation
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleDelete(creneau.id)}
                      className="text-sm text-error underline underline-offset-4"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

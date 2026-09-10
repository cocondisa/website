"use client";

import { FormEvent, useEffect, useState } from "react";
import Button from "@/components/ui/Button";

type Disponibilite = {
  lundi: boolean;
  mardi: boolean;
  mercredi: boolean;
  jeudi: boolean;
  vendredi: boolean;
  samedi: boolean;
  dimanche: boolean;
  heureDebut: string;
  heureFin: string;
  dureeCreneauMinutes: number;
  maxRdvParJour: number;
};

const jours: { cle: keyof Disponibilite; label: string }[] = [
  { cle: "lundi", label: "Lundi" },
  { cle: "mardi", label: "Mardi" },
  { cle: "mercredi", label: "Mercredi" },
  { cle: "jeudi", label: "Jeudi" },
  { cle: "vendredi", label: "Vendredi" },
  { cle: "samedi", label: "Samedi" },
  { cle: "dimanche", label: "Dimanche" },
];

export default function DisponibilitesSettings() {
  const [dispo, setDispo] = useState<Disponibilite | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/disponibilites")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setDispo(data.disponibilite);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger les disponibilités.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function toggleJour(cle: keyof Disponibilite) {
    setDispo((prev) => (prev ? { ...prev, [cle]: !prev[cle] } : prev));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!dispo) return;
    setSaving(true);
    setFeedback(null);
    setError(null);

    try {
      const res = await fetch("/api/admin/disponibilites", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dispo),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Impossible d'enregistrer.");
        return;
      }

      const data = await res.json();
      setFeedback(
        `Enregistré — ${data.crees} créneau${data.crees > 1 ? "x" : ""} créé${data.crees > 1 ? "s" : ""}, ${data.supprimes} retiré${data.supprimes > 1 ? "s" : ""}.`
      );
    } catch {
      setError("Une erreur réseau est survenue.");
    } finally {
      setSaving(false);
    }
  }

  if (!dispo) {
    return <p className="text-sm text-body">{error ?? "Chargement…"}</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-2xl border border-border bg-white/60 p-6"
    >
      <div>
        <p className="text-sm font-medium text-walnut">Jours travaillés</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {jours.map(({ cle, label }) => {
            const actif = dispo[cle] as boolean;
            return (
              <button
                key={cle}
                type="button"
                onClick={() => toggleJour(cle)}
                aria-pressed={actif}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  actif
                    ? "border-accent bg-accent text-parchment"
                    : "border-border bg-parchment text-walnut hover:border-accent"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="heureDebut" className="text-sm font-medium text-walnut">
            Heure de début
          </label>
          <input
            id="heureDebut"
            type="time"
            value={dispo.heureDebut}
            onChange={(e) => setDispo({ ...dispo, heureDebut: e.target.value })}
            className="rounded-xl border border-border bg-parchment px-3 py-2 text-sm text-walnut focus:border-accent focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="heureFin" className="text-sm font-medium text-walnut">
            Heure de fin
          </label>
          <input
            id="heureFin"
            type="time"
            value={dispo.heureFin}
            onChange={(e) => setDispo({ ...dispo, heureFin: e.target.value })}
            className="rounded-xl border border-border bg-parchment px-3 py-2 text-sm text-walnut focus:border-accent focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="duree" className="text-sm font-medium text-walnut">
            Durée d&apos;un créneau (min)
          </label>
          <input
            id="duree"
            type="number"
            min={15}
            max={480}
            step={5}
            value={dispo.dureeCreneauMinutes}
            onChange={(e) =>
              setDispo({ ...dispo, dureeCreneauMinutes: Number(e.target.value) })
            }
            className="w-32 rounded-xl border border-border bg-parchment px-3 py-2 text-sm text-walnut focus:border-accent focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="maxParJour" className="text-sm font-medium text-walnut">
            Max. RDV / jour
          </label>
          <input
            id="maxParJour"
            type="number"
            min={1}
            max={50}
            value={dispo.maxRdvParJour}
            onChange={(e) => setDispo({ ...dispo, maxRdvParJour: Number(e.target.value) })}
            className="w-32 rounded-xl border border-border bg-parchment px-3 py-2 text-sm text-walnut focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? "Enregistrement…" : "Enregistrer"}
        </Button>
        {feedback && <p className="text-sm text-success">{feedback}</p>}
        {error && <p className="text-sm text-error">{error}</p>}
      </div>

      <p className="text-xs text-body">
        Les créneaux à venir sont générés automatiquement selon ces règles
        (sur ~4 mois glissants), en tenant compte des vacances définies
        ci-dessous. Une fois le nombre maximal de RDV atteint sur une
        journée, celle-ci n&apos;est plus proposée aux visiteurs du site.
      </p>
    </form>
  );
}

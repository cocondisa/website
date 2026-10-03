"use client";

import { FormEvent, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { prestationsList, type PrestationId } from "@/lib/prestations";

type Disponibilite = {
  lundiMatin: boolean;
  lundiApresMidi: boolean;
  mardiMatin: boolean;
  mardiApresMidi: boolean;
  mercrediMatin: boolean;
  mercrediApresMidi: boolean;
  jeudiMatin: boolean;
  jeudiApresMidi: boolean;
  vendrediMatin: boolean;
  vendrediApresMidi: boolean;
  samediMatin: boolean;
  samediApresMidi: boolean;
  dimancheMatin: boolean;
  dimancheApresMidi: boolean;
  heureDebut: string;
  heureMidi: string;
  heureFin: string;
  maxRdvParJour: number;
};

const jours: { prefix: string; label: string }[] = [
  { prefix: "lundi", label: "Lundi" },
  { prefix: "mardi", label: "Mardi" },
  { prefix: "mercredi", label: "Mercredi" },
  { prefix: "jeudi", label: "Jeudi" },
  { prefix: "vendredi", label: "Vendredi" },
  { prefix: "samedi", label: "Samedi" },
  { prefix: "dimanche", label: "Dimanche" },
];

function ajouterMinutes(heure: string, minutes: number): string {
  const [h, m] = heure.split(":").map(Number);
  const total = ((h * 60 + m + minutes) % (24 * 60) + 24 * 60) % (24 * 60);
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export default function DisponibilitesSettings() {
  const [serviceId, setServiceId] = useState<PrestationId>(prestationsList[0].id);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap gap-1.5 rounded-full border border-border bg-white/60 p-1">
        {prestationsList.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setServiceId(p.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              p.id === serviceId
                ? "bg-accent text-parchment"
                : "text-walnut/70 hover:bg-peach/40"
            }`}
          >
            {p.nom}
          </button>
        ))}
      </div>

      <DisponibiliteForm key={serviceId} serviceId={serviceId} />
    </div>
  );
}

function DisponibiliteForm({ serviceId }: { serviceId: PrestationId }) {
  const [dispo, setDispo] = useState<Disponibilite | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const prestation = prestationsList.find((p) => p.id === serviceId)!;
  // Nocturne (garde de nuit) et plage fixe (ex. brunch entre midi et deux)
  // partagent la même UI simplifiée : un seul créneau par jour, pas de
  // bascule "Matin".
  const planningSimplifie = prestation.nocturne || Boolean(prestation.plageFixe);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/admin/disponibilites?serviceId=${serviceId}`)
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
  }, [serviceId]);

  function toggle(cle: string) {
    setDispo((prev) =>
      prev ? { ...prev, [cle]: !(prev as unknown as Record<string, boolean>)[cle] } : prev
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!dispo) return;
    setSaving(true);
    setFeedback(null);
    setError(null);

    const payload = prestation.nocturne
      ? { ...dispo, heureFin: ajouterMinutes(dispo.heureDebut, prestation.dureeMinutes) }
      : prestation.plageFixe
        ? {
            ...dispo,
            heureDebut: prestation.plageFixe.debut,
            heureMidi: prestation.plageFixe.debut,
            heureFin: prestation.plageFixe.fin,
          }
        : dispo;

    try {
      const res = await fetch("/api/admin/disponibilites", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, ...payload }),
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
      className="flex h-full flex-col gap-6 rounded-2xl border border-border bg-white/60 p-6"
    >
      <div>
        <p className="text-sm font-medium text-walnut">
          {prestation.nocturne
            ? "Nuits travaillées"
            : prestation.plageFixe
              ? "Jours proposés"
              : "Jours et demi-journées travaillés"}
        </p>
        <div className="mt-3 flex flex-col gap-1.5">
          {jours.map(({ prefix, label }) => {
            const matinCle = `${prefix}Matin`;
            const apresMidiCle = `${prefix}ApresMidi`;
            const d = dispo as unknown as Record<string, boolean>;
            return (
              <div key={prefix} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-sm text-walnut">{label}</span>
                <div className="inline-flex overflow-hidden rounded-full border border-border">
                  {!planningSimplifie && (
                    <button
                      type="button"
                      onClick={() => toggle(matinCle)}
                      aria-pressed={d[matinCle]}
                      className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                        d[matinCle]
                          ? "bg-accent text-parchment"
                          : "bg-parchment text-walnut/60 hover:bg-peach/40"
                      }`}
                    >
                      Matin
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => toggle(apresMidiCle)}
                    aria-pressed={d[apresMidiCle]}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      !planningSimplifie ? "border-l border-border" : ""
                    } ${
                      d[apresMidiCle]
                        ? "bg-accent text-parchment"
                        : "bg-parchment text-walnut/60 hover:bg-peach/40"
                    }`}
                  >
                    {prestation.nocturne
                      ? "Nuit disponible"
                      : prestation.plageFixe
                        ? "Jour disponible"
                        : "Après-midi"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {prestation.plageFixe ? (
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-walnut">Horaire</span>
            <p className="flex items-center rounded-xl border border-border bg-parchment px-3 py-2 text-sm text-walnut/70">
              {prestation.plageFixe.debut} – {prestation.plageFixe.fin} (fixe)
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="heureDebut" className="text-sm font-medium text-walnut">
                {prestation.nocturne ? "Heure de début de garde" : "Début de matinée"}
              </label>
              <input
                id="heureDebut"
                type="time"
                value={dispo.heureDebut}
                onChange={(e) => setDispo({ ...dispo, heureDebut: e.target.value })}
                className="rounded-xl border border-border bg-parchment px-3 py-2 text-sm text-walnut focus:border-accent focus:outline-none"
              />
            </div>
            {prestation.nocturne ? (
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-walnut">Heure de fin</span>
                <p className="flex items-center rounded-xl border border-border bg-parchment px-3 py-2 text-sm text-walnut/70">
                  {ajouterMinutes(dispo.heureDebut, prestation.dureeMinutes)} (lendemain)
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="heureFin" className="text-sm font-medium text-walnut">
                  Fin d&apos;après-midi
                </label>
                <input
                  id="heureFin"
                  type="time"
                  value={dispo.heureFin}
                  onChange={(e) => setDispo({ ...dispo, heureFin: e.target.value })}
                  className="rounded-xl border border-border bg-parchment px-3 py-2 text-sm text-walnut focus:border-accent focus:outline-none"
                />
              </div>
            )}
          </>
        )}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-walnut">Durée</span>
          <p className="flex items-center rounded-xl border border-border bg-parchment px-3 py-2 text-sm text-walnut/70">
            {prestation.dureeMinutes} min
          </p>
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
        journée pour cette prestation, celle-ci n&apos;est plus proposée
        aux visiteurs du site.
      </p>
    </form>
  );
}

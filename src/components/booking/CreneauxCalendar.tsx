"use client";

import { useEffect, useState } from "react";
import type { CreneauDisponible } from "@/types";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const heureFormatter = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
});

function groupByDate(creneaux: CreneauDisponible[]) {
  const groups = new Map<string, CreneauDisponible[]>();

  for (const creneau of creneaux) {
    const key = new Date(creneau.date).toDateString();
    const existing = groups.get(key) ?? [];
    existing.push(creneau);
    groups.set(key, existing);
  }

  return Array.from(groups.values());
}

export default function CreneauxCalendar({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (creneau: CreneauDisponible) => void;
}) {
  const [creneaux, setCreneaux] = useState<CreneauDisponible[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/creneaux")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur de chargement");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setCreneaux(data.creneaux);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger les créneaux disponibles.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="text-sm text-error">{error}</p>;
  }

  if (!creneaux) {
    return <p className="text-sm text-body">Chargement des créneaux disponibles…</p>;
  }

  if (creneaux.length === 0) {
    return (
      <p className="text-sm text-body">
        Aucun créneau n&apos;est disponible pour le moment. Merci de nous
        contacter directement pour connaître les prochaines disponibilités.
      </p>
    );
  }

  const groupedByDay = groupByDate(creneaux);

  return (
    <div className="flex flex-col gap-6">
      {groupedByDay.map((day) => (
        <div key={day[0].id}>
          <h3 className="text-sm font-semibold capitalize text-walnut">
            {dateFormatter.format(new Date(day[0].date))}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {day.map((creneau) => {
              const isSelected = creneau.id === selectedId;
              return (
                <button
                  key={creneau.id}
                  type="button"
                  onClick={() => onSelect(creneau)}
                  aria-pressed={isSelected}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                    isSelected
                      ? "border-accent bg-accent text-parchment"
                      : "border-border bg-parchment text-walnut hover:border-accent"
                  }`}
                >
                  {heureFormatter.format(new Date(creneau.date))}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

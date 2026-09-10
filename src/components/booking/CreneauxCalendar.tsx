"use client";

import { useEffect, useMemo, useState } from "react";
import type { CreneauDisponible } from "@/types";

const monthFormatter = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });
const dayHeaderFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});
const heureFormatter = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" });
const joursSemaine = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
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
  const [monthCursor, setMonthCursor] = useState(() => startOfDay(new Date()));
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/creneaux")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur de chargement");
        return res.json();
      })
      .then((data: { creneaux: CreneauDisponible[] }) => {
        if (cancelled) return;
        setCreneaux(data.creneaux);

        if (data.creneaux.length > 0) {
          const first = new Date(data.creneaux[0].date);
          setSelectedDateKey(toDateKey(first));
          setMonthCursor(startOfDay(first));
        }
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger les créneaux disponibles.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const creneauxParDate = useMemo(() => {
    const map = new Map<string, CreneauDisponible[]>();
    for (const creneau of creneaux ?? []) {
      const key = toDateKey(new Date(creneau.date));
      const existing = map.get(key) ?? [];
      existing.push(creneau);
      map.set(key, existing);
    }
    return map;
  }, [creneaux]);

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

  const today = startOfDay(new Date());
  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7; // lundi = 0

  const days: (Date | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const heuresDuJour = selectedDateKey ? creneauxParDate.get(selectedDateKey) ?? [] : [];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-parchment p-4 sm:flex-row sm:gap-6 sm:p-5">
      <div className="mx-auto w-[80%] sm:mx-0 sm:w-[13.5rem] sm:shrink-0">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMonthCursor(new Date(year, month - 1, 1))}
            aria-label="Mois précédent"
            className="rounded-full px-2 py-0.5 text-sm text-walnut hover:bg-peach/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            ←
          </button>
          <p className="text-xs font-semibold capitalize text-walnut">
            {monthFormatter.format(monthCursor)}
          </p>
          <button
            type="button"
            onClick={() => setMonthCursor(new Date(year, month + 1, 1))}
            aria-label="Mois suivant"
            className="rounded-full px-2 py-0.5 text-sm text-walnut hover:bg-peach/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            →
          </button>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-0.5 text-center text-[0.55rem] font-semibold uppercase tracking-wide text-body">
          {joursSemaine.map((j) => (
            <span key={j}>{j}</span>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-0.5">
          {days.map((day, index) => {
            if (!day) return <span key={`blank-${index}`} />;

            const key = toDateKey(day);
            const hasCreneaux = creneauxParDate.has(key);
            const isPast = day < today;
            const isSelected = key === selectedDateKey;
            const disabled = isPast || !hasCreneaux;

            let classes =
              "aspect-square rounded-full text-xs flex items-center justify-center transition-colors";

            if (disabled) {
              classes += " text-body/30 cursor-default";
            } else if (isSelected) {
              classes += " bg-accent text-parchment font-semibold";
            } else {
              classes += " text-walnut hover:bg-peach/50 cursor-pointer font-medium";
            }

            return (
              <button
                key={key}
                type="button"
                disabled={disabled}
                onClick={() => setSelectedDateKey(key)}
                aria-pressed={isSelected}
                className={classes}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:border-l sm:border-border sm:pl-6">
        {selectedDateKey && (
          <p className="text-sm font-semibold capitalize text-walnut">
            {dayHeaderFormatter.format(new Date(`${selectedDateKey}T00:00:00`))}
          </p>
        )}

        {heuresDuJour.length === 0 ? (
          <p className="text-sm text-body">
            Aucun créneau disponible ce jour-là. Choisissez une autre date dans le calendrier.
          </p>
        ) : (
          <div className="flex max-h-80 flex-col gap-2 overflow-y-auto pr-1">
            {heuresDuJour.map((creneau) => {
              const isSelected = creneau.id === selectedId;
              return (
                <button
                  key={creneau.id}
                  type="button"
                  onClick={() => onSelect(creneau)}
                  aria-pressed={isSelected}
                  className={`w-full rounded-full border px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                    isSelected
                      ? "border-accent bg-accent text-parchment"
                      : "border-border bg-white/60 text-walnut hover:border-accent"
                  }`}
                >
                  {heureFormatter.format(new Date(creneau.date))}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

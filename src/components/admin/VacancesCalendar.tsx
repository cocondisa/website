"use client";

import { FormEvent, useEffect, useState } from "react";
import Button from "@/components/ui/Button";

type Periode = {
  id: string;
  debut: string;
  fin: string;
  label: string | null;
};

const monthFormatter = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });
const dayFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" });
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

export default function VacancesCalendar() {
  const [monthCursor, setMonthCursor] = useState(() => startOfDay(new Date()));
  const [periodes, setPeriodes] = useState<Periode[] | null>(null);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [label, setLabel] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/vacances")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setPeriodes(data.vacances);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger les périodes de vacances.");
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

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

  function isInExistingPeriode(day: Date) {
    if (!periodes) return null;
    return periodes.find((p) => day >= startOfDay(new Date(p.debut)) && day <= startOfDay(new Date(p.fin)));
  }

  function isInSelection(day: Date) {
    if (!rangeStart) return false;
    const end = rangeEnd ?? rangeStart;
    return day >= rangeStart && day <= end;
  }

  function handleDayClick(day: Date) {
    if (day < today) return;
    if (isInExistingPeriode(day)) return;

    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(day);
      setRangeEnd(null);
      return;
    }

    if (day < rangeStart) {
      setRangeStart(day);
      setRangeEnd(null);
      return;
    }

    setRangeEnd(day);
  }

  function resetSelection() {
    setRangeStart(null);
    setRangeEnd(null);
    setLabel("");
  }

  async function handleConfirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rangeStart) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/vacances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          debut: toDateKey(rangeStart),
          fin: toDateKey(rangeEnd ?? rangeStart),
          label: label.trim() || undefined,
        }),
      });

      if (!res.ok) {
        setError("Impossible d'enregistrer cette période.");
        return;
      }

      resetSelection();
      setRefreshKey((k) => k + 1);
    } catch {
      setError("Une erreur réseau est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette période de vacances ?")) return;
    await fetch(`/api/admin/vacances/${id}`, { method: "DELETE" });
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-white/60 p-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMonthCursor(new Date(year, month - 1, 1))}
          aria-label="Mois précédent"
          className="rounded-full px-3 py-1 text-walnut hover:bg-peach/40"
        >
          ←
        </button>
        <p className="text-sm font-semibold capitalize text-walnut">
          {monthFormatter.format(monthCursor)}
        </p>
        <button
          type="button"
          onClick={() => setMonthCursor(new Date(year, month + 1, 1))}
          aria-label="Mois suivant"
          className="rounded-full px-3 py-1 text-walnut hover:bg-peach/40"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase text-body">
        {joursSemaine.map((j) => (
          <span key={j}>{j}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) return <span key={`blank-${index}`} />;

          const existing = isInExistingPeriode(day);
          const selected = isInSelection(day);
          const isPast = day < today;

          let classes =
            "aspect-square rounded-lg text-sm flex items-center justify-center transition-colors";

          if (isPast) {
            classes += " text-body/30 cursor-default";
          } else if (existing) {
            classes += " bg-error/15 text-error cursor-not-allowed";
          } else if (selected) {
            classes += " bg-accent text-parchment cursor-pointer";
          } else {
            classes += " text-walnut hover:bg-peach/50 cursor-pointer";
          }

          return (
            <button
              key={toDateKey(day)}
              type="button"
              disabled={isPast || Boolean(existing)}
              onClick={() => handleDayClick(day)}
              title={existing?.label ?? undefined}
              className={classes}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-body">
        <span className="mr-3 inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-error/15" /> Vacances existantes
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-accent" /> Sélection en cours
        </span>
      </p>

      {rangeStart && (
        <form onSubmit={handleConfirm} className="flex flex-wrap items-end gap-3">
          <p className="text-sm text-walnut">
            Du <strong>{dayFormatter.format(rangeStart)}</strong> au{" "}
            <strong>{dayFormatter.format(rangeEnd ?? rangeStart)}</strong>
          </p>
          <input
            type="text"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Note (optionnel)"
            maxLength={100}
            className="rounded-xl border border-border bg-parchment px-3 py-2 text-sm text-walnut focus:border-accent focus:outline-none"
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? "Enregistrement…" : "Bloquer cette période"}
          </Button>
          <button
            type="button"
            onClick={resetSelection}
            className="text-sm text-body underline underline-offset-4"
          >
            Annuler
          </button>
        </form>
      )}

      {error && <p className="text-sm text-error">{error}</p>}

      {periodes && periodes.length > 0 && (
        <div className="flex flex-col divide-y divide-border border-t border-border pt-2">
          {periodes.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 py-2">
              <p className="text-sm text-walnut">
                Du {dayFormatter.format(new Date(p.debut))} au{" "}
                {dayFormatter.format(new Date(p.fin))}
                {p.label && <span className="text-body"> — {p.label}</span>}
              </p>
              <button
                type="button"
                onClick={() => handleDelete(p.id)}
                className="text-sm text-error underline underline-offset-4"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import CreneauxCalendar from "@/components/booking/CreneauxCalendar";
import BookingForm from "@/components/booking/BookingForm";
import { prestationsList, type PrestationId } from "@/lib/prestations";
import type { CreneauDisponible } from "@/types";

const heureFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

export default function BookingFlow() {
  const [serviceId, setServiceId] = useState<PrestationId | null>(null);
  const [selected, setSelected] = useState<CreneauDisponible | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleSelectService(id: PrestationId) {
    setServiceId(id);
    setSelected(null);
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-xl font-semibold text-walnut">1. Choisissez une prestation</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {prestationsList.map((p) => {
            const isSelected = p.id === serviceId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectService(p.id)}
                aria-pressed={isSelected}
                className={`flex flex-col gap-1.5 rounded-2xl border p-5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                  isSelected
                    ? "border-accent bg-accent/10"
                    : "border-border bg-white/60 hover:border-accent"
                }`}
              >
                <p className="text-base font-semibold text-walnut">{p.nom}</p>
                <p className="text-sm text-body">{p.description}</p>
                <p className="mt-1 text-sm font-medium text-sage">
                  {p.prixLabel} · {Math.round(p.dureeMinutes / 60) >= 1
                    ? `${(p.dureeMinutes / 60).toLocaleString("fr-FR")} h`
                    : `${p.dureeMinutes} min`}{" "}
                  · {p.lieu}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {serviceId && (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-walnut">2. Choisissez un créneau</h2>
            <div className="mt-5">
              <CreneauxCalendar
                key={`${serviceId}-${refreshKey}`}
                serviceId={serviceId}
                selectedId={selected?.id ?? null}
                onSelect={setSelected}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-walnut">3. Vos informations</h2>

            {selected ? (
              <div className="mt-5 flex flex-col gap-5">
                <p className="rounded-xl border border-border bg-peach/40 px-4 py-3 text-sm text-walnut">
                  Créneau sélectionné :{" "}
                  <strong className="capitalize">
                    {heureFormatter.format(new Date(selected.date))}
                  </strong>
                </p>
                <BookingForm
                  creneau={selected}
                  serviceId={serviceId!}
                  onCreneauIndisponible={() => {
                    setSelected(null);
                    setRefreshKey((key) => key + 1);
                  }}
                />
              </div>
            ) : (
              <p className="mt-5 text-sm text-body">
                Sélectionnez d&apos;abord un créneau disponible pour accéder au
                formulaire de réservation.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

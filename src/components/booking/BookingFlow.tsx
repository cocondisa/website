"use client";

import { useState } from "react";
import CreneauxCalendar from "@/components/booking/CreneauxCalendar";
import BookingForm from "@/components/booking/BookingForm";
import type { CreneauDisponible } from "@/types";

const heureFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

export default function BookingFlow() {
  const [selected, setSelected] = useState<CreneauDisponible | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <div>
        <h2 className="text-xl font-semibold text-walnut">
          1. Choisissez un créneau
        </h2>
        <div className="mt-5">
          <CreneauxCalendar
            key={refreshKey}
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-walnut">
          2. Vos informations
        </h2>

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
  );
}

import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import BookingFlow from "@/components/booking/BookingFlow";

export const metadata: Metadata = {
  title: "Prendre rendez-vous",
  description:
    "Réservez votre prestation avec Cocon d'Isa en choisissant un créneau disponible.",
  alternates: { canonical: "/rendez-vous" },
};

export default function RendezVousPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-3 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-sage">
            Réservation en ligne
          </span>
          <h1 className="text-3xl font-semibold text-walnut sm:text-4xl">
            Prendre rendez-vous
          </h1>
          <p className="mx-auto max-w-xl text-base text-body">
            Choisissez une prestation puis un créneau disponible, renseignez
            vos informations et recevez immédiatement votre confirmation par
            e-mail.
          </p>
        </div>

        <BookingFlow />
      </Container>
    </section>
  );
}

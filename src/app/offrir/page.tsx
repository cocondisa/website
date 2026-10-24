import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/ui/Container";
import OffrirForm from "@/components/offrir/OffrirForm";

export const metadata: Metadata = {
  title: "Offrir une carte cadeau",
  description:
    "Offrez une prestation Cocon d'Isa à un proche — le destinataire recevra un code pour réserver quand il le souhaite.",
  alternates: { canonical: "/offrir" },
};

export default function OffrirPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-3 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-sage">
            Carte cadeau
          </span>
          <h1 className="text-3xl font-semibold text-walnut sm:text-4xl">
            🎁 Offrir une prestation
          </h1>
          <p className="mx-auto max-w-xl text-base text-body">
            Choisissez une prestation, indiquez l&apos;e-mail du destinataire : il
            recevra un code à présenter à Isabelle pour fixer son rendez-vous
            quand il le souhaite.
          </p>
        </div>

        <Suspense fallback={null}>
          <OffrirForm />
        </Suspense>
      </Container>
    </section>
  );
}

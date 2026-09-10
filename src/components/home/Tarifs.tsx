import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { bainEnveloppe } from "@/lib/site-config";

export default function Tarifs() {
  return (
    <section id="tarifs" className="bg-peach/40 py-16 sm:py-24">
      <Container className="flex flex-col items-center gap-10">
        <SectionTitle eyebrow="Tarifs" title="Un tarif simple et transparent" />

        <div className="w-full max-w-sm rounded-2xl border border-border bg-parchment p-8 text-center shadow-sm">
          <h3 className="text-xl font-semibold text-walnut">
            {bainEnveloppe.nom}
          </h3>
          <p className="mt-1 text-sm text-body">
            Pour les nouveau-nés de {bainEnveloppe.ageCible}
          </p>

          <p className="mt-6 text-4xl font-semibold text-accent">
            {bainEnveloppe.prix}
          </p>
          <p className="mt-1 text-sm text-body">Durée : {bainEnveloppe.duree}</p>

          <ButtonLink href="/rendez-vous" className="mt-8 w-full">
            Réserver
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

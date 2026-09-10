import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { bienfaits } from "@/lib/site-config";

export default function BainEnveloppe() {
  return (
    <section id="bain-enveloppe" className="bg-parchment py-16 sm:py-24">
      <Container className="flex flex-col gap-14">
        <SectionTitle
          eyebrow="Notre prestation"
          title="Le bain enveloppé"
          description="Une pratique douce et enveloppante pensée pour les nouveau-nés de 0 à 2 mois, réalisée dans le respect du rythme de bébé."
        />

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-semibold text-walnut">
              Qu&apos;est-ce que le bain enveloppé ?
            </h3>
            <p className="text-base text-body">
              [TEXTE À COMPLÉTER — explication de la prestation : en quoi
              consiste le bain enveloppé, dans quel contexte il est proposé.]
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-walnut">
              Comment se déroule la séance ?
            </h3>
            <p className="text-base text-body">
              [TEXTE À COMPLÉTER — déroulé de la séance étape par étape.]
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <PlaceholderImage label="[PHOTO — préparation du bain]" className="aspect-square" />
            <PlaceholderImage label="[PHOTO — pendant le bain]" className="aspect-square" />
            <PlaceholderImage label="[PHOTO — enveloppement]" className="aspect-square" />
            <PlaceholderImage label="[PHOTO — après le bain]" className="aspect-square" />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-walnut">Les bienfaits</h3>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bienfaits.map((bienfait) => (
              <div
                key={bienfait.titre}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-white/60 p-6"
              >
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 text-sage"
                >
                  ✦
                </span>
                <h4 className="text-lg font-semibold text-walnut">
                  {bienfait.titre}
                </h4>
                <p className="text-sm text-body">{bienfait.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

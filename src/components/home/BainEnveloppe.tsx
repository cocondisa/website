import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import DecorativeBlobs from "@/components/ui/DecorativeBlobs";
import { bienfaits } from "@/lib/site-config";

export default function BainEnveloppe() {
  return (
    <section id="bain-enveloppe" className="relative isolate overflow-hidden bg-parchment py-16 sm:py-24">
      <DecorativeBlobs variant={2} />
      <Container className="flex flex-col gap-14">
        <SectionTitle
          eyebrow="Ma prestation"
          title="Le bain enveloppé"
          description="Une pratique douce et enveloppante pensée pour les nouveau-nés de 0 à 2 mois, réalisée dans le respect du rythme de bébé."
        />

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white/60 p-6">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-peach/50 text-lg text-sage"
                >
                  ✦
                </span>
                <h3 className="text-xl font-semibold text-walnut">
                  Qu&apos;est-ce que le bain enveloppé ?
                </h3>
              </div>
              <p className="text-base text-body">
                Le bain enveloppé est une technique de bain doux pour le
                nouveau-né : bébé reste enveloppé dans un lange pendant son
                immersion dans l&apos;eau chaude, recréant la sensation
                contenante du ventre maternel. Cette approche limite le
                réflexe de sursaut souvent provoqué par le bain traditionnel
                et permet un moment beaucoup plus apaisé, pour bébé comme
                pour ses parents.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white/60 p-6">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-peach/50 text-lg text-sage"
                >
                  ✦
                </span>
                <h3 className="text-xl font-semibold text-walnut">
                  Comment se déroule la séance ?
                </h3>
              </div>
              <p className="text-base text-body">
                Vous êtes accueillis avec votre bébé dans une pièce de
                détente snoezelen, où nous échangeons en toute sérénité sur
                votre vécu de la grossesse et de l&apos;accouchement.
                Direction ensuite une pièce dédiée, où j&apos;ai
                préalablement installé tout le matériel nécessaire : je vous
                guide alors en douceur pour réaliser ensemble le bain
                enveloppé. La séance se termine par la transmission des
                gestes d&apos;un massage de réflexologie plantaire pour bébé.
              </p>
            </div>
          </div>

          <div className="order-first grid grid-cols-2 gap-4 lg:order-none">
            <PlaceholderImage label="[PHOTO — préparation du bain]" className="aspect-square" />
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border">
              <Image
                src="/images/pendant-le-bain.jpeg"
                alt="Parent tenant délicatement la tête de bébé pendant le bain enveloppé"
                fill
                sizes="(min-width: 1024px) 20vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border">
              <Image
                src="/images/enveloppement.jpeg"
                alt="Nouveau-né enveloppé après le bain"
                fill
                sizes="(min-width: 1024px) 20vw, 45vw"
                className="object-cover object-top"
              />
            </div>
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
                  className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full"
                >
                  {bienfait.icone ? (
                    <Image
                      src={bienfait.icone}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-peach/50 text-lg text-sage">
                      ✦
                    </span>
                  )}
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

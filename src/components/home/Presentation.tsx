import Image from "next/image";
import Container from "@/components/ui/Container";
import CountUp from "@/components/ui/CountUp";
import DecorativeBlobs from "@/components/ui/DecorativeBlobs";

export default function Presentation() {
  return (
    <section className="relative isolate overflow-hidden bg-peach/40">
      <DecorativeBlobs variant={1} />
      <Container className="grid grid-cols-1 items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div className="flex justify-center lg:order-1">
          <div className="relative aspect-square w-64 overflow-hidden rounded-full ring-8 ring-parchment shadow-lg sm:w-80 lg:w-96">
            <Image
              src="/images/photo-profil.jpeg"
              alt="Isabelle, fondatrice de Cocon d'Isa"
              fill
              sizes="(min-width: 1024px) 384px, 320px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-sm font-semibold uppercase tracking-widest text-sage">
            À propos
          </span>
          <h2 className="text-4xl font-semibold text-walnut sm:text-5xl">
            Isabelle, votre accompagnante bien-être
          </h2>
          <p className="text-base text-body">
            Auxiliaire de puériculture diplômée depuis 1994, Isabelle a
            consacré toute sa carrière à l&apos;accompagnement des tout-petits.
            Pendant 20 ans, elle a exercé auprès d&apos;enfants, de
            nourrissons et de prématurés atteints de pathologies lourdes,
            avant de devenir assistante maternelle pendant 16 ans. Cette
            double expérience, entre milieu hospitalier et accueil au
            quotidien, nourrit aujourd&apos;hui son approche du bain
            enveloppé : une présence rassurante, à l&apos;écoute des besoins
            de chaque bébé et de ses parents.
          </p>

          <div className="mt-2 grid grid-cols-3 gap-4 border-t border-border pt-6">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-accent sm:text-4xl">
                <CountUp end={1994} />
              </span>
              <span className="text-sm text-body">Diplômée depuis</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-accent sm:text-4xl">
                <CountUp end={20} suffix=" ans" />
              </span>
              <span className="text-sm text-body">En milieu hospitalier</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-accent sm:text-4xl">
                <CountUp end={16} suffix=" ans" />
              </span>
              <span className="text-sm text-body">Assistante maternelle</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

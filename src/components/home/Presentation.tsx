import Container from "@/components/ui/Container";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

export default function Presentation() {
  return (
    <section className="bg-peach/40">
      <Container className="grid grid-cols-1 items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <PlaceholderImage
          label="[PHOTO À VENIR — portrait d'Isabelle]"
          className="aspect-square w-full lg:order-1"
        />

        <div className="flex flex-col gap-4">
          <span className="text-sm font-semibold uppercase tracking-widest text-sage">
            À propos
          </span>
          <h2 className="text-3xl font-semibold text-walnut sm:text-4xl">
            Isabelle, votre accompagnante bien-être
          </h2>
          <p className="text-base text-body">
            [TEXTE À COMPLÉTER — présentation d&apos;Isabelle : qui elle est,
            sa formation, son approche du bien-être des nouveau-nés et de
            leurs parents.]
          </p>
        </div>
      </Container>
    </section>
  );
}

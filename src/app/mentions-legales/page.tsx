import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import { contact, legal, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales du site ${siteConfig.name}.`,
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="prose-content flex max-w-3xl flex-col gap-8">
        <h1 className="text-3xl font-semibold text-walnut">Mentions légales</h1>

        <div className="flex flex-col gap-3 text-body">
          <h2 className="text-xl font-semibold text-walnut">Éditeur du site</h2>
          <p>
            {legal.raisonSociale} — {legal.statut}
            <br />
            SIRET : {legal.siret}
            <br />
            Adresse du siège : {legal.adresseSiege}
            <br />
            Directeur de la publication : {legal.directeurPublication}
            <br />
            Contact : {contact.email} — {contact.telephone}
          </p>
        </div>

        <div className="flex flex-col gap-3 text-body">
          <h2 className="text-xl font-semibold text-walnut">Hébergement</h2>
          <p>
            {legal.hebergeur.nom}
            <br />
            {legal.hebergeur.adresse}
            <br />
            {legal.hebergeur.site}
          </p>
        </div>

        <div className="flex flex-col gap-3 text-body">
          <h2 className="text-xl font-semibold text-walnut">
            Propriété intellectuelle
          </h2>
          <p>
            L&apos;ensemble des contenus présents sur ce site (textes, images,
            logo) est la propriété de {legal.raisonSociale}, sauf mention
            contraire, et ne peut être reproduit sans autorisation préalable.
          </p>
        </div>
      </Container>
    </section>
  );
}

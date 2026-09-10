import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import { contact, legal, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Politique de confidentialité et protection des données du site ${siteConfig.name}.`,
  alternates: { canonical: "/politique-de-confidentialite" },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="flex max-w-3xl flex-col gap-8">
        <h1 className="text-3xl font-semibold text-walnut">
          Politique de confidentialité
        </h1>

        <div className="flex flex-col gap-3 text-body">
          <h2 className="text-xl font-semibold text-walnut">
            Données collectées
          </h2>
          <p>
            Dans le cadre de la prise de rendez-vous en ligne, nous collectons
            les données suivantes : nom, adresse e-mail, numéro de téléphone,
            informations optionnelles sur votre bébé et message libre. Ces
            données sont nécessaires à la gestion de votre réservation.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-body">
          <h2 className="text-xl font-semibold text-walnut">
            Finalité et base légale
          </h2>
          <p>
            Vos données sont utilisées exclusivement pour la prise en charge
            de votre rendez-vous (confirmation, organisation de la séance) sur
            la base de l&apos;exécution d&apos;une mesure précontractuelle
            /contractuelle.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-body">
          <h2 className="text-xl font-semibold text-walnut">
            Destinataires et conservation
          </h2>
          <p>
            Vos données sont traitées par {legal.raisonSociale} et ne sont
            transmises à aucun tiers à des fins commerciales. Elles sont
            conservées pendant la durée nécessaire à la gestion de la relation
            client, puis archivées conformément aux obligations légales.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-body">
          <h2 className="text-xl font-semibold text-walnut">Vos droits</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données
            (RGPD), vous disposez d&apos;un droit d&apos;accès, de
            rectification, d&apos;effacement et de portabilité de vos données,
            ainsi que d&apos;un droit d&apos;opposition. Pour exercer ces
            droits, contactez-nous à l&apos;adresse : {contact.email}.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-body">
          <h2 className="text-xl font-semibold text-walnut">Cookies</h2>
          <p>
            Ce site n&apos;utilise pas de cookies de suivi publicitaire.
          </p>
        </div>
      </Container>
    </section>
  );
}

import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Presentation from "@/components/home/Presentation";
import BainEnveloppe from "@/components/home/BainEnveloppe";
import Tarifs from "@/components/home/Tarifs";
import Temoignages from "@/components/home/Temoignages";
import Faq from "@/components/home/Faq";
import CtaFinal from "@/components/home/CtaFinal";
import { contact, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Bain enveloppé pour nouveau-nés",
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        telephone: contact.telephoneHref.replace("tel:", ""),
        email: contact.email,
        areaServed: contact.zone,
        priceRange: "€€",
      },
      {
        "@type": "Service",
        serviceType: "Bain enveloppé pour nouveau-nés",
        name: "Le bain enveloppé (0-2 mois)",
        provider: {
          "@type": "LocalBusiness",
          name: siteConfig.name,
        },
        areaServed: contact.zone,
        audience: {
          "@type": "PeopleAudience",
          suggestedMinAge: "0",
          suggestedMaxAge: "2",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Presentation />
      <BainEnveloppe />
      <Tarifs />
      <Temoignages />
      <Faq />
      <CtaFinal />
    </>
  );
}

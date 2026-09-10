// Configuration centrale du site — regroupe les informations encore
// provisoires (prix, coordonnées, statut légal...) afin de n'avoir
// qu'un seul endroit à modifier une fois les informations d'Isabelle reçues.

export const siteConfig = {
  name: "Cocon d'Isa",
  shortName: "Cocon d'Isa",
  description:
    "Cocon d'Isa propose le bain enveloppé pour les nouveau-nés (0 à 2 mois) : un moment d'apaisement et de lien pour bébé et ses parents.",
  url: "https://cocondisa.fr",
  locale: "fr-FR",
};

export const contact = {
  telephone: "[TÉLÉPHONE À COMPLÉTER]",
  telephoneHref: "tel:+33000000000",
  email: "[EMAIL À COMPLÉTER]",
  zone: "[ZONE GÉOGRAPHIQUE À COMPLÉTER — à domicile / en cabinet]",
  adresseCabinet: "[ADRESSE DU CABINET À COMPLÉTER SI APPLICABLE]",
};

export const social = {
  instagram: "#",
  facebook: "#",
};

export const legal = {
  raisonSociale: "[NOM / RAISON SOCIALE À COMPLÉTER]",
  statut: "[STATUT JURIDIQUE À COMPLÉTER — ex. Micro-entrepreneur]",
  siret: "[SIRET À COMPLÉTER]",
  adresseSiege: "[ADRESSE DU SIÈGE À COMPLÉTER]",
  directeurPublication: "[NOM DU RESPONSABLE DE PUBLICATION À COMPLÉTER]",
  hebergeur: {
    nom: "Vercel Inc.",
    adresse: "440 N Barranca Ave #4133, Covina, CA 91723, USA",
    site: "https://vercel.com",
  },
};

export const bainEnveloppe = {
  nom: "Le bain enveloppé",
  ageCible: "0 à 2 mois",
  prix: "[PRIX À COMPLÉTER]",
  duree: "[DURÉE À COMPLÉTER]",
};

export const bienfaits = [
  {
    titre: "Apaisement du nouveau-né",
    description: "[TEXTE À COMPLÉTER — apaisement du nouveau-né]",
  },
  {
    titre: "Renforcement du lien parent-enfant",
    description: "[TEXTE À COMPLÉTER — lien parent-enfant]",
  },
  {
    titre: "Amélioration du sommeil",
    description: "[TEXTE À COMPLÉTER — sommeil]",
  },
  {
    titre: "Portage et motricité",
    description: "[TEXTE À COMPLÉTER — portage]",
  },
  {
    titre: "Réassurance des parents",
    description: "[TEXTE À COMPLÉTER — réassurance des parents]",
  },
];

export const faq = [
  {
    question: "À partir de quel âge peut-on faire un bain enveloppé ?",
    reponse: "[RÉPONSE À COMPLÉTER]",
  },
  {
    question: "Où se déroule la séance ?",
    reponse: "[RÉPONSE À COMPLÉTER]",
  },
  {
    question: "Que dois-je prévoir avant la séance ?",
    reponse: "[RÉPONSE À COMPLÉTER]",
  },
  {
    question: "Combien de temps dure une séance ?",
    reponse: "[RÉPONSE À COMPLÉTER]",
  },
  {
    question: "Comment se déroule la prise de rendez-vous ?",
    reponse:
      "Vous choisissez un créneau disponible sur notre page de réservation en ligne, vous renseignez vos informations et vous recevez immédiatement un e-mail de confirmation.",
  },
];

export const temoignages = [
  {
    nom: "Camille D.",
    texte:
      "[TÉMOIGNAGE À COMPLÉTER — retour d'une première maman après une séance]",
  },
  {
    nom: "Julie M.",
    texte: "[TÉMOIGNAGE À COMPLÉTER — retour d'une maman après une séance]",
  },
  {
    nom: "Sarah B.",
    texte: "[TÉMOIGNAGE À COMPLÉTER — retour d'une maman après une séance]",
  },
];

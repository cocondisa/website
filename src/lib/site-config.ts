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
  telephone: "06 25 95 74 04",
  telephoneHref: "tel:+33625957404",
  email: "contact@cocondisa.fr",
  zone: "[ZONE GÉOGRAPHIQUE À COMPLÉTER — à domicile / en cabinet]",
  adresseCabinet: "Tournefeuille, 31170",
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
  complement: "Moment détente parents",
  ageCible: "0 à 2 mois",
  prix: "100 €",
  prixApresOffre: "150 €",
  offreLancement: "Offre de lancement",
  offreLancementDetail: "10 premiers clients, puis 150 €",
  duree: "1h30",
};

export const bienfaits = [
  {
    titre: "Apaisement du nouveau-né",
    description:
      "La chaleur enveloppante de l'eau limite le réflexe de sursaut (Moro) et apaise pleurs et anxiété.",
    icone: "/brand/icons/apaisement.jpg",
  },
  {
    titre: "Renforcement du lien parent-enfant",
    description:
      "Un moment de partage intense qui renforce la confiance et le lien d'attachement avec bébé.",
    icone: "/brand/icons/lien-parent-enfant.jpg",
  },
  {
    titre: "Amélioration du sommeil",
    description:
      "Un rituel apaisant, particulièrement bénéfique en fin de journée pour favoriser l'endormissement.",
    icone: "/brand/icons/amelioration-sommeil.jpg",
  },
  {
    titre: "Éveil sensoriel",
    description:
      "Une expérience sensorielle, émotionnelle et motrice qui stimule en douceur l'éveil de bébé.",
    icone: "/brand/icons/eveil-sensoriel.jpg",
  },
  {
    titre: "Réassurance des parents",
    description:
      "En observant les réactions de bébé, les parents gagnent en confiance et apprennent à lire ses besoins.",
    icone: "/brand/icons/reassurance-parents.jpg",
  },
];

export const faq = [
  {
    question: "À partir de quel âge peut-on faire un bain enveloppé ?",
    reponse:
      "Dès la naissance et jusqu'à 2 mois environ. Il peut être pratiqué dès les premiers jours, même si le cordon ombilical n'est pas encore tombé (il suffit de bien le sécher après).",
  },
  {
    question: "Où se déroule la séance ?",
    reponse:
      "Chez Isabelle, à Tournefeuille (31) : accueil dans une pièce de détente snoezelen, puis bain dans une pièce dédiée.",
  },
  {
    question: "Que dois-je prévoir avant la séance ?",
    reponse:
      "Rien à apporter : Isabelle fournit tout le nécessaire (couche, produits de toilette, serviettes, langes...). Prévoyez simplement des affaires de rechange pour bébé.",
  },
  {
    question: "Combien de temps dure une séance ?",
    reponse: "Environ 1h30, temps d'échange inclus.",
  },
  {
    question: "Comment se déroule la prise de rendez-vous ?",
    reponse:
      "Vous choisissez un créneau disponible sur notre page de réservation en ligne, vous renseignez vos informations et vous recevez immédiatement un e-mail de confirmation.",
  },
];

// Avis provisoires, inventés en attendant les premiers retours clients réels.
export const temoignages = [
  {
    nom: "Camille D.",
    note: 5,
    texte:
      "Un moment d'une douceur incroyable. Ma fille s'est complètement détendue dans l'eau, et moi aussi ! Isabelle a un vrai savoir-faire.",
  },
  {
    nom: "Julie M.",
    note: 5,
    texte:
      "Après des nuits difficiles, ce bain enveloppé a été une vraie bulle d'air. Mon fils s'est endormi apaisé juste après. Je recommande à 100 %.",
  },
  {
    nom: "Sarah B.",
    note: 5,
    texte:
      "Isabelle nous a mis en confiance dès les premières minutes. On a appris plein de gestes utiles et passé un moment vraiment précieux en famille.",
  },
];

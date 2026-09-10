import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Crée des créneaux de test pour les 2 prochaines semaines
 * (mardi, jeudi, samedi à 9h30 et 11h) afin de pouvoir tester le parcours de
 * réservation. Horaires purement indicatifs — à remplacer par les
 * disponibilités réelles d'Isabelle.
 */
async function main() {
  const joursCibles = [2, 4, 6]; // mardi, jeudi, samedi
  const heures = [9.5, 11];
  const creneaux: Date[] = [];

  for (let i = 0; i < 21; i++) {
    const jour = new Date();
    jour.setDate(jour.getDate() + i);

    if (!joursCibles.includes(jour.getDay())) continue;

    for (const heure of heures) {
      const date = new Date(jour);
      date.setHours(Math.floor(heure), (heure % 1) * 60, 0, 0);
      if (date > new Date()) creneaux.push(date);
    }
  }

  for (const date of creneaux) {
    await prisma.creneau.upsert({
      where: { id: `seed-${date.toISOString()}` },
      update: {},
      create: { id: `seed-${date.toISOString()}`, date },
    });
  }

  console.log(`${creneaux.length} créneaux de test créés.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

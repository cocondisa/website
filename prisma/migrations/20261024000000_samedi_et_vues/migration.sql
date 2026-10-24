-- AlterTable
ALTER TABLE "Disponibilite" ADD COLUMN     "samediHeureDebut" TEXT NOT NULL DEFAULT '09:00',
ADD COLUMN     "samediHeureFin" TEXT NOT NULL DEFAULT '17:00';

-- CreateTable
CREATE TABLE "VueSite" (
    "id" TEXT NOT NULL,
    "compteur" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "VueSite_pkey" PRIMARY KEY ("id")
);

-- Active le samedi 10h-16h pour les prestations flexibles (bain enveloppé,
-- rituel Rebozo, appel de conseil) — la garde de nuit et l'accompagnement
-- avec brunch gardent leurs propres règles, inchangées.
UPDATE "Disponibilite"
SET "samediMatin" = true,
    "samediApresMidi" = true,
    "samediHeureDebut" = '10:00',
    "samediHeureFin" = '16:00'
WHERE id IN ('bain-enveloppe', 'rituel-rebozo', 'appel-conseil');

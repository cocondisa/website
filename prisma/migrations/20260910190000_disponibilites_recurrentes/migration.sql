-- CreateEnum
CREATE TYPE "OrigineCreneau" AS ENUM ('AUTO', 'MANUEL');

-- AlterTable
ALTER TABLE "Creneau" ADD COLUMN     "origine" "OrigineCreneau" NOT NULL DEFAULT 'MANUEL';

-- CreateTable
CREATE TABLE "Disponibilite" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "lundi" BOOLEAN NOT NULL DEFAULT true,
    "mardi" BOOLEAN NOT NULL DEFAULT true,
    "mercredi" BOOLEAN NOT NULL DEFAULT true,
    "jeudi" BOOLEAN NOT NULL DEFAULT true,
    "vendredi" BOOLEAN NOT NULL DEFAULT true,
    "samedi" BOOLEAN NOT NULL DEFAULT false,
    "dimanche" BOOLEAN NOT NULL DEFAULT false,
    "heureDebut" TEXT NOT NULL DEFAULT '09:00',
    "heureFin" TEXT NOT NULL DEFAULT '17:00',
    "dureeCreneauMinutes" INTEGER NOT NULL DEFAULT 90,
    "maxRdvParJour" INTEGER NOT NULL DEFAULT 4,

    CONSTRAINT "Disponibilite_pkey" PRIMARY KEY ("id")
);

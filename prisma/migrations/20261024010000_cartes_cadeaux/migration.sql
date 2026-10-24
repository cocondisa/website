-- CreateEnum
CREATE TYPE "StatutCarteCadeau" AS ENUM ('EN_ATTENTE_PAIEMENT', 'ACTIVE', 'UTILISEE', 'ANNULEE');

-- CreateTable
CREATE TABLE "CarteCadeau" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "prestationId" TEXT NOT NULL,
    "montantCentimes" INTEGER NOT NULL,
    "acheteurNom" TEXT NOT NULL,
    "acheteurEmail" TEXT NOT NULL,
    "destinataireEmail" TEXT NOT NULL,
    "message" TEXT,
    "statut" "StatutCarteCadeau" NOT NULL DEFAULT 'EN_ATTENTE_PAIEMENT',
    "stripeSessionId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarteCadeau_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CarteCadeau_code_key" ON "CarteCadeau"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CarteCadeau_stripeSessionId_key" ON "CarteCadeau"("stripeSessionId");

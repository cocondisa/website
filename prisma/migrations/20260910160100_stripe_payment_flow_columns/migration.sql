-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "stripeSessionId" TEXT,
ALTER COLUMN "statut" SET DEFAULT 'EN_ATTENTE_PAIEMENT';

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_stripeSessionId_key" ON "Reservation"("stripeSessionId");

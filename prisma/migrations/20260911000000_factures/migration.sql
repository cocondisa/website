-- AlterTable
ALTER TABLE "Parametres" ADD COLUMN     "anneeNumeroFacture" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "prochainNumeroFacture" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "Facture" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "pdf" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Facture_numero_key" ON "Facture"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Facture_reservationId_key" ON "Facture"("reservationId");

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

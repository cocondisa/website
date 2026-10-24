-- DropForeignKey
ALTER TABLE "Facture" DROP CONSTRAINT "Facture_reservationId_fkey";

-- AlterTable
ALTER TABLE "Facture" ADD COLUMN     "carteCadeauId" TEXT,
ALTER COLUMN "reservationId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Facture_carteCadeauId_key" ON "Facture"("carteCadeauId");

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_carteCadeauId_fkey" FOREIGN KEY ("carteCadeauId") REFERENCES "CarteCadeau"("id") ON DELETE SET NULL ON UPDATE CASCADE;

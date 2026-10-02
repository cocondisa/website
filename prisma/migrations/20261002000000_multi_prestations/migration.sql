-- AlterTable
ALTER TABLE "Creneau" ADD COLUMN     "prestationId" TEXT NOT NULL DEFAULT 'bain-enveloppe';

-- CreateIndex
CREATE INDEX "Creneau_prestationId_date_idx" ON "Creneau"("prestationId", "date");

-- Data migration : la ligne singleton existante (id "default") devient la
-- disponibilité du bain enveloppé, pour conserver les horaires déjà
-- configurés par Isabelle plutôt que de repartir de zéro.
UPDATE "Disponibilite" SET id = 'bain-enveloppe' WHERE id = 'default';

-- Nouvelles prestations : rituel rebozo et appel de conseil reprennent les
-- horaires de journée par défaut (modifiables ensuite depuis /admin). La
-- garde de nuit démarre entièrement inactive (aucun jour coché) tant
-- qu'Isabelle n'a pas choisi ses soirs disponibles, avec une plage 20h-4h
-- (passage minuit) et une seule garde par nuit.
INSERT INTO "Disponibilite" (id, "lundiMatin", "lundiApresMidi", "mardiMatin", "mardiApresMidi", "mercrediMatin", "mercrediApresMidi", "jeudiMatin", "jeudiApresMidi", "vendrediMatin", "vendrediApresMidi", "samediMatin", "samediApresMidi", "dimancheMatin", "dimancheApresMidi", "heureDebut", "heureMidi", "heureFin", "maxRdvParJour")
VALUES
  ('rituel-rebozo', true, true, true, true, true, true, true, true, true, true, false, false, false, false, '09:00', '13:00', '17:00', 4),
  ('appel-conseil', true, true, true, true, true, true, true, true, true, true, false, false, false, false, '09:00', '13:00', '17:00', 4),
  ('garde-nuit', false, false, false, false, false, false, false, false, false, false, false, false, false, false, '20:00', '20:00', '04:00', 1);

-- AlterTable
ALTER TABLE "Disponibilite" DROP COLUMN "dureeCreneauMinutes",
ALTER COLUMN "id" DROP DEFAULT;

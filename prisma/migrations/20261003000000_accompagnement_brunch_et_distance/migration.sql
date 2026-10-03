-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "adresseClient" TEXT,
ADD COLUMN     "distanceKm" DOUBLE PRECISION;

-- Nouvelle prestation "accompagnement-brunch" : reprend les horaires de
-- journée par défaut (modifiables ensuite depuis /admin), comme les autres
-- prestations en journée.
INSERT INTO "Disponibilite" (id, "lundiMatin", "lundiApresMidi", "mardiMatin", "mardiApresMidi", "mercrediMatin", "mercrediApresMidi", "jeudiMatin", "jeudiApresMidi", "vendrediMatin", "vendrediApresMidi", "samediMatin", "samediApresMidi", "dimancheMatin", "dimancheApresMidi", "heureDebut", "heureMidi", "heureFin", "maxRdvParJour")
VALUES
  ('accompagnement-brunch', true, true, true, true, true, true, true, true, true, true, false, false, false, false, '09:00', '13:00', '17:00', 4);

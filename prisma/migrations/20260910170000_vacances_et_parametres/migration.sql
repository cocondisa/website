-- CreateTable
CREATE TABLE "Vacances" (
    "id" TEXT NOT NULL,
    "debut" TIMESTAMP(3) NOT NULL,
    "fin" TIMESTAMP(3) NOT NULL,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vacances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parametres" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "bandeauActif" BOOLEAN NOT NULL DEFAULT false,
    "bandeauMessage" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Parametres_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vacances_debut_fin_idx" ON "Vacances"("debut", "fin");

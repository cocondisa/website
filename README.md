# Cocon d'Isa

Site vitrine et réservation en ligne pour Cocon d'Isa (bain enveloppé pour
nouveau-nés, 0-2 mois).

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS (palette définie en variables CSS dans `src/app/globals.css`
  et exposée via `tailwind.config.ts`)
- Prisma (v6) + PostgreSQL (Neon / Vercel Postgres / Supabase)
- Resend pour les e-mails transactionnels

## Démarrage

```bash
npm install
cp .env.example .env    # puis renseigner les variables (voir ci-dessous)
npm run db:migrate      # crée les tables en base
npm run db:seed         # créneaux de test (à remplacer par les vraies disponibilités)
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

Voir `.env.example` :

- `DATABASE_URL` — chaîne de connexion PostgreSQL.
- `RESEND_API_KEY` — clé API Resend.
- `NOTIFICATION_EMAIL` — e-mail d'Isabelle recevant les notifications de RDV.

## Gestion des créneaux (MVP)

Pour cette première version, les créneaux disponibles sont gérés directement
en base (table `Creneau`), via `npm run db:studio` (Prisma Studio) ou un
script de seed. Une interface d'administration dédiée pourra être ajoutée
dans une itération suivante.

## Déploiement

Déploiement automatique sur Vercel à chaque push sur `main`. Penser à
configurer les variables d'environnement ci-dessus dans le dashboard Vercel.

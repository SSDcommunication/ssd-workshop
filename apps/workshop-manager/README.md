# Workshop Manager

Web app pour gérer les ateliers SSD — de la création au post-événement.

**Stack** : Next.js 14 + React + TypeScript + Supabase + Tailwind CSS

## Features

- 📊 Dashboard avec KPIs temps réel
- 👥 Gestion des inscrits (Attendees)
- ✅ Gestion des tâches (Tasks)
- 📅 Programme de l'atelier (Workshop Program)
- 📱 Réseaux sociaux (Social Media)
- ✉️ Campagnes email (Email Campaign)
- 💰 Gestion du budget & P&L
- 🎤 Témoignages (Testimonials)
- 🤝 Prospection & partenariats (Outreach)
- 🌐 Landing pages

## Setup

### 1. Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase

### 2. Cloner & installer

```bash
cd apps/workshop-manager
npm install
```

### 3. Variables d'environnement

```bash
cp .env.example .env.local
```

Puis remplir :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 4. Configurer Supabase

1. Créer un nouveau projet Supabase
2. Aller dans "SQL Editor" 
3. Copier-coller le contenu de `lib/supabase/schema.sql`
4. Exécuter

### 5. Démarrer en développement

```bash
npm run dev
```

Accéder à `http://localhost:3000`

## Structure du projet

```
workshop-manager/
├── app/                    # Next.js app router
├── components/
│   ├── ui/                # Composants réutilisables
│   └── modules/           # Composants par module
├── lib/
│   ├── supabase/         # Configuration Supabase
│   └── hooks/            # Custom React hooks
├── types/                 # Définitions TypeScript
├── styles/               # Styles globaux
└── public/               # Assets statiques
```

## Modules

- **Dashboard** : KPIs, vue d'ensemble, filtrage par atelier
- **Attendees** : Liste des inscrits, statuts, paiements
- **Tasks** : Tâches par catégorie, priorité, assignation
- **Workshop Program** : Timeline de la session, détails intervenant
- **Social Media** : Posts par plateforme, stats engagement
- **Email Campaigns** : Séquences, stats d'ouverture/clics
- **Budget** : Coûts estimés vs réels, P&L
- **Testimonials** : Collecte et affichage des avis
- **Outreach** : Prospection et partenariats
- **Landing Page** : Metadata, CTA, tracking

## API Routes

Routes API pour communiquer avec Supabase :
- `/api/workshops/*`
- `/api/attendees/*`
- `/api/tasks/*`
- `/api/email/*`
- etc.

## Déploiement

### Vercel

```bash
npm run build
vercel deploy
```

Ou connecter le repo GitHub à Vercel pour un déploiement automatique.

## Notes de développement

- Authentification : Supabase Auth (à configurer)
- RLS (Row Level Security) activé sur les tables
- Timestamps auto (created_at, updated_at)
- Soft deletes optionnels (ajouter is_deleted si besoin)

## Roadmap avant 01/08/2026

- [ ] Authentification Supabase
- [ ] Dashboard complet
- [ ] CRUD pour chaque module
- [ ] Import/export CSV
- [ ] Intégration Google Sheets (optionnel)
- [ ] Sync attendees → CRM (via Apps Script)
- [ ] Déploiement Vercel
- [ ] Tests e2e

## Contact

Contact : contact.ssdcommunication@gmail.com

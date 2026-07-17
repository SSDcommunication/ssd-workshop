# Guide de setup - Workshop Manager

## 1. Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Copier les credentials dans `.env.local` :
   - `NEXT_PUBLIC_SUPABASE_URL` → URL du projet
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Clé anon publique
   - `SUPABASE_SERVICE_ROLE_KEY` → Clé service role

Exemple `.env.local` :
```
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

## 2. Initialiser la base de données

1. Dans Supabase, aller dans **SQL Editor**
2. Créer une nouvelle query
3. Copier-coller le contenu de `lib/supabase/schema.sql`
4. Cliquer sur **Run**

Tables créées :
- ✅ workshops
- ✅ attendees
- ✅ tasks
- ✅ workshop_program
- ✅ social_media_posts
- ✅ email_campaigns
- ✅ budget
- ✅ testimonials
- ✅ outreach_contacts
- ✅ landing_pages

## 3. Installer les dépendances

```bash
npm install
```

## 4. Démarrer en développement

```bash
npm run dev
```

Accéder à : **http://localhost:3000**

## 5. Tester le dashboard

- Cliquer sur "Connexion" pour la page login (à développer)
- Sinon aller directement à **http://localhost:3000/dashboard**

## Navigation

Une fois dans le dashboard :
- 📊 **Dashboard** : KPIs et vue d'ensemble
- 📅 **Ateliers** : Créer/modifier des ateliers
- 👥 **Inscrits** : Gérer les inscrits
- ✅ **Tâches** : Vue Kanban des tâches
- 📧 **Emails** : Campagnes email
- 📱 **Réseaux sociaux** : Posts LinkedIn, etc.
- 📋 Programme, Budget, Témoignages, Prospection

## Prochaines étapes

### Phase 1 : Authentification (URGENT)
- [ ] Page login
- [ ] Page signup
- [ ] Middleware pour protéger les routes `/dashboard/*`
- [ ] Logout

### Phase 2 : CRUD avec Supabase
- [ ] Connecter chaque module à Supabase (via API routes)
- [ ] Tester les opérations (Create, Read, Update, Delete)
- [ ] Validation des données

### Phase 3 : Intégrations
- [ ] Import CSV pour inscrits
- [ ] Export PDF pour rapports
- [ ] Google Sheets sync (optionnel)

### Phase 4 : Polish
- [ ] Tests
- [ ] Mobile responsive
- [ ] Animations

### Phase 5 : Déploiement
- [ ] Connecter à Vercel
- [ ] Tests en prod
- [ ] Setup domaine

## Architecture

```
app/                    # Pages (Next.js App Router)
├── dashboard/
├── workshops/
├── attendees/
├── tasks/
├── email-campaigns/
├── social-media/
└── ...

components/
├── ui/                 # Composants réutilisables
│   ├── Header.tsx
│   ├── Card.tsx
│   ├── KPICard.tsx
│   ├── Table.tsx
│   ├── Sidebar.tsx
│   └── DashboardLayout.tsx
└── modules/            # Composants métier
    ├── Dashboard.tsx
    ├── WorkshopManager.tsx
    ├── AttendeeManager.tsx
    ├── TaskManager.tsx
    ├── EmailCampaignManager.tsx
    └── SocialMediaManager.tsx

lib/
├── supabase/
│   ├── client.ts       # Client Supabase côté client
│   ├── server.ts       # Client Supabase côté serveur
│   └── schema.sql      # Définition des tables

types/                  # Définitions TypeScript
└── index.ts
```

## Commandes utiles

```bash
# Dev
npm run dev

# Build
npm run build
npm run start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Troubleshooting

### "Cannot find module '@/supabase/client'"
→ Vérifier que le chemin existe et que tsconfig.json a la bonne config `paths`.

### "Supabase API key not found"
→ Vérifier le fichier `.env.local` avec les bonnes valeurs de Supabase.

### Port 3000 déjà utilisé
→ `npm run dev -- -p 3001`

## Contacts

- Email: contact.ssdcommunication@gmail.com
- Deadline: 01/08/2026

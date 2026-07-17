# Roadmap de développement - Workshop Manager

**Deadline** : 01/08/2026 (14 jours)

## ✅ Phase 1 : Fondations (COMPLÉTÉE)

- [x] Structure Next.js + TypeScript
- [x] Configuration Supabase
- [x] Définition des types TypeScript
- [x] Composants UI de base (Header, Card, KPICard, Table, Sidebar)
- [x] Layout Dashboard
- [x] Page Dashboard avec KPIs mockées
- [x] Page Ateliers avec CRUD basique

## 🔄 Phase 2 : Intégration Supabase (EN COURS)

### À faire :
- [ ] **Authentification Supabase**
  - Page de login
  - Page de signup
  - Middleware pour protéger les routes
  - Logout

- [ ] **Modules CRUD complets** (avec API routes + DB)
  1. **Attendees** (`/attendees`)
     - Lister les inscrits
     - Ajouter/modifier/supprimer
     - Import CSV
     - Statuts de paiement
  
  2. **Tasks** (`/tasks`)
     - Vue par statut (Todo/In Progress/Done)
     - Vue par catégorie
     - Assignation
     - Priorités
  
  3. **Email Campaigns** (`/email-campaigns`)
     - Lister les campagnes
     - Créer campagne
     - Tracker d'envoi
     - Stats ouverture/clics
  
  4. **Social Media** (`/social-media`)
     - Posts par plateforme
     - Calendrier de publication
     - Stats (likes, commentaires, partages)
     - Draft/Scheduled/Published
  
  5. **Workshop Program** (`/workshop-program`)
     - Timeline de la session
     - Intervenant par session
     - Matériel requis
  
  6. **Budget** (`/budget`)
     - Estimé vs réel
     - P&L automatique
     - Seuil de rentabilité
  
  7. **Testimonials** (`/testimonials`)
     - Collecte d'avis
     - Note 1-5
     - Plateforme de diffusion
  
  8. **Outreach Tracker** (`/outreach`)
     - Prospection
     - Partenariats
     - Suivi relances
  
  9. **Landing Page** (`/landing-page`)
     - Metadata SEO
     - CTA tracking
     - Taux de conversion

## 📊 Phase 3 : APIs

Créer des routes API pour chaque module :
```
/api/attendees
/api/tasks
/api/email-campaigns
/api/social-media-posts
/api/workshop-program
/api/budget
/api/testimonials
/api/outreach
/api/landing-pages
```

## 🎨 Phase 4 : Polish & Déploiement

- [ ] Tests des fonctionnalités principales
- [ ] Gérer les erreurs et validations
- [ ] Responsive design sur mobile
- [ ] Animations/transitions
- [ ] Intégrations optionnelles
  - Google Sheets sync (optionnel)
  - Exports PDF (optionnel)
  - Emails réels (Resend ou SendGrid)

## 🚀 Phase 5 : Déploiement Vercel

- [ ] Connecter le repo GitHub à Vercel
- [ ] Configurer les env vars
- [ ] Tests en production
- [ ] Setup du domaine

## Stack décisions

### Tech
- **Frontend** : React 18 + Next.js 14 + TypeScript + Tailwind
- **Backend** : Supabase (PostgreSQL + REST API)
- **Auth** : Supabase Auth
- **Deployment** : Vercel
- **Charts** : Recharts (pour les graphiques KPI)

### Priorités MVP

**Essentiels (avant 01/08)** :
1. Dashboard avec KPIs
2. Gestion des inscrits (Attendees)
3. Gestion des tâches (Tasks)
4. Email Campaigns (pour SSD Communication)
5. Social Media (pour SSD Communication)

**Nice to have** :
- Testimonials
- Budget détaillé
- Outreach Tracker
- Landing Page manager
- Ads Manager

## Notes techniques

### Patterns à suivre

```typescript
// API Routes pattern
export async function GET(request: Request) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('table_name')
    .select('*')
  
  if (error) return Response.json({ error }, { status: 400 })
  return Response.json(data)
}

// Client component pattern
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Component() {
  const [data, setData] = useState([])
  const supabase = createClient()
  
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('table').select('*')
      setData(data)
    }
    fetchData()
  }, [])
  
  return <div>{/* render */}</div>
}
```

### Base de données

Les tables sont déjà définies dans `lib/supabase/schema.sql`.
À exécuter dans Supabase SQL Editor pour initialiser la DB.

### Design system

**Couleurs** :
- Primary : `#4dd1e3`
- White : `#ffffff`
- Gray scale : utiliser Tailwind defaults

**Composants réutilisables** :
- `Card` : conteneur générique
- `KPICard` : affichage de métriques
- `Table` : listes de données
- `Header` : titre de page
- `DashboardLayout` : layout avec sidebar

## Mode de travail

Développer module par module :
1. Créer le composant UI
2. Créer l'API route
3. Connecter à Supabase
4. Tester le CRUD
5. Répéter

Chaque étape = 1 commit git avec message clair.

## Questions ouvertes

1. Authentification : Email simple ou SSO (Google) ?
2. Notifications : Email réelles ou juste dans l'app ?
3. Synchronisation attendees → CRM : quand l'implémenter ?
4. Import Google Sheets : inclure ou post-MVP ?

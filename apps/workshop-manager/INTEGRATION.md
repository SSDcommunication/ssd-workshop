# Guide d'intégration - Hooks & Supabase

Ce guide explique comment connecter les composants React aux données Supabase via les hooks personnalisés.

## Architecture

```
Component (React)
    ↓
Hook (useAttendees, useTasks, etc.)
    ↓
API Route (/api/attendees, /api/tasks, etc.)
    ↓
Supabase Client
    ↓
PostgreSQL (Supabase)
```

## Utilisation des Hooks

### Exemple : AttendeeManager

**Avant (données mockées)**:
```typescript
'use client'
import { useState } from 'react'
import { Attendee } from '@/types'

export default function AttendeeManager() {
  const [attendees, setAttendees] = useState<Attendee[]>([
    // données mockées...
  ])
  // ...
}
```

**Après (avec Supabase)**:
```typescript
'use client'
import { useAttendees } from '@/lib/hooks'

export default function AttendeeManager() {
  const workshopId = '...' // récupéré du contexte/URL
  const { attendees, loading, error, addAttendee, updateAttendee, deleteAttendee } 
    = useAttendees(workshopId)

  // attendees charge automatiquement les données de la DB
  // loading indique si les données se chargent
  // error contient les messages d'erreur
  // addAttendee() ajoute un nouvel inscrit
  // updateAttendee() modifie un inscrit
  // deleteAttendee() supprime un inscrit
}
```

### Hooks disponibles

```typescript
import {
  useAttendees,
  useTasks,
  useEmailCampaigns,
  useSocialMedia,
  useWorkshops,
} from '@/lib/hooks'
```

Chaque hook retourne :
- `data` : tableau des données
- `loading` : booléen indicateur de chargement
- `error` : string | null
- `add[Entity]()` : ajoute une entrée
- `update[Entity]()` : modifie une entrée
- `delete[Entity]()` : supprime une entrée

## API Routes

### Pattern GET (lister)

```typescript
// /api/attendees?workshop_id=123
const response = await fetch('/api/attendees?workshop_id=123')
const data = await response.json()
```

Params supportés par module :
- **attendees** : `workshop_id`
- **tasks** : `workshop_id`, `status`
- **email_campaigns** : `workshop_id`
- **social_media** : `workshop_id`, `platform`
- **workshops** : aucun

### Pattern POST (créer)

```typescript
const response = await fetch('/api/attendees', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workshop_id: '...',
    full_name: 'Marie Dupont',
    email: 'marie@example.com',
    // ... autres champs
  })
})
const newAttendee = await response.json()
```

### Pattern PATCH (modifier)

```typescript
const response = await fetch('/api/attendees/123', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    payment_status: 'paid',
    amount_paid: 49,
  })
})
const updated = await response.json()
```

### Pattern DELETE (supprimer)

```typescript
const response = await fetch('/api/attendees/123', { method: 'DELETE' })
```

## Intégration par module (à faire)

### 1. AttendeeManager ⏳
- [ ] Importer `useAttendees`
- [ ] Récupérer `workshopId` depuis URL/contexte
- [ ] Remplacer `useState` par le hook
- [ ] Connecter les boutons (ajouter, modifier, supprimer)
- [ ] Afficher les vrais statuts de paiement

### 2. TaskManager ⏳
- [ ] Importer `useTasks`
- [ ] Récupérer `workshopId`
- [ ] Implémenter drag-drop avec update de statut
- [ ] Afficher les vraies données

### 3. EmailCampaignManager ⏳
- [ ] Importer `useEmailCampaigns`
- [ ] Charger la séquence SSD Communication depuis la DB
- [ ] Boutons d'envoi (planifier/envoyer)

### 4. SocialMediaManager ⏳
- [ ] Importer `useSocialMedia`
- [ ] Charger les 18 posts LinkedIn
- [ ] Filtrer par plateforme
- [ ] Afficher les stats engagement

### 5. Dashboard ⏳
- [ ] Importer tous les hooks
- [ ] Calculer les KPIs à partir des vraies données
- [ ] Afficher l'activité récente

## Types TypeScript

Tous les types sont définis dans `types/index.ts` :

```typescript
import {
  Workshop,
  Attendee,
  Task,
  WorkshopProgram,
  SocialMediaPost,
  EmailCampaign,
  Budget,
  Testimonial,
  OutreachContact,
  LandingPage,
} from '@/types'
```

## Gestion d'erreurs

Les hooks retournent `error` qui doit être affiché à l'utilisateur :

```typescript
const { attendees, error } = useAttendees(workshopId)

if (error) {
  return <div className="text-red-600">Erreur : {error}</div>
}
```

## Authentification

Toutes les routes API sont protégées par le middleware.
Seuls les utilisateurs connectés (ayant une session Supabase) peuvent accéder aux données.

## Prochaines étapes

1. ✅ Authentification Supabase (login/signup)
2. ✅ API routes CRUD
3. ✅ Custom hooks
4. ⏳ **Intégrer les hooks dans les composants** (AttendeeManager en priorité)
5. ⏳ Import CSV pour inscrits
6. ⏳ Tests des fonctionnalités

## Commandes utiles

```bash
# Dev
npm run dev

# Vérifier les types
npm run type-check

# Build
npm run build
```

## Debug

Pour déboguer les appels API :
1. Ouvrir DevTools (F12)
2. Aller dans Network
3. Vérifier les appels à `/api/*`
4. Vérifier les status codes (200, 201, 400, 500)
5. Vérifier les réponses JSON

## Support

Questions ? Regarder :
- `/lib/hooks/useAttendees.ts` pour un exemple complet
- `/app/api/attendees/route.ts` pour l'API route
- `/types/index.ts` pour les définitions TypeScript

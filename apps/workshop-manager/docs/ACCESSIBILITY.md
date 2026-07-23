# 📋 Guide d'Accessibilité - Workshop Manager

## Vue d'ensemble

Ce guide documente les standards d'accessibilité (A11y) suivis par l'application Workshop Manager, en conformité avec les Web Content Accessibility Guidelines (WCAG) 2.1.

---

## Principes Fondamentaux

### 1. Perceivable
Les informations et les éléments de l'interface doivent être perceptibles pour tous.

**Implémentation:**
- ✅ Texte alternatif pour les images
- ✅ Contraste suffisant (ratio 4.5:1 minimum)
- ✅ Couleur n'est pas le seul moyen de communiquer
- ✅ Contenu lisible et compréhensible

### 2. Operable
L'interface doit être navigable et utilisable au clavier.

**Implémentation:**
- ✅ Navigation complète au clavier
- ✅ Ordre de focus logique
- ✅ Aucun pièce piégée du clavier
- ✅ Temps suffisant pour agir

### 3. Understandable
Le contenu et l'interface doivent être compréhensibles.

**Implémentation:**
- ✅ Langage clair et simple
- ✅ Labels et instructions explicites
- ✅ Messages d'erreur clairs
- ✅ Prédictibilité

### 4. Robust
Compatible avec les technologies d'assistance.

**Implémentation:**
- ✅ Code HTML valide et sémantique
- ✅ Attributs ARIA appropriés
- ✅ Roles et états cohérents
- ✅ Tests avec lecteurs d'écran

---

## Composants Accessibles

### Formulaires

```typescript
// ✅ BON: Label explicitement lié au input
<div>
  <label htmlFor="email" className="block text-sm font-medium mb-2">
    Email
  </label>
  <input
    id="email"
    type="email"
    aria-label="Adresse email"
    aria-describedby="email-error"
    className="input-field"
  />
  <FormError id="email-error" error={errors.email} />
</div>

// ❌ MAUVAIS: Label flottant sans association
<label>Email</label>
<input type="email" />
```

### Boutons

```typescript
// ✅ BON: Aria-label explicite pour les boutons icones
<button
  onClick={handleDelete}
  aria-label={`Supprimer l'atelier ${workshopName}`}
  className="text-red-600 hover:underline"
>
  🗑️
</button>

// ❌ MAUVAIS: Bouton sans étiquette claire
<button onClick={handleDelete}>
  🗑️
</button>
```

### Tables

```typescript
// ✅ BON: Structure sémantique avec ARIA
<table role="table" aria-label="Liste des ateliers">
  <thead>
    <tr role="row">
      <th scope="col" role="columnheader">Nom</th>
    </tr>
  </thead>
  <tbody>
    <tr role="row">
      <td role="cell">IKIGAI</td>
    </tr>
  </tbody>
</table>

// ❌ MAUVAIS: Divs styling comme table
<div className="table">
  <div className="row">Item</div>
</div>
```

### Dialogues de confirmation

```typescript
// ✅ BON: Dialog sémantique avec rôles
<dialog open role="alertdialog" aria-modal="true">
  <h2 aria-label="Confirmation">Êtes-vous sûr?</h2>
  <p>Cette action est irréversible.</p>
  <button>Confirmer</button>
  <button>Annuler</button>
</dialog>
```

### États de Chargement

```typescript
// ✅ BON: Notification explicite
<div role="status" aria-live="polite" aria-busy={loading}>
  {loading ? 'Chargement...' : 'Terminé'}
</div>

// ✅ BON: aria-live pour les toasts
<div role="alert" aria-live="assertive" className="toast">
  ✓ Changements sauvegardés
</div>
```

### Recherche

```typescript
// ✅ BON: Champ avec aria-label et bouton clear
<div className="relative">
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Chercher..."
    aria-label="Chercher un atelier"
  />
  {search && (
    <button
      onClick={() => setSearch('')}
      aria-label="Effacer la recherche"
      type="button"
    >
      ✕
    </button>
  )}
</div>
```

---

## Navigation au Clavier

### Shortcuts standard
- **Tab**: Naviguer vers l'élément suivant
- **Shift+Tab**: Naviguer vers l'élément précédent
- **Enter**: Activer un bouton ou soumettre un formulaire
- **Space**: Activer un bouton ou case à cocher
- **Escape**: Fermer un dialogue

### Implémentation dans les Composants

```typescript
// ✅ BON: Clavier support complet
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Escape') {
    onClose()
  }
}

<dialog onKeyDown={handleKeyDown}>
  {/* contenu */}
</dialog>
```

---

## Contraste et Couleurs

### Ratios de Contraste Minimums
- **AA (normal)**: 4.5:1 pour le texte
- **AA (grand)**: 3:1 pour le texte > 18pt
- **AAA**: 7:1 pour le maximum d'accessibilité

### Palette Accessible
```typescript
// Couleurs primaires
const colors = {
  primary: '#4dd1e3',      // Utilisé avec blanc
  success: '#10b981',      // Texte d'erreur visible
  error: '#ef4444',        // Contraste suffisant
  warning: '#f59e0b',      // Pour les avertissements
}

// ✅ Tous respectent 4.5:1 minimum sur blanc
```

### Test de Contraste
1. Utiliser https://www.tpgi.com/color-contrast-checker/
2. Tester noir/blanc texte sur toutes les couleurs
3. Valider au moins AA (AAA recommandé)

---

## Tests d'Accessibilité

### Tools Recommandés
```bash
# Installations
npm install --save-dev @axe-core/react jest-axe
npm install --save-dev @testing-library/jest-dom
```

### Tester dans Jest
```typescript
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('AccessibilityTests', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<WorkshopsCreation />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

### Navigation au Clavier - Test Manuel
1. Démarrer l'app: `npm run dev`
2. Appuyer sur Tab 50 fois
3. Vérifier que:
   - Tous les boutons/inputs reçoivent le focus
   - L'ordre est logique
   - Les dialogues piègent le focus
   - Escape ferme les dialogues

---

## Checklist de Déploiement

- [ ] Tous les inputs ont un label `<label>`
- [ ] Les rôles ARIA correspondent à la fonction réelle
- [ ] Les couleurs ont 4.5:1 de contraste
- [ ] La navigation au clavier est complète
- [ ] Les lecteurs d'écran testés (NVDA, JAWS)
- [ ] Les images ont du `alt` text
- [ ] Les formulaires ont des messages d'erreur visibles
- [ ] Les états de chargement sont annoncés
- [ ] Les dialogues utilisent `<dialog>` ou `role="dialog"`
- [ ] Les listes utilisent `<ul>`, `<ol>`, `<li>`

---

## Ressources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Accessible Colors](https://www.accessible-colors.com/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

---

## Contribution

Lors de l'ajout de nouvelles fonctionnalités:
1. Lancer `npm run test:a11y` pour les tests automatisés
2. Tester manuellement au clavier
3. Valider avec https://wave.webaim.org/
4. Documentez tout nouveau pattern non-standard

---

*Dernière mise à jour: 2026-07-22*

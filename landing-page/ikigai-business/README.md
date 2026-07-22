# IKIGAI Business · Landing Page & Système d'Inscriptions

## Structure

```
ikigai-business/
├── index.html              # Page d'accueil + pricing
├── inscription.html        # Formulaire d'inscription + Stripe
├── confirmation.html       # Page de confirmation (TODO)
├── README.md              # Ce fichier
└── assets/                # (À créer) Images, logos, etc.
```

---

## Pages

### 1. `index.html` — Landing Page
- Héro avec le positionnement
- Diagnostic gratuit (bouton)
- Pricing avec 3 formules
- 16 raisons de dire oui
- FAQ
- Call-to-action d'inscription

**À faire :**
- Ajouter les images/screenshots
- Intégrer le diagnostic gratuit en Typeform/Jotform
- Liens d'analytics (GA, Facebook Pixel)

### 2. `inscription.html` — Paiement Stripe
- Formulaire des informations
- Sélection de formule (radio buttons)
- Intégration Stripe Elements
- Confirmation immédiate

**Configuration Stripe requise :**
```
Clés publiques/secrètes à obtenir depuis https://dashboard.stripe.com

PUBLIC_KEY: pk_test_... (remplacer par clé réelle)
SECRET_KEY: sk_test_... (remplacer par clé réelle)

Produits Stripe à créer :
- IKIGAI Business Standard (49€)
- IKIGAI Business Premium (97€)
- IKIGAI Business VIP (197€)
```

### 3. `confirmation.html` — Merci (TODO)
- Message de confirmation
- Lien Zoom (ou message "On vous contactera")
- Prochaines étapes
- Invitation WhatsApp

---

## Flux de Conversion

```
Visiteur
  ↓
1. Landing page (index.html)
  ├─ Diagnostic gratuit (external link)
  └─ "S'inscrire" → inscription.html
  ↓
2. Formulaire + Paiement Stripe (inscription.html)
  ↓
3. Confirmation (confirmation.html)
  ├─ Email automatique avec lien Zoom
  ├─ Ajout à liste email (Mailchimp/ConvertKit)
  └─ Déclenche séquence email du jour 0
  ↓
4. Email Day -3: Reminder + Zoom link
5. Email Day -1: Last reminder
6. Email Day J: C'est maintenant
7. Email Day +1: Merci + matériaux
8. Email Day +30: Follow-up / Upsell VIP
```

---

## Configuration Requise

### Email Automation
Pour la séquence d'emails, intégrer avec :
- **Mailchimp** (gratuit pour < 500 contacts)
- **ConvertKit** (plus professionnel)
- **Zapier** (pour déclencher les séquences)

**Actions requises :**
1. Créer une audience "IKIGAI Business"
2. Créer les 8 emails (voir `../ikigai-business/EMAIL-SEQUENCE.md`)
3. Créer une automation "Nouvel inscrit IKIGAI" qui envoie les emails aux jours J, J+1, J+7, etc.

### WhatsApp
Pour le groupe WhatsApp :
- Créer un groupe WhatsApp pour les participants
- Partager le lien d'invitation via email de confirmation
- Alternative: Telegram ou Discord

### Zoom
- Créer un meeting récurrent pour les sessions IKIGAI
- Lien copié dans confirmation.html + emails

---

## Backend (Node.js / Express — TODO)

Pour automatiser les paiements et inscriptions, créer une API simple :

```javascript
// server.js

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json());

// Endpoint: Créer une session Stripe Checkout
app.post('/api/checkout', async (req, res) => {
  const { plan, email, firstName, lastName } = req.body;

  const priceIds = {
    standard: 'price_1234567890',  // TODO: Remplacer par IDs Stripe réels
    premium: 'price_0987654321',
    vip: 'price_1111111111'
  };

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceIds[plan],
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email,
      metadata: {
        firstName,
        lastName,
        plan,
      },
      success_url: `${process.env.DOMAIN}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/inscription.html`,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Webhook: Confirmer le paiement
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // TODO: 
    // 1. Sauvegarder l'inscription en DB
    // 2. Envoyer email de confirmation
    // 3. Ajouter à Mailchimp / email automation
    // 4. Envoyer lien Zoom
    // 5. Logger pour tracking

    console.log(`Inscription confirmée: ${session.customer_email} - ${session.metadata.plan}`);
  }

  res.json({received: true});
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

**Variables d'environnement (.env)** :
```
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
DOMAIN=https://ikigai.studio-styledesign.com
DATABASE_URL=... (pour stocker les inscriptions)
MAILCHIMP_API_KEY=...
MAILCHIMP_LIST_ID=...
ZOOM_JWT_TOKEN=...
```

---

## Checklist Déploiement

- [ ] Remplacer clés Stripe (public + secret)
- [ ] Créer produits/prix Stripe
- [ ] Configurer Mailchimp + séquence d'emails
- [ ] Créer Zoom meeting récurrent
- [ ] Déployer backend (Vercel, Heroku, etc.)
- [ ] Tester flux complet (inscriptions fictives)
- [ ] Ajouter analytics (Google Analytics, Hotjar)
- [ ] Configurer DNS (ikigai.studio-styledesign.com)
- [ ] Tester emails (envoi test à [email])
- [ ] Vérifier webhooks Stripe

---

## Données à Tracker

**Dans chaque inscription :**
- Prénom, Nom, Email, Téléphone
- Secteur d'activité
- Formule choisie (Standard/Premium/VIP)
- Date/heure d'inscription
- Source (si possible)

**Emails à tracker :**
- Taux d'ouverture (suivi automatique Mailchimp)
- Clics sur lien d'inscription
- Conversions (Day 0 → Day 3 → inscription)

**Performance :**
- Taux de conversion landing → inscription
- Taux de conversion inscription → paiement
- Répartition formules (% Standard vs Premium vs VIP)
- Valeur moyenne de panier

---

## Ressources

- **Stripe Documentation** : https://stripe.com/docs
- **Mailchimp Automation** : https://mailchimp.com/features/automation/
- **Vercel Deployment** : https://vercel.com/docs
- **Zoom API** : https://developers.zoom.us/

---

## Support

Pour questions : contact.ssdcommunication@gmail.com

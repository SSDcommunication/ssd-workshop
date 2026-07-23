# 🚀 Migration Locale - Exécution Immédiate

Le proxy de cet environnement cloud bloque les accès directs à Supabase. **Tu dois exécuter cette commande sur ta machine locale** (Windows, Mac, Linux).

## Option 1: Via votre terminal local (Recommandé)

### Étape 1: Copier le fichier schema.sql

Depuis le repo, copie ce fichier:
```
lib/supabase/schema.sql
```

### Étape 2: Accéder à Supabase SQL Editor

Ouvre dans votre navigateur:
```
https://app.supabase.com/project/ixbatrhxequtbngvaexz
```

Allez à: **SQL Editor** (panneau gauche)

### Étape 3: Créer une nouvelle requête

Cliquez: **+ New Query**

### Étape 4: Copier le SQL

1. Ouvrez `lib/supabase/schema.sql` dans votre éditeur de texte
2. Sélectionnez tout (Ctrl+A / Cmd+A)
3. Copiez (Ctrl+C / Cmd+C)

### Étape 5: Exécuter la migration

1. Collez dans l'éditeur SQL (Ctrl+V / Cmd+V)
2. Cliquez le bouton **Run** ou appuyez **Ctrl+Enter / Cmd+Enter**
3. Attendez le message: **"Success. No rows returned"**

---

## Option 2: Avec Node.js local (Alternative)

Si vous avez Node.js installé localement:

```bash
# 1. Clonez ou téléchargez le repo
git clone https://github.com/ssdcommunication/ssd-workshop.git
cd ssd-workshop

# 2. Allez au répertoire de l'app
cd apps/workshop-manager

# 3. Créez le fichier .env.local avec vos credentials
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=https://ixbatrhxequtbngvaexz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4YmF0cmh4ZXF1dGJuZ3ZhZXh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0MjgxMTksImV4cCI6MjEwMDAwNDExOX0.f5LS-1e10Zv7nA6aYVM43nCB2cKLX7R6rRpL3TA_69U
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4YmF0cmh4ZXF1dGJuZ3ZhZXh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDQyODExOSwiZXhwIjoyMTAwMDA0MTE5fQ.kyBmf8y-l81vr9WaIt4dG9OszcYIh8hiwoqbrYK07dM
EOF

# 4. Installez les dépendances
npm install @supabase/supabase-js

# 5. Exécutez la migration
node scripts/migrate-local.js
```

---

## ✅ Vérifier la Réussite

Une fois exécutée, la migration crée ces tables:
- ✓ workshop_types
- ✓ workshops
- ✓ documents
- ✓ attendees
- ✓ tasks
- ✓ email_campaigns
- ✓ social_media_posts
- ✓ budget
- ✓ testimonials
- ✓ outreach
- ✓ workshop_program
- ✓ landing_page

---

## 🎯 Après Exécution

Une fois la migration réussie:

1. **Retournez à l'app web** → http://localhost:3000/workshops
2. **Créez un atelier** (ex: IKIGAI)
3. **Créez un événement** (ex: IKIGAI - Juillet 2026)
4. **Vérifiez l'héritage** des places et prix

---

## 💡 Besoin d'aide?

- **Migration bloquée?** Vérifiez vos credentials Supabase
- **Erreurs SQL?** Vérifiez que schema.sql est complet
- **Pas d'accès à Supabase?** Demandez les permissions à l'admin

Credentials utilisés:
- **Project:** ixbatrhxequtbngvaexz
- **Region:** (à vérifier dans Supabase)

---

**Status:** ⏳ En attente d'exécution locale

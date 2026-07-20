# 🗄️ Database Migration Guide - SSD Workshop Manager

## Overview

Your database schema is ready! This guide explains how to execute the migration to create the master-detail architecture for workshop management.

## Migration Details

The migration creates:

- **workshop_types** - Template configurations (places, price, documents by status)
- **workshops** - Dated instances that inherit from workshop_types
- **Supporting tables** - documents, attendees, tasks, email_campaigns, social_media_posts, budget, testimonials, outreach, workshop_program, landing_page
- **Indexes** - 12 performance indexes
- **Security** - Row Level Security (RLS) policies on all tables

**Total SQL Statements:** 85
**File Location:** `lib/supabase/schema.sql`

---

## ⚡ Quick Start (Recommended)

### Option 1: Manual Execution via Supabase Dashboard (Best)

This is the most reliable method:

1. **Open Supabase Dashboard**
   ```
   https://app.supabase.com/project/ixbatrhxequtbngvaexz
   ```

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar

3. **Create New Query**
   - Click "+ New Query" button

4. **Copy the Schema**
   - Open: `lib/supabase/schema.sql`
   - Select all (Ctrl+A or Cmd+A)
   - Copy (Ctrl+C or Cmd+C)

5. **Paste and Execute**
   - Paste into SQL Editor (Ctrl+V or Cmd+V)
   - Click "Run" button or press Ctrl+Enter (Cmd+Enter on Mac)

6. **Verify Success**
   - You should see: `Success. No rows returned`
   - All tables will be created with 0 rows

---

## 🖥️ Command Line Options

### Option 2: Run Script from Your Local Machine

If you have Node.js installed locally:

```bash
# Copy the script to your machine first
# Then run:
node scripts/migrate-local.js \
  "https://ixbatrhxequtbngvaexz.supabase.co" \
  "eyJhbGc...your_service_role_key...fQ"
```

Or with environment variables:

```bash
export NEXT_PUBLIC_SUPABASE_URL="https://ixbatrhxequtbngvaexz.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
node scripts/migrate-local.js
```

### Option 3: Using Supabase CLI (if installed)

If you have the Supabase CLI installed locally:

```bash
supabase db push
```

---

## 🔍 Database Architecture

### Master-Detail Pattern

```
WorkshopType (Template)
├── id
├── name: "IKIGAI"
├── places_min: 5
├── places_max: 30
├── places_ideal: 20
├── price: 49€
├── documents_by_status: {
│   ├── en_construction: ["doc1", "doc2"]
│   ├── actif: ["doc3"]
│   └── archive: ["doc4"]
│   }
└── status: "active"

Workshop (Instance) ←→ References WorkshopType
├── id
├── workshop_type_id: <ref to WorkshopType>
├── name: "IKIGAI - Juillet 2026"
├── date: 2026-07-15T09:00:00Z
├── status: "planning" | "active" | "completed" | "archived"
├── max_attendees: 20 (inherited from places_ideal)
└── price: 49€ (inherited from WorkshopType)
```

---

## 📋 After Migration

Once the migration completes, you can immediately start using the application:

### Step 1: Create Workshop Type
1. Go to **"Types d'ateliers"** page
2. Click **"+ Créer un type"**
3. Fill in:
   - **Name:** IKIGAI
   - **Slug:** ikigai
   - **Description:** Your description
   - **Places:** min=5, max=30, ideal=20
   - **Price:** 49
   - **Status:** Active
4. Click **"Créer"**

### Step 2: Create Workshop Instances
1. Go to **"Ateliers"** page
2. Click on the **IKIGAI** type button
3. Click **"+ Créer une date pour IKIGAI"**
4. Fill in:
   - **Name:** e.g., "IKIGAI - Juillet 2026"
   - **Date:** Pick a date and time
   - **Status:** Choose initial status
5. Click **"Créer l'atelier"**

**Repeat Step 2** to create multiple dated instances!

### Step 3: Configure Documents (Optional)
1. Go to **"Documents"** page
2. Upload PDFs and assign them to specific statuses:
   - **en_construction** (Planning)
   - **actif** (Active)
   - **archive** (Archived)

---

## 🆘 Troubleshooting

### "Cannot find workshop_types table"

**Solution:** The migration script hasn't been executed yet.

1. Make sure you completed Option 1 above
2. Verify the SQL executed successfully (look for "Success" message)
3. Refresh the page
4. Check Supabase Dashboard → SQL Editor → Recent queries to see the execution

### "Foreign key constraint error"

**Solution:** Tables were created in the wrong order.

1. Delete all tables: Run the cleanup script (or manually delete in Supabase)
2. Run the migration again
3. Ensure you copy the **entire** schema.sql file, not just parts

### Connection issues

**Solution:** Check your Supabase credentials:

1. Go to: https://app.supabase.com/project/ixbatrhxequtbngvaexz
2. Settings → API Keys
3. Copy the **Service Role** key (not the Anon key)
4. Update `.env.local` with the correct key

---

## 📁 Files Used

- **lib/supabase/schema.sql** - Complete database schema
- **scripts/migrate.js** - Migration guide generator
- **scripts/migrate-local.js** - Local execution script
- **.env.local** - Your Supabase credentials (already configured)

---

## 🎯 What's Next?

After migration, explore these features:

1. **Dashboard** - View workshop statistics
2. **Types d'ateliers** - Manage workshop templates
3. **Ateliers** - Create and manage workshop instances
4. **Documents** - Upload files for participants
5. **Inscrits** - Track attendees
6. **Emails** - Send campaigns
7. **Tasks** - Manage workflow
8. **Budget** - Track finances
9. **Testimonials** - Collect feedback
10. **Social Media** - Schedule posts
11. **Landing Page** - Create promotion pages

---

## ❓ Support

- Documentation: See this file
- Schema details: `lib/supabase/schema.sql`
- Code: `/apps/workshop-manager/`
- Supabase Docs: https://supabase.com/docs

---

**Status:** ✅ Ready for deployment

**Next Step:** Execute migration via Supabase Dashboard

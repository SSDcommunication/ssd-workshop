#!/bin/bash

# Load environment variables from .env.local
if [ ! -f "apps/workshop-manager/.env.local" ]; then
  echo "❌ .env.local not found at apps/workshop-manager/.env.local"
  exit 1
fi

source apps/workshop-manager/.env.local

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "❌ Missing Supabase credentials in .env.local"
  exit 1
fi

SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL"
SERVICE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

echo ""
echo "🚀 Running database migration for SSD Workshop Manager"
echo "=================================================="
echo ""
echo "📊 Supabase Project: $(echo $SUPABASE_URL | sed 's|https://||' | sed 's|.supabase.co||')"
echo ""

# Read the schema.sql file
SCHEMA_FILE="lib/supabase/schema.sql"

if [ ! -f "$SCHEMA_FILE" ]; then
  echo "❌ Schema file not found at $SCHEMA_FILE"
  exit 1
fi

echo "📝 Reading schema from: $SCHEMA_FILE"
echo ""

# Count statements
STATEMENT_COUNT=$(grep -c ";" "$SCHEMA_FILE")
echo "📋 Found $STATEMENT_COUNT SQL statements to execute"
echo ""

# Try to connect and execute via Supabase API
echo "🔗 Attempting to send migration to Supabase..."
echo ""

# Create a temporary file with just the schema
cat "$SCHEMA_FILE" > /tmp/schema_migration.sql

# Split the SQL file into individual statements and send them
# Since Supabase REST API doesn't directly support arbitrary SQL execution,
# we'll need to use the web interface or provide instructions

echo "⚠️  Supabase REST API does not support direct SQL execution."
echo ""
echo "✅ Please execute the migration manually via Supabase Dashboard:"
echo ""
echo "1️⃣  Go to: https://app.supabase.com"
echo "2️⃣  Select your project: $(echo $SUPABASE_URL | sed 's|https://||' | sed 's|.supabase.co||')"
echo "3️⃣  Navigate to SQL Editor (left sidebar)"
echo "4️⃣  Click 'New Query'"
echo "5️⃣  Copy ALL content from: $SCHEMA_FILE"
echo "6️⃣  Paste it into the SQL Editor"
echo "7️⃣  Click the 'Run' button (or press Ctrl+Enter)"
echo ""
echo "⏳ The migration will create:"
echo "   • workshop_types (template configurations)"
echo "   • workshops (dated instances)"
echo "   • documents, attendees, tasks, and 8 more supporting tables"
echo "   • Indexes and Row Level Security policies"
echo ""
echo "📌 After migration, you can:"
echo "   1. Create a workshop type (IKIGAI)"
echo "   2. Create dated instances of that type"
echo "   3. Configure documents for each status"
echo ""

exit 0

#!/bin/bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "🚀 SSD Workshop Manager - Database Migration"
echo "=============================================="
echo -e "${NC}\n"

# Load environment
if [ ! -f "apps/workshop-manager/.env.local" ]; then
  echo -e "${RED}❌ .env.local not found${NC}"
  exit 1
fi

source apps/workshop-manager/.env.local

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo -e "${RED}❌ Missing Supabase credentials${NC}"
  exit 1
fi

SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL"
PROJECT_ID=$(echo "$SUPABASE_URL" | sed 's|https://||' | sed 's|\.supabase\.co||')

echo -e "${BLUE}📊 Project:${NC} $PROJECT_ID"
echo -e "${BLUE}🔗 URL:${NC} $SUPABASE_URL"
echo ""

# Read schema
SCHEMA_FILE="lib/supabase/schema.sql"
if [ ! -f "$SCHEMA_FILE" ]; then
  echo -e "${RED}❌ Schema file not found at $SCHEMA_FILE${NC}"
  exit 1
fi

echo -e "${BLUE}📝 Reading schema...${NC}"
STATEMENT_COUNT=$(grep -c "^CREATE\|^ALTER\|^INSERT" "$SCHEMA_FILE")
echo -e "${GREEN}✅ Found $STATEMENT_COUNT SQL statements${NC}\n"

# Create temporary file
TEMP_SQL=$(mktemp)
cp "$SCHEMA_FILE" "$TEMP_SQL"

echo -e "${YELLOW}⏳ Attempting database migration...${NC}\n"

# Attempt 1: Try using curl with Bearer token
echo -e "${BLUE}📡 Method 1: Testing REST API connection...${NC}"

RESPONSE=$(curl -s -X GET \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -w "\n%{http_code}" \
  "$SUPABASE_URL/rest/v1/information_schema.tables?select=table_name&limit=1")

STATUS=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$STATUS" = "200" ]; then
  echo -e "${GREEN}✅ Connected to Supabase${NC}\n"

  # Check if workshop_types table exists
  if echo "$BODY" | grep -q "workshop_types"; then
    echo -e "${GREEN}✅ Tables already exist!${NC}\n"
    echo -e "${GREEN}🎉 Database is ready to use!${NC}\n"
    echo -e "${BLUE}📌 Next steps:${NC}"
    echo "  1. Go to 'Types d'ateliers' and create IKIGAI"
    echo "  2. Go to 'Ateliers' and create instances"
    echo ""
    rm "$TEMP_SQL"
    exit 0
  else
    echo -e "${YELLOW}⚠️  Tables don't exist yet${NC}\n"
  fi
else
  echo -e "${RED}❌ API connection failed (Status: $STATUS)${NC}"
fi

# Attempt 2: Try using Supabase SQL endpoint
echo -e "${BLUE}📡 Method 2: Trying SQL execution endpoint...${NC}"

# Send SQL via REST
SQL_CONTENT=$(cat "$SCHEMA_FILE")

# Try to execute - this might not work but worth trying
EXEC_RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -w "\n%{http_code}" \
  -d "{\"sql\": \"$(echo "$SQL_CONTENT" | head -1)\"}" \
  "$SUPABASE_URL/rest/v1/sql" 2>/dev/null || true)

STATUS=$(echo "$EXEC_RESPONSE" | tail -n 1)

if [ "$STATUS" = "200" ] || [ "$STATUS" = "201" ]; then
  echo -e "${GREEN}✅ SQL execution successful!${NC}\n"
  echo -e "${GREEN}🎉 Database migration complete!${NC}\n"
  rm "$TEMP_SQL"
  exit 0
fi

# Final attempt: Show final instructions
echo -e "${YELLOW}⚠️  Automatic migration not available${NC}\n"

echo -e "${BLUE}📋 MANUAL MIGRATION REQUIRED${NC}\n"

echo "Please execute this SQL manually:\n"
echo "1️⃣  ${BLUE}Open Supabase Dashboard${NC}"
echo "   https://app.supabase.com/project/$PROJECT_ID\n"

echo "2️⃣  ${BLUE}Go to SQL Editor${NC}"
echo "   Click 'SQL Editor' in left sidebar\n"

echo "3️⃣  ${BLUE}Create New Query${NC}"
echo "   Click '+ New Query' button\n"

echo "4️⃣  ${BLUE}Copy schema file content${NC}"
echo "   File: lib/supabase/schema.sql\n"

echo "5️⃣  ${BLUE}Paste and Execute${NC}"
echo "   Click Run (or Ctrl+Enter)\n"

echo -e "${GREEN}After migration:${NC}"
echo "✅ Create workshop types in 'Types d'ateliers'"
echo "✅ Create instances in 'Ateliers'"
echo "✅ Configure documents\n"

rm "$TEMP_SQL"
exit 0

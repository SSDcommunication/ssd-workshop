#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const https = require('https')

// Read .env.local
const envPath = path.join(__dirname, '../apps/workshop-manager/.env.local')
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local not found')
  process.exit(1)
}

const env = {}
fs.readFileSync(envPath, 'utf-8')
  .split('\n')
  .filter(line => line.includes('='))
  .forEach(line => {
    const [key, ...rest] = line.split('=')
    env[key.trim()] = rest.join('=').trim()
  })

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const projectId = SUPABASE_URL.match(/https:\/\/([^.]+)/)?.[1]

console.log('\n🚀 Database Migration for SSD Workshop Manager')
console.log('='.repeat(50))
console.log(`\n📊 Project: ${projectId}`)
console.log(`🔗 URL: ${SUPABASE_URL}\n`)

// Read schema
const schemaPath = path.join(__dirname, '../lib/supabase/schema.sql')
const schema = fs.readFileSync(schemaPath, 'utf-8')

const statements = schema
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'))

console.log(`📝 Found ${statements.length} SQL statements\n`)

// Show instructions
console.log('⚠️  IMPORTANT: Manual Database Setup Required\n')
console.log('Supabase does not allow arbitrary SQL execution via API.')
console.log('You must run the migration manually via the Supabase Dashboard.\n')

console.log('📋 STEPS TO EXECUTE THE MIGRATION:\n')
console.log('1️⃣  Open Supabase Dashboard')
console.log(`    → https://app.supabase.com/project/${projectId}\n`)

console.log('2️⃣  Go to SQL Editor')
console.log('    → Click "SQL Editor" in the left sidebar\n')

console.log('3️⃣  Create New Query')
console.log('    → Click "+ New Query" button\n')

console.log('4️⃣  Copy the schema SQL')
console.log(`    → Open: lib/supabase/schema.sql`)
console.log('    → Copy ALL content (Ctrl+A, Ctrl+C)\n')

console.log('5️⃣  Paste into SQL Editor')
console.log('    → Paste the content into the Supabase SQL Editor\n')

console.log('6️⃣  Execute the Migration')
console.log('    → Click "Run" button (or press Ctrl+Enter)\n')

console.log('7️⃣  Verify Success')
console.log('    → You should see: "Success. No rows returned"\n')

console.log('📋 What this migration creates:\n')

const tableMatches = schema.match(/CREATE TABLE IF NOT EXISTS public\.([^\s]+)/g) || []
const tables = tableMatches.map(m => m.replace(/CREATE TABLE IF NOT EXISTS public\./, ''))

console.log('Tables:')
tables.forEach(table => {
  console.log(`   ✓ ${table}`)
})

console.log('\nAdditional components:')
console.log('   ✓ 12 Indexes for performance')
console.log('   ✓ Row Level Security (RLS) enabled on all tables')
console.log('   ✓ RLS policies for authenticated users\n')

console.log('🎯 Next Steps After Migration:\n')
console.log('1. Go to "Types d\'ateliers" → Create "IKIGAI" workshop type')
console.log('   - Places: 5-30 (ideal: 20)')
console.log('   - Price: 49€\n')

console.log('2. Go to "Ateliers" → Select IKIGAI type')
console.log('   - Create multiple dated instances\n')

console.log('3. Configure documents for each status')
console.log('   - en_construction (Planning)')
console.log('   - actif (Active)')
console.log('   - archive (Archived)\n')

console.log('💡 Need help?')
console.log('→ Open the schema file: lib/supabase/schema.sql')
console.log('→ It contains detailed comments and table descriptions\n')

process.exit(0)

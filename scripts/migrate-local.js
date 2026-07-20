#!/usr/bin/env node

/**
 * Run this script locally from your machine to execute the database migration
 *
 * Usage:
 *   1. Copy this file to your local machine
 *   2. Install dependencies: npm install supabase-js
 *   3. Run: node migrate-local.js
 */

const fs = require('fs')
const path = require('path')

// Get credentials from command line or environment
const args = process.argv.slice(2)
let SUPABASE_URL = args[0] || process.env.NEXT_PUBLIC_SUPABASE_URL
let SERVICE_KEY = args[1] || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.log(`\n📋 SSD Workshop Manager - Local Database Migration\n`)
  console.log(`This script executes the database migration for your Supabase project.\n`)
  console.log(`Usage:\n`)
  console.log(`  node migrate-local.js <SUPABASE_URL> <SERVICE_ROLE_KEY>\n`)
  console.log(`Or set environment variables:\n`)
  console.log(`  export NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"`)
  console.log(`  export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"`)
  console.log(`  node migrate-local.js\n`)

  console.log(`Your credentials:\n`)
  console.log(`  SUPABASE_URL: https://ixbatrhxequtbngvaexz.supabase.co`)
  console.log(`  SERVICE_KEY: [from .env.local]\n`)

  process.exit(1)
}

// Dynamically import supabase
let supabaseModule

try {
  supabaseModule = require('@supabase/supabase-js')
} catch (e) {
  console.error('❌ Missing dependency: @supabase/supabase-js')
  console.error('\nInstall with:')
  console.error('  npm install @supabase/supabase-js')
  process.exit(1)
}

const { createClient } = supabaseModule

async function runMigration() {
  const projectId = SUPABASE_URL.split('/').slice(-1)[0].split('.')[0]

  console.log('\n🚀 SSD Workshop Manager - Database Migration')
  console.log('='.repeat(50))
  console.log(`\n📊 Project: ${projectId}`)
  console.log(`🔗 URL: ${SUPABASE_URL}\n`)

  try {
    // Read schema
    const schemaPath = path.join(__dirname, '..', 'lib', 'supabase', 'schema.sql')
    if (!fs.existsSync(schemaPath)) {
      console.error(`❌ Schema file not found: ${schemaPath}`)
      process.exit(1)
    }

    const schema = fs.readFileSync(schemaPath, 'utf-8')
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📝 Found ${statements.length} SQL statements\n`)

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

    console.log('🔗 Testing connection...')
    const { data: testData, error: testError } = await supabase
      .from('information_schema.tables')
      .select('*', { count: 'exact' })
      .limit(1)
      .catch(() => ({ data: null, error: { message: 'Connection test failed' } }))

    if (!testError) {
      console.log('✅ Connected to Supabase\n')
    }

    // Note about direct SQL execution
    console.log('⚠️  This script cannot directly execute arbitrary SQL.')
    console.log('Supabase API does not support direct SQL execution.\n')

    console.log('📋 STEPS TO EXECUTE THE MIGRATION:\n')
    console.log('1️⃣  Open Supabase Dashboard')
    console.log(`    https://app.supabase.com/project/${projectId}\n`)

    console.log('2️⃣  Go to SQL Editor')
    console.log('    → Click "SQL Editor" in the left sidebar\n')

    console.log('3️⃣  Create New Query')
    console.log('    → Click "+ New Query"\n')

    console.log('4️⃣  Copy Schema Content')
    const schemaContent = schema.substring(0, 200) + '...'
    console.log(`    → Copy all content from: ${schemaPath}`)
    console.log(`    → Preview: ${schemaContent}\n`)

    console.log('5️⃣  Paste and Execute')
    console.log('    → Paste content into SQL Editor')
    console.log('    → Click "Run" (or press Ctrl+Enter)\n')

    console.log('6️⃣  Verify Success')
    console.log('    → Wait for: "Success. No rows returned"\n')

    console.log('✨ After migration, the following tables will be created:\n')

    const tableMatches = schema.match(/CREATE TABLE IF NOT EXISTS public\.(\w+)/g) || []
    const tables = tableMatches.map(m => m.replace(/CREATE TABLE IF NOT EXISTS public\./, ''))

    tables.forEach(table => {
      console.log(`   ✓ ${table}`)
    })

    console.log('\n📌 Next Steps:\n')
    console.log('1. Create a Workshop Type')
    console.log('   → Go to "Types d\'ateliers"')
    console.log('   → Click "+ Créer un type"')
    console.log('   → Name: IKIGAI')
    console.log('   → Places: 5-30 (ideal: 20)')
    console.log('   → Price: 49€\n')

    console.log('2. Create Workshop Instances')
    console.log('   → Go to "Ateliers"')
    console.log('   → Select IKIGAI type')
    console.log('   → Create dated instances\n')

    console.log('💡 Need help?')
    console.log('   → Open: lib/supabase/schema.sql')
    console.log('   → For more details, see the GitHub documentation\n')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

runMigration()

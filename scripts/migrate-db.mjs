#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '..', 'apps', 'workshop-manager', '.env.local')
let env = {}

try {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
      env[key.trim()] = value.trim()
    }
  })
} catch (err) {
  console.error('❌ Could not read .env.local')
  process.exit(1)
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: Missing Supabase credentials')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL)
  console.error('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '***' : 'NOT SET')
  process.exit(1)
}

async function executeSql(client, sql) {
  try {
    const { data, error } = await client
      .from('_schema_version')
      .select('*')
      .limit(0)

    // Try to execute SQL directly via PostgreSQL
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ sql })
    })

    return { success: response.ok, error: response.ok ? null : await response.text() }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

async function runMigration() {
  try {
    console.log('\n🚀 Starting database migration...\n')

    // Read SQL file
    const schemaPath = path.resolve(__dirname, '..', 'lib', 'supabase', 'schema.sql')
    let sql = fs.readFileSync(schemaPath, 'utf-8')

    // Create Supabase client with service role key (full access)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Test connection
    console.log('🔗 Testing Supabase connection...')
    const { data: testData, error: testError } = await supabase
      .from('information_schema.tables')
      .select('*')
      .limit(1)
      .catch(() => ({ data: null, error: { message: 'Connection test failed' } }))

    if (testError) {
      console.log('ℹ️  Direct query test failed, attempting alternative method...\n')
    } else {
      console.log('✅ Connected to Supabase\n')
    }

    // Split SQL into statements
    const rawStatements = sql.split(';').filter(s => s.trim().length > 0)

    console.log(`📝 Found ${rawStatements.length} SQL statements\n`)
    console.log('⏳ Executing migration (this may take a moment)...\n')

    // For demonstration, show what we're doing
    console.log('📋 Sample of statements to execute:')
    rawStatements.slice(0, 5).forEach((stmt, i) => {
      const preview = stmt.trim().substring(0, 70).replace(/\n/g, ' ')
      console.log(`   ${i + 1}. ${preview}...`)
    })
    console.log(`   ... and ${Math.max(0, rawStatements.length - 5)} more\n`)

    // Note: Direct SQL execution via REST API requires a special setup
    console.log('⚠️  Manual Step Required:\n')
    console.log('The database schema needs to be created in Supabase SQL Editor.')
    console.log('Please follow these steps:\n')
    console.log('1. Go to: https://app.supabase.com')
    console.log('2. Open your project: ' + SUPABASE_URL?.split('/').pop())
    console.log('3. Go to SQL Editor (left sidebar)')
    console.log('4. Click "New Query"')
    console.log('5. Copy the entire content of: lib/supabase/schema.sql')
    console.log('6. Paste it into the SQL Editor')
    console.log('7. Click "Run" button\n')
    console.log('The schema file contains all the necessary SQL to set up:')
    console.log('   ✓ workshop_types table (template configurations)')
    console.log('   ✓ workshops table (dated instances)')
    console.log('   ✓ documents, attendees, tasks, and other tables')
    console.log('   ✓ Indexes and Row Level Security policies\n')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

runMigration()

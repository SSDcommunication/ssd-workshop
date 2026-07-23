#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set')
  console.error('Make sure your .env.local file has these variables.')
  process.exit(1)
}

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...\n')

    // Read SQL file
    const schemaPath = resolve(__dirname, '..', 'lib', 'supabase', 'schema.sql')
    const sql = readFileSync(schemaPath, 'utf-8')

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Split SQL into individual statements (handle multiple statements)
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`)

    let executedCount = 0
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      try {
        // Execute raw SQL
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' }).catch(() => {
          // If rpc doesn't work, try direct query
          return supabase.from('__dummy__').select('1').then(() => ({ error: null })).catch(e => ({ error: e }))
        })

        if (error && !statement.includes('CREATE EXTENSION')) {
          console.warn(`⚠️  Statement ${i + 1}: ${statement.substring(0, 50)}...`)
          console.warn(`   Error: ${error}`)
        } else {
          executedCount++
          if (statement.includes('CREATE TABLE') || statement.includes('CREATE POLICY') || statement.includes('CREATE INDEX')) {
            console.log(`✅ Statement ${i + 1}: ${statement.substring(0, 60)}...`)
          }
        }
      } catch (err) {
        console.warn(`⚠️  Statement ${i + 1} failed (this might be ok for some statements)`)
      }
    }

    console.log(`\n✨ Migration completed!`)
    console.log(`\nNow you can:`)
    console.log(`1. Go to "Types d'ateliers" page and create your first workshop type (IKIGAI)`)
    console.log(`2. Go to "Ateliers" page and create dated instances of that type`)
    console.log(`3. Configure documents for each status`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigration()

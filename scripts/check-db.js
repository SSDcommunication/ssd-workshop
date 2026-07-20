#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const https = require('https')
const { URL } = require('url')

// Read .env.local
const envPath = path.join(__dirname, '../apps/workshop-manager/.env.local')
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

// Parse URL
const url = new URL(SUPABASE_URL)
const projectId = url.hostname.split('.')[0]

console.log('\n🔍 Checking database connection...\n')
console.log(`📊 Project: ${projectId}`)
console.log(`🔗 URL: ${SUPABASE_URL}\n`)

// Make a test request to verify credentials
const testUrl = new URL(`${SUPABASE_URL}/rest/v1/information_schema.tables?select=table_name&limit=5`)

const options = {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${SERVICE_KEY}`,
    'apikey': env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'Accept': 'application/json'
  }
}

https.request(testUrl, options, (res) => {
  let data = ''
  res.on('data', chunk => data += chunk)
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Database connection successful!\n')
      try {
        const tables = JSON.parse(data)
        console.log('📋 Existing tables:')
        tables.forEach(t => {
          console.log(`   • ${t.table_name}`)
        })
      } catch (e) {
        console.log('Response:', data.substring(0, 200))
      }
    } else {
      console.log(`⚠️  Status: ${res.statusCode}`)
      console.log('Response:', data.substring(0, 300))
    }

    console.log('\n💡 To run the migration:\n')
    console.log('Open: https://app.supabase.com/project/' + projectId)
    console.log('→ SQL Editor → New Query')
    console.log('→ Copy content from: lib/supabase/schema.sql')
    console.log('→ Paste and click Run\n')
  })
}).on('error', err => {
  console.error('❌ Connection error:', err.message)
})

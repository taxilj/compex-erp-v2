import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nlqpretaqtvblaheywtc.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scXByZXRhcXR2YmxhaGV5d3RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDk3MjA0MywiZXhwIjoyMDk2NTQ4MDQzfQ.KzIrLnAQ0oT_cmRLsikTNQKYQWlguIjpPS6kProkJMQ'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function main() {
  const sqlPath = 'D:\\compex erp\\compex-erp\\sql\\selling_production_tables.sql'
  const raw = fs.readFileSync(sqlPath, 'utf8')

  const statements = raw
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`Found ${statements.length} statements to execute.\n`)

  let success = 0
  let failed = 0

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i]
    console.log(`[${i + 1}/${statements.length}] Executing...`)

    const { data, error } = await supabase.rpc('exec_sql', { sql: stmt })
    if (error) {
      console.error(`  FAILED: ${error.message}`)
      console.error(`  SQL: ${stmt.substring(0, 120)}...`)
      failed++
    } else {
      console.log(`  OK`)
      success++
    }
  }

  console.log(`\nDone. ${success} succeeded, ${failed} failed.`)
}

main()

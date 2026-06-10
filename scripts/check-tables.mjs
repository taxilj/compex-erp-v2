import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://nlqpretaqtvblaheywtc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scXByZXRhcXR2YmxhaGV5d3RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDk3MjA0MywiZXhwIjoyMDk2NTQ4MDQzfQ.KzIrLnAQ0oT_cmRLsikTNQKYQWlguIjpPS6kProkJMQ'
)

async function main() {
  // Query information_schema.tables via raw SQL
  const { data, error } = await supabase.rpc('exec_sql', { sql: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'" })
  if (error) {
    console.log('RPC not available, trying REST...')
    // Try each table with limit 1
    const tables = ['companies','warehouses','items','suppliers','customers','sales_invoices','purchase_orders','stock_bin','gl_entries','inventory_transactions','po_items','invoice_items']
    for (const t of tables) {
      const { data, error: e } = await supabase.from(t).select('*', { count: 'exact', head: true })
      if (e) {
        if (e.code === 'PGRST205') console.log(`  ${t}: NOT FOUND`)
        else console.log(`  ${t}: ${e.message}`)
      } else {
        console.log(`  ${t}: EXISTS (count: ${data?.length ?? '?'})`)
      }
    }
  } else {
    console.log('Tables:', data)
  }
}
main()

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://nlqpretaqtvblaheywtc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scXByZXRhcXR2YmxhaGV5d3RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDk3MjA0MywiZXhwIjoyMDk2NTQ4MDQzfQ.KzIrLnAQ0oT_cmRLsikTNQKYQWlguIjpPS6kProkJMQ'
)

async function main() {
  const tables = [
    'companies','warehouses','items','suppliers','customers',
    'sales_invoices','invoice_items','purchase_orders','po_items',
    'stock_bin','gl_entries','inventory_transactions',
    'bom_headers','bom_items','material_requests','mr_items',
    'grn','grn_items',
    'quotations','quotation_items','sales_orders','so_items',
    'delivery_notes','dn_items','production_orders'
  ]
  for (const t of tables) {
    const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true })
    if (error) {
      if (error.code === 'PGRST205') console.log(`  ${t}: NOT FOUND`)
      else console.log(`  ${t}: ${error.message} (${error.code})`)
    } else {
      console.log(`  ${t}: EXISTS (${count} rows)`)
    }
  }
}
main()

import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  'https://nlqpretaqtvblaheywtc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scXByZXRhcXR2YmxhaGV5d3RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDk3MjA0MywiZXhwIjoyMDk2NTQ4MDQzfQ.KzIrLnAQ0oT_cmRLsikTNQKYQWlguIjpPS6kProkJMQ'
)
async function main() {
  // Try querying information_schema via public tables
  for (const tbl of ['accounts', 'account_groups', 'journal_entries', 'journal_items', 'payment_entries', 'payment_items', 'delivery_notes', 'delivery_note_items', 'production_orders', 'production_order_items', 'purchase_invoices', 'purchase_invoice_items', 'payment_terms', 'price_lists', 'item_prices', 'serial_numbers', 'batch_numbers', 'shipments', 'shipping_addresses', 'contacts', 'addresses', 'work_orders', 'purchase_receipts', 'budgets', 'assets', 'asset_categories', 'expense_entries', 'income_entries', 'taxes', 'company_settings', 'currencies', 'fiscal_years', 'cost_centers', 'employee', 'salary', 'attendance']) {
    const { data, error } = await supabase.from(tbl).select('*', { count: 'exact', head: true })
    if (!error) {
      console.log(`${tbl}: EXISTS (${data ? data.length : '?'})`)
    } else if (!error?.message?.includes('relation') && !error?.message?.includes('does not exist') && !error?.message?.includes('not found')) {
      console.log(`${tbl}: ERROR ${error.message}`)
    }
  }
}
main()

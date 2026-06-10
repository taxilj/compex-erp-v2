import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://nlqpretaqtvblaheywtc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scXByZXRhcXR2YmxhaGV5d3RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDk3MjA0MywiZXhwIjoyMDk2NTQ4MDQzfQ.KzIrLnAQ0oT_cmRLsikTNQKYQWlguIjpPS6kProkJMQ'
)

async function main() {
  // Get a row from companies to see its structure
  const { data, error } = await supabase.from('companies').select('*').limit(1)
  if (error) {
    console.error('companies error:', error)
  } else {
    console.log('companies columns:', Object.keys(data[0] || {}).join(', '))
    console.log('companies data:', data)
  }

  // Check warehouses
  const { data: w, error: we } = await supabase.from('warehouses').select('*').limit(1)
  if (we) console.error('warehouses error:', we)
  else console.log('warehouses columns:', Object.keys(w[0] || {}).join(', '))

  // Check items
  const { data: ii, error: ie } = await supabase.from('items').select('*').limit(1)
  if (ie) console.error('items error:', ie)
  else console.log('items columns:', Object.keys(ii[0] || {}).join(', '))

  // Check suppliers
  const { data: ss, error: se } = await supabase.from('suppliers').select('*').limit(1)
  if (se) console.error('suppliers error:', se)
  else console.log('suppliers columns:', Object.keys(ss[0] || {}).join(', '))

  // Check customers
  const { data: cc, error: cce } = await supabase.from('customers').select('*').limit(1)
  if (cce) console.error('customers error:', cce)
  else console.log('customers columns:', Object.keys(cc[0] || {}).join(', '))

  // Check sales_invoices
  const { data: si, error: sie } = await supabase.from('sales_invoices').select('*').limit(1)
  if (sie) console.error('sales_invoices error:', sie)
  else console.log('sales_invoices columns:', Object.keys(si[0] || {}).join(', '))
}
main()

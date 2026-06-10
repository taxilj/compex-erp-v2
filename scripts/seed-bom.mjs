import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://nlqpretaqtvblaheywtc.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scXByZXRhcXR2YmxhaGV5d3RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDk3MjA0MywiZXhwIjoyMDk2NTQ4MDQzfQ.KzIrLnAQ0oT_cmRLsikTNQKYQWlguIjpPS6kProkJMQ'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function seedBom() {
  const COMPANY_ID = 1

  // 1. Insert electronic items
  const eItems = [
    { name: 'Resistor 10K', sku: 'RES-10K', unit: 'pcs', hsn_code: '8533', tax_rate: 18, company_id: COMPANY_ID },
    { name: 'Capacitor 100uF', sku: 'CAP-100', unit: 'pcs', hsn_code: '8532', tax_rate: 18, company_id: COMPANY_ID },
    { name: 'PCB Board 2-Layer', sku: 'PCB-2L', unit: 'pcs', hsn_code: '8534', tax_rate: 18, company_id: COMPANY_ID },
    { name: 'Assembled Controller Board', sku: 'ACB-001', unit: 'pcs', hsn_code: '8537', tax_rate: 18, company_id: COMPANY_ID },
  ]

  const itemIds = {}
  for (const item of eItems) {
    const { data, error } = await supabase.from('items').insert(item).select().single()
    if (error) { console.error('Insert item failed:', item.name, error); return }
    itemIds[item.name] = data.id
    console.log(`Inserted: ${item.name} (id=${data.id})`)
  }

  // 2. Create BOM header for Assembled Controller Board
  const { data: header, error: hErr } = await supabase
    .from('bom_headers')
    .insert({
      finished_item_id: itemIds['Assembled Controller Board'],
      quantity: 1,
      notes: 'BOM for Assembled Controller Board - standard configuration',
      company_id: COMPANY_ID,
    })
    .select()
    .single()

  if (hErr) { console.error('Insert bom_header failed:', hErr); return }
  console.log(`BOM header created (id=${header.id})`)

  // 3. Insert BOM items (components)
  const components = [
    { name: 'Resistor 10K', qty: 10, unit: 'pcs', scrap: 2 },
    { name: 'Capacitor 100uF', qty: 5, unit: 'pcs', scrap: 0 },
    { name: 'PCB Board 2-Layer', qty: 1, unit: 'pcs', scrap: 0 },
  ]

  for (const comp of components) {
    const { error: cErr } = await supabase.from('bom_items').insert({
      bom_header_id: header.id,
      component_item_id: itemIds[comp.name],
      component_qty: comp.qty,
      component_unit: comp.unit,
      scrap_rate: comp.scrap,
    })
    if (cErr) { console.error('Insert bom_item failed:', comp.name, cErr); return }
    console.log(`  Added component: ${comp.name} x${comp.qty} ${comp.unit}`)
  }

  console.log('\nBOM SEED COMPLETE!')
}

seedBom()

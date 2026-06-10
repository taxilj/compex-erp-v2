import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://nlqpretaqtvblaheywtc.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scXByZXRhcXR2YmxhaGV5d3RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDk3MjA0MywiZXhwIjoyMDk2NTQ4MDQzfQ.KzIrLnAQ0oT_cmRLsikTNQKYQWlguIjpPS6kProkJMQ'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function seed() {
  // 1. Company
  const { data: company, error: e1 } = await supabase
    .from('companies').insert({ name: 'Compex Solution', address: 'Rajkot, Gujarat', gstin: '24AAACС1234F1Z5', phone: '9876543210', email: 'info@compex.in' }).select().single()
  if (e1) { console.error('company:', e1); return }
  console.log('company:', company.id)

  // 2. Warehouses
  const whs = ['Warehouse A', 'Warehouse B', 'Warehouse C', 'Warehouse D']
  for (const name of whs) {
    const { error } = await supabase.from('warehouses').insert({ name, location: 'Rajkot', company_id: company.id })
    if (error) { console.error('warehouse:', error); return }
  }
  console.log('warehouses done')

  // 3. Items
  const itemsData = [
    { name: 'Steel Pipe 2 inch', sku: 'SP-001', unit: 'pcs', hsn_code: '7306', tax_rate: 18, company_id: company.id },
    { name: 'Brass Valve DN20', sku: 'BV-001', unit: 'pcs', hsn_code: '8481', tax_rate: 18, company_id: company.id },
    { name: 'PVC Pipe 4 inch', sku: 'PVC-001', unit: 'mtr', hsn_code: '3917', tax_rate: 12, company_id: company.id },
    { name: 'Copper Wire 1.5mm', sku: 'CW-001', unit: 'mtr', hsn_code: '7408', tax_rate: 18, company_id: company.id },
  ]
  for (const it of itemsData) {
    const { error } = await supabase.from('items').insert(it)
    if (error) { console.error('item:', error); return }
  }
  console.log('items done')

  // 4. Suppliers
  const suppliersData = [
    { name: 'Rajkot Hardware Co.', address: 'Rajkot', gstin: '24AAAA1234A1Z5', phone: '9876543001', company_id: company.id },
    { name: 'Gujarat Steel Traders', address: 'Ahmedabad', gstin: '24BBBB5678B1Z5', phone: '9876543002', company_id: company.id },
  ]
  for (const s of suppliersData) {
    const { error } = await supabase.from('suppliers').insert(s)
    if (error) { console.error('supplier:', error); return }
  }
  console.log('suppliers done')

  // 5. Customers
  const customersData = [
    { name: 'Rajkot Automation Pvt Ltd', address: 'Rajkot, Gujarat', gstin: '24CCCC9012C1Z5', phone: '9876542001', company_id: company.id },
    { name: 'Surat Engineering Works', address: 'Surat, Gujarat', gstin: '24DDDD3456D1Z5', phone: '9876542002', company_id: company.id },
  ]
  for (const c of customersData) {
    const { error } = await supabase.from('customers').insert(c)
    if (error) { console.error('customer:', error); return }
  }
  console.log('customers done')

  // 6. Stock Bin (initial stock)
  const items = await supabase.from('items').select('*')
  const whList = await supabase.from('warehouses').select('*')
  if (items.data && whList.data) {
    const stockEntries = []
    for (const item of items.data) {
      for (const wh of whList.data) {
        stockEntries.push({ item_id: item.id, warehouse_id: wh.id, quantity: Math.floor(Math.random() * 200) + 50 })
      }
    }
    const { error: se } = await supabase.from('stock_bin').insert(stockEntries)
    if (se) { console.error('stock_bin:', se); return }
  }
  console.log('stock_bin done')

  // 7. Sales Invoice
  const customers = await supabase.from('customers').select('*')
  const customer = customers.data?.[0]
  if (customer) {
    const invData = {
      invoice_no: 'INV-001',
      customer_id: customer.id,
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30*86400000).toISOString().split('T')[0],
      subtotal: 42372.88,
      tax_total: 7627.12,
      discount: 0,
      grand_total: 50000,
      status: 'unpaid',
      notes: 'Initial seed invoice',
      company_id: company.id,
    }
    const { data: invoice, error: ie } = await supabase.from('sales_invoices').insert(invData).select().single()
    if (ie) { console.error('invoice:', ie); return }
    console.log('invoice:', invoice.id)

    // Invoice items
    const allItems = await supabase.from('items').select('*')
    if (allItems.data) {
      const invoiceItems = allItems.data.map(it => ({
        invoice_id: invoice.id,
        item_id: it.id,
        quantity: 10,
        unit_price: 1000,
        tax_rate: Number(it.tax_rate),
        tax_amount: 1000 * 10 * Number(it.tax_rate) / 100,
        total_price: 1000 * 10 * (1 + Number(it.tax_rate) / 100),
      }))
      const { error: iie } = await supabase.from('invoice_items').insert(invoiceItems)
      if (iie) { console.error('invoice_items:', iie); return }
    }
    console.log('invoice_items done')
  }

  // 8. Purchase Order
  const suppliers = await supabase.from('suppliers').select('*')
  const supplier = suppliers.data?.[0]
  if (supplier) {
    const poData = {
      po_no: 'PO-001',
      supplier_id: supplier.id,
      order_date: new Date().toISOString().split('T')[0],
      expected_date: new Date(Date.now() + 15*86400000).toISOString().split('T')[0],
      subtotal: 30000,
      tax_total: 5400,
      grand_total: 35400,
      status: 'pending',
      notes: 'Initial seed PO',
      company_id: company.id,
    }
    const { data: po, error: pe } = await supabase.from('purchase_orders').insert(poData).select().single()
    if (pe) { console.error('purchase_order:', pe); return }
    console.log('purchase_order:', po.id)

    // PO items
    const allItems = await supabase.from('items').select('*')
    if (allItems.data) {
      const poItems = allItems.data.map(it => ({
        po_id: po.id,
        item_id: it.id,
        quantity: 5,
        unit_price: 1500,
        tax_rate: Number(it.tax_rate),
        tax_amount: 1500 * 5 * Number(it.tax_rate) / 100,
        total_price: 1500 * 5 * (1 + Number(it.tax_rate) / 100),
      }))
      const { error: pie } = await supabase.from('po_items').insert(poItems)
      if (pie) { console.error('po_items:', pie); return }
    }
    console.log('po_items done')
  }

  // 9. GL Entries
  const glData = [
    { reference_type: 'sales_invoice', account_code: '4000', account_name: 'Sales Revenue', credit: 50000, entry_date: new Date().toISOString().split('T')[0], description: 'Invoice INV-001', company_id: company.id },
    { reference_type: 'sales_invoice', account_code: '1000', account_name: 'Accounts Receivable', debit: 50000, entry_date: new Date().toISOString().split('T')[0], description: 'Invoice INV-001', company_id: company.id },
  ]
  const { error: gle } = await supabase.from('gl_entries').insert(glData)
  if (gle) { console.error('gl_entries:', gle); return }
  console.log('gl_entries done')

  console.log('\nSEED COMPLETE!')
}

seed()

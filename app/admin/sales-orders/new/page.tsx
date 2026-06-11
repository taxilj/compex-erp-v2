import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { NewSalesOrderForm } from './form'

export default async function NewSalesOrderPage() {
  const supabase = createAdminClient()
  const { data: customers } = await supabase.from('customers').select('id, name').order('name')
  const { data: items } = await supabase.from('items').select('id, name, sku').order('name')
  const { data: quotations } = await supabase.from('quotations').select('id, quote_number, customers(name)').order('quote_number')
  const formattedQuotations = (quotations || []).map(q => ({ id: q.id, quote_number: q.quote_number, customers: (q.customers as { name: string }[] | null)?.[0] ?? null }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/sales-orders" className="text-sm text-slate-400 hover:text-white">&larr; Back</Link>
        <h1 className="text-xl font-semibold text-white">New Sales Order</h1>
      </div>
      <NewSalesOrderForm customers={customers || []} items={items || []} quotations={formattedQuotations} />
    </div>
  )
}

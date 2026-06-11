import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { NewDeliveryNoteForm } from './form'

export default async function NewDeliveryNotePage() {
  const supabase = createAdminClient()
  const { data: customers } = await supabase.from('customers').select('id, name').order('name')
  const { data: items } = await supabase.from('items').select('id, name, sku').order('name')
  const { data: rawOrders } = await supabase.from('sales_orders').select('id, so_number, customers(name)').order('so_number')

  const salesOrders = (rawOrders || []).map((so: any) => ({
    id: so.id,
    so_number: so.so_number,
    customers: so.customers?.[0] || null,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/delivery-notes" className="text-sm text-slate-400 hover:text-white">&larr; Back</Link>
        <h1 className="text-xl font-semibold text-white">New Delivery Note</h1>
      </div>
      <NewDeliveryNoteForm customers={customers || []} items={items || []} salesOrders={salesOrders} />
    </div>
  )
}

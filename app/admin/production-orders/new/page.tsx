import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { NewProductionOrderForm } from './form'

export default async function NewProductionOrderPage() {
  const supabase = createAdminClient()
  const { data: items } = await supabase.from('items').select('id, name, sku').order('name')
  const { data: rawBoms } = await supabase.from('bom_headers').select('id, bom_name, items(name)').order('bom_name')

  const boms = (rawBoms || []).map((b: any) => ({
    id: b.id,
    bom_name: b.bom_name,
    items: b.items?.[0] || null,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/production-orders" className="text-sm text-slate-400 hover:text-white">&larr; Back</Link>
        <h1 className="text-xl font-semibold text-white">New Production Order</h1>
      </div>
      <NewProductionOrderForm items={items || []} boms={boms} />
    </div>
  )
}

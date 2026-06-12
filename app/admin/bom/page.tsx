import { createAdminClient } from '@/lib/supabase/admin'
import PageHeader from '@/components/ui/page-header'
import Link from 'next/link'
import BomTable from './bom-table'

export default async function BOMPage() {
  const supabase = createAdminClient()

  const { data: bomHeaders } = await supabase
    .from('bom_headers')
    .select('*, finished_item:items(name, sku), bom_items(count)')
    .order('created_at', { ascending: false })

  const { count: totalBoms } = await supabase
    .from('bom_headers')
    .select('*', { count: 'exact', head: true })

  const { count: totalComponents } = await supabase
    .from('bom_items')
    .select('*', { count: 'exact', head: true })

  const rows = (bomHeaders ?? []).map((b) => ({
    id: b.id,
    finished_item_name: b.finished_item?.name ?? 'Unknown',
    finished_item_sku: b.finished_item?.sku ?? '—',
    quantity: b.quantity,
    notes: b.notes,
    component_count: b.bom_items?.[0]?.count ?? 0,
    created_at: b.created_at,
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bill of Materials"
        subtitle="Manage production BOMs"
        action={
          <Link href="/admin/bom/new" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm">
            + New BOM
          </Link>
        }
      />

      <div className="flex gap-6 text-sm text-slate-400">
        <span>Total BOMs: <span className="text-white font-medium">{totalBoms ?? 0}</span></span>
        <span>Component Lines: <span className="text-white font-medium">{totalComponents ?? 0}</span></span>
      </div>

      <BomTable data={rows as unknown as Record<string, unknown>[]} />
    </div>
  )
}

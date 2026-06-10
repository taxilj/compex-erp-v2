import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function BomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: raw } = await supabase
    .from('bom_headers')
    .select('id, quantity, notes, created_at, finished_item:items!finished_item_id(name, sku, unit)')
    .eq('id', id)
    .single()

  if (!raw) notFound()

  const header = raw as unknown as {
    id: number
    quantity: number
    notes: string | null
    created_at: string
    finished_item: { name: string; sku: string; unit: string } | null
  }

  const { data: rawComponents } = await supabase
    .from('bom_items')
    .select('id, component_qty, component_unit, scrap_rate, component:items!component_item_id(name, sku, unit)')
    .eq('bom_header_id', id)
    .order('id')

  const components = (rawComponents || []) as unknown as {
    id: number
    component_qty: number
    component_unit: string | null
    scrap_rate: number | null
    component: { name: string; sku: string; unit: string } | null
  }[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/bom" className="text-slate-400 hover:text-white text-sm">&larr; Back</Link>
          <h1 className="text-xl font-semibold text-white">BOM Detail</h1>
        </div>
        <ExportButton id={id} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Finished Item</p>
          <p className="text-white font-medium text-lg">{header.finished_item?.name}</p>
          <p className="text-slate-400 text-sm mt-0.5">SKU: {header.finished_item?.sku}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Assembly Qty</p>
          <p className="text-white font-medium text-lg">{header.quantity}</p>
          <p className="text-slate-400 text-sm mt-0.5">{header.finished_item?.unit || 'pcs'}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Components</p>
          <p className="text-white font-medium text-lg">{components?.length || 0}</p>
          <p className="text-slate-400 text-sm mt-0.5">unique line items</p>
        </div>
      </div>

      {header.notes && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-5 py-3">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Notes</p>
          <p className="text-slate-300 text-sm">{header.notes}</p>
        </div>
      )}

      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">#</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Component</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">SKU</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Qty</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Unit</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Scrap %</th>
              </tr>
            </thead>
            <tbody>
              {!components || components.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">No components defined</td>
                </tr>
              ) : (
                components.map((c, i) => (
                  <tr key={c.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30">
                    <td className="py-3 px-4 text-slate-400">{i + 1}</td>
                    <td className="py-3 px-4 text-white font-medium">{c.component?.name}</td>
                    <td className="py-3 px-4 text-slate-300">{c.component?.sku || '-'}</td>
                    <td className="py-3 px-4 text-right text-white">{c.component_qty}</td>
                    <td className="py-3 px-4 text-slate-300">{c.component_unit || c.component?.unit || 'pcs'}</td>
                    <td className="py-3 px-4 text-right text-slate-300">{c.scrap_rate || 0}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Created: {new Date(header.created_at).toLocaleString('en-IN')}
      </p>
    </div>
  )
}

async function ExportButton({ id }: { id: string }) {
  const supabase = createAdminClient()

  const { data: raw } = await supabase
    .from('bom_headers')
    .select('finished_item:items!finished_item_id(name, sku)')
    .eq('id', id)
    .single()

  const exportHeader = raw as unknown as {
    finished_item: { name: string; sku: string } | null
  } | null

  const { data: rawComponents } = await supabase
    .from('bom_items')
    .select('component_qty, component_unit, scrap_rate, component:items!component_item_id(name, sku, unit)')
    .eq('bom_header_id', id)
    .order('id')

  const exportComponents = (rawComponents || []) as unknown as {
    component_qty: number
    component_unit: string | null
    scrap_rate: number | null
    component: { name: string; sku: string; unit: string } | null
  }[]

  const itemName = exportHeader?.finished_item?.name || 'BOM'
  const csvHeader = 'Component,SKU,Qty,Unit,Scrap %'
  const csvBody = exportComponents.map(r => `"${r.component?.name || ''}","${r.component?.sku || ''}",${r.component_qty},"${r.component_unit || r.component?.unit || 'pcs'}",${r.scrap_rate || 0}`).join('\n')
  const csv = `${csvHeader}\n${csvBody}\n`

  const encoded = encodeURIComponent(csv)
  const blobUri = `data:text/csv;charset=utf-8,${encoded}`

  return (
    <a
      href={blobUri}
      download={`bom-${itemName.replace(/\s+/g, '-').toLowerCase()}.csv`}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
    >
      Export CSV
    </a>
  )
}

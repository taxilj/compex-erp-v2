import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

export default async function BomListPage() {
  const supabase = createAdminClient()

  const { data: raw } = await supabase
    .from('bom_headers')
    .select('id, quantity, notes, finished_item_id, created_at, finished_item:items!finished_item_id(name, sku)')
    .order('created_at', { ascending: false })

  const boms = (raw || []) as unknown as {
    id: number
    quantity: number
    notes: string | null
    finished_item_id: number
    created_at: string
    finished_item: { name: string; sku: string } | null
  }[]

  const { count: totalComponents } = await supabase
    .from('bom_items')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Bill of Materials</h1>
        <Link href="/admin/bom/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">+ New BOM</Link>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Finished Item</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">SKU</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Qty</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Notes</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Created</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {boms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">No BOMs found</td>
                </tr>
              ) : (
                boms.map((bom) => (
                  <tr key={bom.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30">
                    <td className="py-3 px-4 text-white font-medium">{bom.finished_item?.name || 'Unknown'}</td>
                    <td className="py-3 px-4 text-slate-300">{bom.finished_item?.sku || '-'}</td>
                    <td className="py-3 px-4 text-right text-white">{bom.quantity}</td>
                    <td className="py-3 px-4 text-slate-400 max-w-[200px] truncate">{bom.notes || '-'}</td>
                    <td className="py-3 px-4 text-slate-300">
                      {new Date(bom.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/bom/${bom.id}`}
                        className="text-blue-400 hover:text-blue-300 text-xs font-medium"
                      >
                        View Details &rarr;
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <span className="text-slate-400">
          Total BOMs: <span className="text-white font-medium">{boms.length}</span>
        </span>
        <span className="text-slate-400">
          Component lines: <span className="text-white font-medium">{totalComponents || 0}</span>
        </span>
      </div>
    </div>
  )
}

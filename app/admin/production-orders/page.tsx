import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function ProductionOrdersPage() {
  const supabase = createAdminClient()

  const { data: orders } = await supabase
    .from('production_orders')
    .select('*, items(name), bom_headers(bom_name)')
    .order('created_at', { ascending: false })

  const statusStyles: Record<string, string> = {
    Planned: 'bg-slate-100 text-slate-800',
    InProgress: 'bg-yellow-100 text-yellow-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Production Orders</h1>
        <Link
          href="/admin/production-orders/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          + New Production Order
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-3">PO#</th>
              <th className="px-6 py-3">Item</th>
              <th className="px-6 py-3">BOM</th>
              <th className="px-6 py-3 text-right">Planned Qty</th>
              <th className="px-6 py-3 text-right">Produced</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {orders?.map((o) => (
              <tr key={o.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/production-orders/${o.id}`}
                    className="font-medium text-blue-400 hover:text-blue-300"
                  >
                    {o.po_number}
                  </Link>
                </td>
                <td className="px-6 py-4">{o.items?.name}</td>
                <td className="px-6 py-4 text-slate-400">{o.bom_headers?.bom_name}</td>
                <td className="px-6 py-4 text-right">{o.planned_qty}</td>
                <td className="px-6 py-4 text-right">{o.produced_qty}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyles[o.status] || 'bg-slate-100 text-slate-800'}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No production orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

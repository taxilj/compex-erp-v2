import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function GRNDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: grn } = await supabase
    .from('grn')
    .select('*, suppliers(name), purchase_orders(po_number), grn_items(*, items(name))')
    .eq('id', id)
    .single()

  if (!grn) notFound()

  const statusStyles: Record<string, string> = {
    Draft: 'bg-slate-100 text-slate-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  }

  const totalAccepted = grn.grn_items?.reduce((sum: number, i: any) => sum + Number(i.accepted_qty || 0), 0) ?? 0
  const totalRejected = grn.grn_items?.reduce((sum: number, i: any) => sum + Number(i.rejected_qty || 0), 0) ?? 0

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <Link href="/admin/grn" className="mb-4 inline-block text-sm text-blue-400 hover:text-blue-300">
        &larr; Back to GRN
      </Link>

      <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{grn.grn_number}</h1>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[grn.status] || 'bg-slate-100 text-slate-800'}`}>
            {grn.status}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Supplier</span>
            <p className="font-medium text-white">{grn.suppliers?.name}</p>
          </div>
          <div>
            <span className="text-slate-400">PO Reference</span>
            <p className="font-medium text-white">{grn.purchase_orders?.po_number || '-'}</p>
          </div>
          <div>
            <span className="text-slate-400">Received Date</span>
            <p className="font-medium text-white">{grn.received_date ? new Date(grn.received_date).toLocaleDateString('en-IN') : '-'}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-3">Item</th>
              <th className="px-6 py-3 text-right">Ordered</th>
              <th className="px-6 py-3 text-right">Received</th>
              <th className="px-6 py-3 text-right">Accepted</th>
              <th className="px-6 py-3 text-right">Rejected</th>
              <th className="px-6 py-3">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {grn.grn_items?.map((item: any) => (
              <tr key={item.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4">{item.items?.name}</td>
                <td className="px-6 py-4 text-right">{item.ordered_qty}</td>
                <td className="px-6 py-4 text-right">{item.received_qty}</td>
                <td className="px-6 py-4 text-right text-green-400">{item.accepted_qty}</td>
                <td className="px-6 py-4 text-right text-red-400">{item.rejected_qty}</td>
                <td className="px-6 py-4 text-slate-400">{item.remarks || '-'}</td>
              </tr>
            ))}
            {(!grn.grn_items || grn.grn_items.length === 0) && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
          {grn.grn_items && grn.grn_items.length > 0 && (
            <tfoot className="bg-slate-800">
              <tr>
                <td className="px-6 py-4 font-medium text-white">Totals</td>
                <td />
                <td />
                <td className="px-6 py-4 text-right font-medium text-green-400">{totalAccepted}</td>
                <td className="px-6 py-4 text-right font-medium text-red-400">{totalRejected}</td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}

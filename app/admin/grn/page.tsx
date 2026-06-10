import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function GRNPage() {
  const supabase = createAdminClient()

  const { data: grns } = await supabase
    .from('grn')
    .select('*, suppliers(name), purchase_orders(po_number)')
    .order('created_at', { ascending: false })

  const statusStyles: Record<string, string> = {
    Draft: 'bg-slate-100 text-slate-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Goods Receipt Notes</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-3">GRN#</th>
              <th className="px-6 py-3">PO#</th>
              <th className="px-6 py-3">Supplier</th>
              <th className="px-6 py-3">Received</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {grns?.map((grn) => (
              <tr key={grn.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/grn/${grn.id}`}
                    className="font-medium text-blue-400 hover:text-blue-300"
                  >
                    {grn.grn_number}
                  </Link>
                </td>
                <td className="px-6 py-4 text-slate-400">{grn.purchase_orders?.po_number || '-'}</td>
                <td className="px-6 py-4">{grn.suppliers?.name}</td>
                <td className="px-6 py-4">{grn.received_date ? new Date(grn.received_date).toLocaleDateString('en-IN') : '-'}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyles[grn.status] || 'bg-slate-100 text-slate-800'}`}>
                    {grn.status}
                  </span>
                </td>
              </tr>
            ))}
            {(!grns || grns.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No goods receipt notes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

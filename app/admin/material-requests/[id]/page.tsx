import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function MaterialRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: mr } = await supabase
    .from('material_requests')
    .select('*, suppliers(name), mr_items(*, items(name))')
    .eq('id', id)
    .single()

  if (!mr) notFound()

  const statusStyles: Record<string, string> = {
    Draft: 'bg-slate-100 text-slate-800',
    Pending: 'bg-amber-100 text-amber-800',
    Approved: 'bg-blue-100 text-blue-800',
    Ordered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <Link href="/admin/material-requests" className="mb-4 inline-block text-sm text-blue-400 hover:text-blue-300">
        &larr; Back to Material Requests
      </Link>

      <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{mr.mr_number}</h1>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[mr.status] || 'bg-slate-100 text-slate-800'}`}>
            {mr.status}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Supplier</span>
            <p className="font-medium text-white">{mr.suppliers?.name}</p>
          </div>
          <div>
            <span className="text-slate-400">Request Date</span>
            <p className="font-medium text-white">{mr.request_date ? new Date(mr.request_date).toLocaleDateString('en-IN') : '-'}</p>
          </div>
          <div>
            <span className="text-slate-400">Expected Date</span>
            <p className="font-medium text-white">{mr.expected_date ? new Date(mr.expected_date).toLocaleDateString('en-IN') : '-'}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-3">Item</th>
              <th className="px-6 py-3 text-right">Qty</th>
              <th className="px-6 py-3">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {mr.mr_items?.map((item: any) => (
              <tr key={item.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4">{item.items?.name}</td>
                <td className="px-6 py-4 text-right">{item.quantity}</td>
                <td className="px-6 py-4 text-slate-400">{item.remarks || '-'}</td>
              </tr>
            ))}
            {(!mr.mr_items || mr.mr_items.length === 0) && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

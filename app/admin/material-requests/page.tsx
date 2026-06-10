import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function MaterialRequestsPage() {
  const supabase = createAdminClient()

  const { data: mrs } = await supabase
    .from('material_requests')
    .select('*, suppliers(name)')
    .order('created_at', { ascending: false })

  const statusStyles: Record<string, string> = {
    Draft: 'bg-slate-100 text-slate-800',
    Pending: 'bg-amber-100 text-amber-800',
    Approved: 'bg-blue-100 text-blue-800',
    Ordered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Material Requests</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-3">MR#</th>
              <th className="px-6 py-3">Supplier</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Expected</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {mrs?.map((mr) => (
              <tr key={mr.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/material-requests/${mr.id}`}
                    className="font-medium text-blue-400 hover:text-blue-300"
                  >
                    {mr.mr_number}
                  </Link>
                </td>
                <td className="px-6 py-4">{mr.suppliers?.name}</td>
                <td className="px-6 py-4">{mr.request_date ? new Date(mr.request_date).toLocaleDateString('en-IN') : '-'}</td>
                <td className="px-6 py-4">{mr.expected_date ? new Date(mr.expected_date).toLocaleDateString('en-IN') : '-'}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyles[mr.status] || 'bg-slate-100 text-slate-800'}`}>
                    {mr.status}
                  </span>
                </td>
              </tr>
            ))}
            {(!mrs || mrs.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No material requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

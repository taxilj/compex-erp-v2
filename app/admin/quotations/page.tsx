import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function QuotationsPage() {
  const supabase = createAdminClient()

  const { data: quotations } = await supabase
    .from('quotations')
    .select('*, customers(name)')
    .order('created_at', { ascending: false })

  const statusStyles: Record<string, string> = {
    Draft: 'bg-slate-100 text-slate-800',
    Sent: 'bg-blue-100 text-blue-800',
    Accepted: 'bg-green-100 text-green-800',
    Expired: 'bg-yellow-100 text-yellow-800',
    Cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Quotations</h1>
        <Link
          href="/admin/quotations/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          + New Quotation
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-3">Quote#</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-right">Amount</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {quotations?.map((q) => (
              <tr key={q.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/quotations/${q.id}`}
                    className="font-medium text-blue-400 hover:text-blue-300"
                  >
                    {q.quote_number}
                  </Link>
                </td>
                <td className="px-6 py-4">{q.customers?.name}</td>
                <td className="px-6 py-4 text-slate-400">{q.quote_date ? new Date(q.quote_date).toLocaleDateString('en-IN') : '-'}</td>
                <td className="px-6 py-4 text-right">₹{Number(q.grand_total || 0).toLocaleString('en-IN')}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyles[q.status] || 'bg-slate-100 text-slate-800'}`}>
                    {q.status}
                  </span>
                </td>
              </tr>
            ))}
            {(!quotations || quotations.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No quotations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function InvoicesPage() {
  const supabase = await createServerSupabaseClient()

  const { data: invoices } = await supabase
    .from('sales_invoices')
    .select('*, customers(name)')
    .order('created_at', { ascending: false })

  const statusStyles: Record<string, string> = {
    Paid: 'bg-green-100 text-green-800',
    Unpaid: 'bg-amber-100 text-amber-800',
    Overdue: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Invoices</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-3">Invoice#</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Due Date</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {invoices?.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/invoices/${inv.id}`}
                    className="font-medium text-blue-400 hover:text-blue-300"
                  >
                    {inv.invoice_number}
                  </Link>
                </td>
                <td className="px-6 py-4">{inv.customers?.name}</td>
                <td className="px-6 py-4">{inv.invoice_date ? new Date(inv.invoice_date).toLocaleDateString('en-IN') : '-'}</td>
                <td className="px-6 py-4">{inv.due_date ? new Date(inv.due_date).toLocaleDateString('en-IN') : '-'}</td>
                <td className="px-6 py-4 font-medium text-white">
                  ₹{Number(inv.total_amount).toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyles[inv.status] || 'bg-slate-100 text-slate-800'}`}>
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
            {(!invoices || invoices.length === 0) && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

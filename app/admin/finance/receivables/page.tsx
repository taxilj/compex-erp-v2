import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function ReceivablesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: invoices } = await supabase
    .from('sales_invoices')
    .select('invoice_number, invoice_date, due_date, total_amount, status, customers(name)')
    .in('status', ['Unpaid', 'Overdue'])
    .order('due_date', { ascending: true })

  const totalDue = (invoices ?? []).reduce((sum, inv) => sum + Number(inv.total_amount), 0)

  function daysOverdue(dueDate: string | null) {
    if (!dueDate) return 0
    const diff = new Date().getTime() - new Date(dueDate).getTime()
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <p className="text-slate-400 text-sm">Total Receivables</p>
          <p className="text-2xl font-bold text-white mt-1">
            ₹{totalDue.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <p className="text-slate-400 text-sm">Outstanding Invoices</p>
          <p className="text-2xl font-bold text-white mt-1">{(invoices ?? []).length}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <p className="text-slate-400 text-sm">Overdue</p>
          <p className="text-2xl font-bold text-red-400 mt-1">
            {(invoices ?? []).filter(i => daysOverdue(i.due_date) > 0).length}
          </p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Customer</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Invoice#</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Amount Due</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Days Overdue</th>
              </tr>
            </thead>
            <tbody>
              {!invoices || invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">No outstanding receivables</td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.invoice_number} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30">
                    <td className="py-3 px-4 text-white">{(inv as any).customers?.name || '-'}</td>
                    <td className="py-3 px-4 text-slate-300">{inv.invoice_number}</td>
                    <td className="py-3 px-4 text-slate-300">{inv.invoice_date ? new Date(inv.invoice_date).toLocaleDateString('en-IN') : '-'}</td>
                    <td className="py-3 px-4 text-right text-white">₹{Number(inv.total_amount).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-right">
                      {daysOverdue(inv.due_date) > 0 ? (
                        <span className="text-red-400">{daysOverdue(inv.due_date)}d</span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

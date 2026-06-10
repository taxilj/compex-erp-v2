import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: invoice } = await supabase
    .from('sales_invoices')
    .select('*, customers(name), invoice_items(*, items(name))')
    .eq('id', id)
    .single()

  if (!invoice) notFound()

  const statusStyles: Record<string, string> = {
    Paid: 'bg-green-100 text-green-800',
    Unpaid: 'bg-amber-100 text-amber-800',
    Overdue: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <Link href="/admin/invoices" className="mb-4 inline-block text-sm text-blue-400 hover:text-blue-300">
        &larr; Back to Invoices
      </Link>

      <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{invoice.invoice_number}</h1>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[invoice.status] || 'bg-slate-100 text-slate-800'}`}>
            {invoice.status}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Customer</span>
            <p className="font-medium text-white">{invoice.customers?.name}</p>
          </div>
          <div>
            <span className="text-slate-400">Invoice Date</span>
            <p className="font-medium text-white">{invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString('en-IN') : '-'}</p>
          </div>
          <div>
            <span className="text-slate-400">Due Date</span>
            <p className="font-medium text-white">{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-IN') : '-'}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-3">Item</th>
              <th className="px-6 py-3 text-right">Qty</th>
              <th className="px-6 py-3 text-right">Rate</th>
              <th className="px-6 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {invoice.invoice_items?.map((item: any) => (
              <tr key={item.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4">{item.items?.name}</td>
                <td className="px-6 py-4 text-right">{item.quantity}</td>
                <td className="px-6 py-4 text-right">₹{Number(item.rate).toLocaleString('en-IN')}</td>
                <td className="px-6 py-4 text-right font-medium text-white">
                  ₹{Number(item.amount).toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
            {(!invoice.invoice_items || invoice.invoice_items.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-slate-800">
            <tr>
              <td colSpan={3} className="px-6 py-4 text-right font-medium text-white">Total</td>
              <td className="px-6 py-4 text-right font-bold text-white">
                ₹{Number(invoice.grand_total ?? 0).toLocaleString('en-IN')}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

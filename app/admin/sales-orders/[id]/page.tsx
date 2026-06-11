import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function SalesOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: order } = await supabase
    .from('sales_orders')
    .select('*, customers(name), quotations(quote_number), so_items(*, items(name))')
    .eq('id', id)
    .single()

  if (!order) notFound()

  const statusStyles: Record<string, string> = {
    Draft: 'bg-slate-100 text-slate-800',
    Confirmed: 'bg-blue-100 text-blue-800',
    InProgress: 'bg-yellow-100 text-yellow-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <Link href="/admin/sales-orders" className="mb-4 inline-block text-sm text-blue-400 hover:text-blue-300">
        &larr; Back to Sales Orders
      </Link>

      <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{order.so_number}</h1>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status] || 'bg-slate-100 text-slate-800'}`}>
            {order.status}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Customer</span>
            <p className="font-medium text-white">{order.customers?.name}</p>
          </div>
          <div>
            <span className="text-slate-400">Quote Reference</span>
            <p className="font-medium text-white">{order.quotations?.quote_number || '-'}</p>
          </div>
          <div>
            <span className="text-slate-400">Order Date</span>
            <p className="font-medium text-white">{order.order_date ? new Date(order.order_date).toLocaleDateString('en-IN') : '-'}</p>
          </div>
        </div>
        {order.notes && (
          <div className="mt-4 text-sm">
            <span className="text-slate-400">Notes</span>
            <p className="mt-1 text-white">{order.notes}</p>
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-3">Item</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3 text-right">Qty</th>
              <th className="px-6 py-3 text-right">Rate</th>
              <th className="px-6 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {order.so_items?.map((item: any) => (
              <tr key={item.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4">{item.items?.name}</td>
                <td className="px-6 py-4 text-slate-400">{item.description || '-'}</td>
                <td className="px-6 py-4 text-right">{item.quantity}</td>
                <td className="px-6 py-4 text-right">₹{Number(item.rate).toLocaleString('en-IN')}</td>
                <td className="px-6 py-4 text-right">₹{Number(item.amount).toLocaleString('en-IN')}</td>
              </tr>
            ))}
            {(!order.so_items || order.so_items.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No items found.</td>
              </tr>
            )}
          </tbody>
          {order.so_items && order.so_items.length > 0 && (
            <tfoot className="bg-slate-800">
              <tr>
                <td colSpan={4} className="px-6 py-4 text-right text-slate-400">Subtotal</td>
                <td className="px-6 py-4 text-right text-white">₹{Number(order.subtotal).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td colSpan={4} className="px-6 py-2 text-right text-slate-400">GST (18%)</td>
                <td className="px-6 py-2 text-right text-white">₹{Number(order.gst_amount).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td colSpan={4} className="px-6 py-4 text-right font-medium text-white">Grand Total</td>
                <td className="px-6 py-4 text-right font-bold text-white">₹{Number(order.grand_total).toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}

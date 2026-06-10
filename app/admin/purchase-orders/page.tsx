import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function PurchaseOrdersPage() {
  const supabase = await createServerSupabaseClient()

  const { data: purchaseOrders } = await supabase
    .from('purchase_orders')
    .select('*, suppliers(name)')
    .order('created_at', { ascending: false })

  const statusStyles: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-800',
    Approved: 'bg-blue-100 text-blue-800',
    Received: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Purchase Orders</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-3">PO#</th>
              <th className="px-6 py-3">Supplier</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Expected</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {purchaseOrders?.map((po) => (
              <tr key={po.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/purchase-orders/${po.id}`}
                    className="font-medium text-blue-400 hover:text-blue-300"
                  >
                    {po.po_number}
                  </Link>
                </td>
                <td className="px-6 py-4">{po.suppliers?.name}</td>
                <td className="px-6 py-4">{po.order_date ? new Date(po.order_date).toLocaleDateString('en-IN') : '-'}</td>
                <td className="px-6 py-4">{po.expected_date ? new Date(po.expected_date).toLocaleDateString('en-IN') : '-'}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyles[po.status] || 'bg-slate-100 text-slate-800'}`}>
                    {po.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-medium text-white">
                  ₹{Number(po.total_amount).toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
            {(!purchaseOrders || purchaseOrders.length === 0) && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No purchase orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

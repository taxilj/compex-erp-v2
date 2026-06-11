import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function DeliveryNoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: dn } = await supabase
    .from('delivery_notes')
    .select('*, customers(name), sales_orders(so_number), dn_items(*, items(name))')
    .eq('id', id)
    .single()

  if (!dn) notFound()

  const statusStyles: Record<string, string> = {
    Draft: 'bg-slate-100 text-slate-800',
    Dispatched: 'bg-blue-100 text-blue-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  }

  const totalQty = dn.dn_items?.reduce((sum: number, i: any) => sum + Number(i.quantity || 0), 0) ?? 0

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <Link href="/admin/delivery-notes" className="mb-4 inline-block text-sm text-blue-400 hover:text-blue-300">
        &larr; Back to Delivery Notes
      </Link>

      <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{dn.dn_number}</h1>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[dn.status] || 'bg-slate-100 text-slate-800'}`}>
            {dn.status}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Customer</span>
            <p className="font-medium text-white">{dn.customers?.name}</p>
          </div>
          <div>
            <span className="text-slate-400">SO Reference</span>
            <p className="font-medium text-white">{dn.sales_orders?.so_number || '-'}</p>
          </div>
          <div>
            <span className="text-slate-400">Delivery Date</span>
            <p className="font-medium text-white">{dn.delivery_date ? new Date(dn.delivery_date).toLocaleDateString('en-IN') : '-'}</p>
          </div>
        </div>
        {dn.notes && (
          <div className="mt-4 text-sm">
            <span className="text-slate-400">Notes</span>
            <p className="mt-1 text-white">{dn.notes}</p>
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-3">Item</th>
              <th className="px-6 py-3 text-right">Quantity</th>
              <th className="px-6 py-3">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {dn.dn_items?.map((item: any) => (
              <tr key={item.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4">{item.items?.name}</td>
                <td className="px-6 py-4 text-right">{item.quantity}</td>
                <td className="px-6 py-4 text-slate-400">{item.remarks || '-'}</td>
              </tr>
            ))}
            {(!dn.dn_items || dn.dn_items.length === 0) && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-slate-500">No items found.</td>
              </tr>
            )}
          </tbody>
          {dn.dn_items && dn.dn_items.length > 0 && (
            <tfoot className="bg-slate-800">
              <tr>
                <td className="px-6 py-4 font-medium text-white">Total</td>
                <td className="px-6 py-4 text-right font-medium text-white">{totalQty}</td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}

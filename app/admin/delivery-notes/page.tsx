import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function DeliveryNotesPage() {
  const supabase = createAdminClient()

  const { data: dns } = await supabase
    .from('delivery_notes')
    .select('*, customers(name), sales_orders(so_number)')
    .order('created_at', { ascending: false })

  const statusStyles: Record<string, string> = {
    Draft: 'bg-slate-100 text-slate-800',
    Dispatched: 'bg-blue-100 text-blue-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Delivery Notes</h1>
        <Link
          href="/admin/delivery-notes/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          + New Delivery Note
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-3">DN#</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">SO Ref</th>
              <th className="px-6 py-3">Delivery Date</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {dns?.map((dn) => (
              <tr key={dn.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/delivery-notes/${dn.id}`}
                    className="font-medium text-blue-400 hover:text-blue-300"
                  >
                    {dn.dn_number}
                  </Link>
                </td>
                <td className="px-6 py-4">{dn.customers?.name}</td>
                <td className="px-6 py-4 text-slate-400">{dn.sales_orders?.so_number || '-'}</td>
                <td className="px-6 py-4 text-slate-400">{dn.delivery_date ? new Date(dn.delivery_date).toLocaleDateString('en-IN') : '-'}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyles[dn.status] || 'bg-slate-100 text-slate-800'}`}>
                    {dn.status}
                  </span>
                </td>
              </tr>
            ))}
            {(!dns || dns.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No delivery notes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

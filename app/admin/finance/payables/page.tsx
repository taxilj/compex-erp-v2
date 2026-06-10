import { createAdminClient } from '@/lib/supabase/admin'

export default async function PayablesPage() {
  const supabase = createAdminClient()
  const { data: orders } = await supabase
    .from('purchase_orders')
    .select('po_number, order_date, grand_total, status, suppliers(name)')
    .in('status', ['Pending', 'Approved', 'Partially Received'])
    .order('order_date', { ascending: true })

  const totalDue = (orders ?? []).reduce((sum, po) => sum + Number(po.grand_total), 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <p className="text-slate-400 text-sm">Total Payables</p>
          <p className="text-2xl font-bold text-white mt-1">
            ₹{totalDue.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <p className="text-slate-400 text-sm">Pending Orders</p>
          <p className="text-2xl font-bold text-white mt-1">{(orders ?? []).length}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <p className="text-slate-400 text-sm">Avg Payable</p>
          <p className="text-2xl font-bold text-white mt-1">
            ₹{(orders && orders.length > 0 ? totalDue / orders.length : 0).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Supplier</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">PO#</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Amount Due</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {!orders || orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">No outstanding payables</td>
                </tr>
              ) : (
                orders.map((po) => (
                  <tr key={po.po_number} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30">
                    <td className="py-3 px-4 text-white">{(po.suppliers as unknown as { name: string })?.name || '-'}</td>
                    <td className="py-3 px-4 text-slate-300">{po.po_number}</td>
                    <td className="py-3 px-4 text-slate-300">{po.order_date ? new Date(po.order_date).toLocaleDateString('en-IN') : '-'}</td>
                    <td className="py-3 px-4 text-right text-white">₹{Number(po.grand_total).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        po.status === 'Pending' ? 'bg-amber-900 text-amber-300' :
                        po.status === 'Approved' ? 'bg-blue-900 text-blue-300' :
                        'bg-purple-900 text-purple-300'
                      }`}>
                        {po.status}
                      </span>
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

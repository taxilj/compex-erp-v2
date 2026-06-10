import { createAdminClient } from '@/lib/supabase/admin'

export default async function StockPage() {
  const supabase = createAdminClient()
  const { data: stock } = await supabase
    .from('stock_bin')
    .select(`
      id, quantity,
      items (id, name, sku, rate, unit),
      warehouses (id, name)
    `)
    .order('created_at', { ascending: false })

  const items = stock?.map((s) => ({
    id: s.id,
    itemName: (s.items as any)?.name ?? 'Unknown',
    sku: (s.items as any)?.sku ?? '-',
    warehouse: (s.warehouses as any)?.name ?? 'Unknown',
    quantity: Number(s.quantity),
    rate: Number((s.items as any)?.rate ?? 0),
    value: Number(s.quantity) * Number((s.items as any)?.rate ?? 0),
  })) ?? []

  const totalValue = items.reduce((sum, i) => sum + i.value, 0)
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Item Name</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">SKU</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Warehouse</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Quantity</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Rate</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No stock entries found
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30">
                    <td className="py-3 px-4 text-white">{item.itemName}</td>
                    <td className="py-3 px-4 text-slate-300">{item.sku}</td>
                    <td className="py-3 px-4 text-slate-300">{item.warehouse}</td>
                    <td className="py-3 px-4 text-right text-white">{item.quantity.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-right text-white">₹{item.rate.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-right text-white font-medium">₹{item.value.toLocaleString('en-IN')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 flex items-center justify-end gap-8 text-sm">
        <div className="text-slate-400">
          Total Quantity: <span className="text-white font-medium">{totalQty.toLocaleString('en-IN')}</span>
        </div>
        <div className="text-slate-400">
          Total Stock Value: <span className="text-white font-medium">₹{totalValue.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  )
}

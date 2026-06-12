import { createAdminClient } from '@/lib/supabase/admin'
import PageHeader from '@/components/ui/page-header'
import StockTable from './stock-table'

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

  const items =
    stock?.map((s) => ({
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
    <>
      <PageHeader title="Stock" subtitle="Stock bin across warehouses" />
      <StockTable data={items as unknown as Record<string, unknown>[]} />
      <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 flex items-center justify-end gap-8 text-sm">
        <div className="text-slate-400">
          Total Quantity:{' '}
          <span className="text-white font-medium">
            {totalQty.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="text-slate-400">
          Total Stock Value:{' '}
          <span className="text-white font-medium">
            ₹{totalValue.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </>
  )
}

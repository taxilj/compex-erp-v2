import { createAdminClient } from '@/lib/supabase/admin'
import PageHeader from '@/components/ui/page-header'
import DataTable from '@/components/ui/data-table'
import type { Column } from '@/components/ui/data-table'

export default async function GSTR1Page({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>
}) {
  const supabase = createAdminClient()
  const params = await searchParams
  const now = new Date()
  const year = Number(params.year ?? now.getFullYear())
  const month = Number(params.month ?? now.getMonth() + 1)

  const ym = `${year}-${String(month).padStart(2, '0')}`
  const startDate = `${ym}-01T00:00:00Z`
  const endDate = month === 12
    ? `${year + 1}-01-01T00:00:00Z`
    : `${year}-${String(month + 1).padStart(2, '0')}-01T00:00:00Z`

  const { data: invoices } = await supabase
    .from('sales_invoices')
    .select('*, customers(gst_no), invoice_items(product_name, hsn_code, quantity, rate, gst_rate, taxable_value, gst_amount)')
    .gte('invoice_date', startDate)
    .lt('invoice_date', endDate)
    .neq('status', 'Cancelled')
    .order('invoice_date', { ascending: true })

  const b2b: typeof invoices = []
  const b2c: typeof invoices = []
  const hsnMap = new Map<string, { taxable: number; gst: number; qty: number }>()

  for (const inv of invoices ?? []) {
    if (inv.customers?.gst_no) {
      b2b.push(inv)
    } else {
      b2c.push(inv)
    }
    for (const item of inv.invoice_items ?? []) {
      const code = item.hsn_code ?? '0000'
      const cur = hsnMap.get(code) ?? { taxable: 0, gst: 0, qty: 0 }
      cur.taxable += Number(item.taxable_value ?? 0)
      cur.gst += Number(item.gst_amount ?? 0)
      cur.qty += Number(item.quantity ?? 1) as number
      hsnMap.set(code, cur)
    }
  }

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 })

  const hsnColumns: Column[] = [
    { key: 'hsn', label: 'HSN Code' },
    { key: 'taxable', label: 'Taxable Value', className: 'text-right font-mono' },
    { key: 'gst', label: 'GST Amount', className: 'text-right font-mono' },
    { key: 'qty', label: 'Total Qty', className: 'text-right font-mono' },
  ]

  const hsnRows = [...hsnMap.entries()].map(([code, data]) => ({
    id: code,
    hsn: code,
    taxable: fmt(data.taxable),
    gst: fmt(data.gst),
    qty: data.qty,
  }))

  return (
    <div className="space-y-6">
      <PageHeader title="GSTR-1" subtitle="Outward Supply Details" />

      <form className="flex items-end gap-4 bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Year</label>
          <select name="year" defaultValue={year} className="bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-sm text-white">
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Month</label>
          <select name="month" defaultValue={month} className="bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-sm text-white">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-sm">
          Load
        </button>
      </form>

      {/* B2B Invoices */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-white mb-3">B2B Invoices ({b2b.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-600 text-slate-400 text-left">
                <th className="py-2 pr-3">Invoice</th>
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Customer</th>
                <th className="py-2 pr-3">GSTIN</th>
                <th className="py-2 pr-3 text-right">Taxable</th>
                <th className="py-2 pr-3 text-right">GST</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {b2b.length === 0 && (
                <tr><td colSpan={7} className="py-4 text-center text-slate-500">No B2B invoices</td></tr>
              )}
              {b2b.map((inv) => {
                const items = inv.invoice_items ?? []
                const rowSpan = items.length || 1
                return items.map((item: { item_name?: string; hsn_code?: string; quantity?: number; rate?: number; taxable_value?: number; gst_amount?: number; total?: number }, idx: number) => (
                  <tr key={`${inv.id}-${idx}`} className="border-b border-slate-700">
                    {idx === 0 && (
                      <>
                        <td className="py-2 pr-3 text-white font-medium" rowSpan={rowSpan}>{inv.invoice_number}</td>
                        <td className="py-2 pr-3 text-slate-300" rowSpan={rowSpan}>{new Date(inv.invoice_date).toLocaleDateString('en-IN')}</td>
                        <td className="py-2 pr-3 text-slate-300" rowSpan={rowSpan}>{inv.customers?.name ?? 'Unknown'}</td>
                        <td className="py-2 pr-3 font-mono text-xs" rowSpan={rowSpan}>{inv.customers?.gst_no ?? '—'}</td>
                      </>
                    )}
                    <td className="py-2 pr-3 text-right font-mono">{fmt(Number(item.taxable_value ?? 0))}</td>
                    <td className="py-2 pr-3 text-right font-mono">{fmt(Number(item.gst_amount ?? 0))}</td>
                    {idx === 0 && (
                      <td className="py-2 text-right font-mono" rowSpan={rowSpan}>{fmt(Number(inv.grand_total ?? 0))}</td>
                    )}
                  </tr>
                ))
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* B2C Invoices */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-white mb-3">B2C Invoices ({b2c.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-600 text-slate-400 text-left">
                <th className="py-2 pr-3">Invoice</th>
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Customer</th>
                <th className="py-2 pr-3 text-right">Taxable</th>
                <th className="py-2 pr-3 text-right">GST</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {b2c.length === 0 && (
                <tr><td colSpan={6} className="py-4 text-center text-slate-500">No B2C invoices</td></tr>
              )}
              {b2c.map((inv) => {
                const items = inv.invoice_items ?? []
                const rowSpan = items.length || 1
                return items.map((item: { item_name?: string; hsn_code?: string; quantity?: number; rate?: number; taxable_value?: number; gst_amount?: number; total?: number }, idx: number) => (
                  <tr key={`${inv.id}-${idx}`} className="border-b border-slate-700">
                    {idx === 0 && (
                      <>
                        <td className="py-2 pr-3 text-white font-medium" rowSpan={rowSpan}>{inv.invoice_number}</td>
                        <td className="py-2 pr-3 text-slate-300" rowSpan={rowSpan}>{new Date(inv.invoice_date).toLocaleDateString('en-IN')}</td>
                        <td className="py-2 pr-3 text-slate-300" rowSpan={rowSpan}>{inv.customers?.name ?? 'Consumer'}</td>
                      </>
                    )}
                    <td className="py-2 pr-3 text-right font-mono">{fmt(Number(item.taxable_value ?? 0))}</td>
                    <td className="py-2 pr-3 text-right font-mono">{fmt(Number(item.gst_amount ?? 0))}</td>
                    {idx === 0 && (
                      <td className="py-2 text-right font-mono" rowSpan={rowSpan}>{fmt(Number(inv.grand_total ?? 0))}</td>
                    )}
                  </tr>
                ))
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* HSN Summary */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-white mb-3">HSN Summary</h3>
        <DataTable
          data={hsnRows as unknown as Record<string, unknown>[]}
          columns={hsnColumns}
          searchable={false}
          emptyMessage="No HSN data"
        />
      </div>
    </div>
  )
}

import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

function getMonthRange(year: number, month: number) {
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const end = new Date(year, month, 0).toISOString().slice(0, 10)
  return { start, end }
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default async function Gstr3bPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>
}) {
  const params = await searchParams
  const now = new Date()
  const year = params.year ? parseInt(params.year) : now.getFullYear()
  const month = params.month ? parseInt(params.month) : now.getMonth() + 1
  const { start, end } = getMonthRange(year, month)

  const supabase = createAdminClient()

  const { data: invoices } = await supabase
    .from('sales_invoices')
    .select('*, customers(gst), invoice_items(gst_rate, amount)')
    .gte('invoice_date', start)
    .lte('invoice_date', end)
    .not('status', 'eq', 'Cancelled')

  const rateMap = new Map<number, { taxable: number; gst: number; count: number }>()
  let totalTaxable = 0
  let totalGst = 0

  for (const inv of invoices || []) {
    for (const item of inv.invoice_items || []) {
      const rate = Number(item.gst_rate || 0)
      const taxable = Number(item.amount || 0)
      const gst = taxable * rate / 100
      const cur = rateMap.get(rate) || { taxable: 0, gst: 0, count: 0 }
      cur.taxable += taxable
      cur.gst += gst
      cur.count++
      rateMap.set(rate, cur)
      totalTaxable += taxable
      totalGst += gst
    }
  }

  const sortedRates = [...rateMap.entries()].sort(([a], [b]) => a - b)

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/gst" className="text-slate-400 hover:text-white text-sm">&larr; GST Dashboard</Link>
        <h1 className="text-2xl font-bold text-white">GSTR-3B — Monthly Summary</h1>
      </div>

      <form className="mb-6 flex gap-4 items-end">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Month</label>
          <select name="month" defaultValue={month} className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm">
            {months.map((m, i) => (
              <option key={i + 1} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Year</label>
          <select name="year" defaultValue={year} className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm">
            {[2026, 2025].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
          Filter
        </button>
        <a href={`/api/gst/gstr3b/export?year=${year}&month=${month}`}
          className="bg-green-700 text-white px-4 py-2 rounded text-sm hover:bg-green-600 ml-auto">
          Export CSV
        </a>
      </form>

      {/* 3.1(a) Outward taxable supplies */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-1">3.1(a) — Outward Taxable Supplies (other than reverse charge)</h2>
        <p className="text-xs text-slate-500 mb-3">Regular sales invoices for the period</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-slate-400 text-xs uppercase border-b border-slate-700">
              <tr>
                <th className="pb-2 pr-4">Rate</th>
                <th className="pb-2 pr-4 text-right">Items</th>
                <th className="pb-2 pr-4 text-right">Taxable Value</th>
                <th className="pb-2 pr-4 text-right">CGST (½)</th>
                <th className="pb-2 pr-4 text-right">SGST (½)</th>
                <th className="pb-2 text-right">Total Tax</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {sortedRates.length === 0 ? (
                <tr><td colSpan={6} className="py-4 text-center text-slate-500">No invoices this period.</td></tr>
              ) : (
                sortedRates.map(([rate, val]) => (
                  <tr key={rate} className="border-b border-slate-800">
                    <td className="py-2 pr-4">{rate}%</td>
                    <td className="py-2 pr-4 text-right">{val.count}</td>
                    <td className="py-2 pr-4 text-right">₹{val.taxable.toFixed(2)}</td>
                    <td className="py-2 pr-4 text-right">₹{(val.gst / 2).toFixed(2)}</td>
                    <td className="py-2 pr-4 text-right">₹{(val.gst / 2).toFixed(2)}</td>
                    <td className="py-2 text-right">₹{val.gst.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="text-slate-200 font-medium">
              <tr className="border-t border-slate-600">
                <td className="pt-2 pr-4">Total</td>
                <td className="pt-2 pr-4 text-right">{sortedRates.reduce((s, [, v]) => s + v.count, 0)}</td>
                <td className="pt-2 pr-4 text-right">₹{totalTaxable.toFixed(2)}</td>
                <td className="pt-2 pr-4 text-right">₹{(totalGst / 2).toFixed(2)}</td>
                <td className="pt-2 pr-4 text-right">₹{(totalGst / 2).toFixed(2)}</td>
                <td className="pt-2 text-right">₹{totalGst.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-6">
        <section className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <h3 className="text-base font-semibold text-white mb-1">3.1(b) — Reverse Charge</h3>
          <p className="text-slate-500 text-sm">Not applicable — no reverse charge purchases recorded.</p>
        </section>
        <section className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <h3 className="text-base font-semibold text-white mb-1">4 — Input Tax Credit</h3>
          <p className="text-slate-500 text-sm">ITC will be available once purchase-side GST data is added.</p>
        </section>
      </div>
    </div>
  )
}

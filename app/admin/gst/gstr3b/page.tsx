import { createAdminClient } from '@/lib/supabase/admin'
import PageHeader from '@/components/ui/page-header'
import StatsCard from '@/components/ui/stats-card'
import { IndianRupee, Percent, ShoppingCart } from 'lucide-react'
import Gstr3bTable from './gstr3b-table'

export default async function GSTR3BPage({
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
    .select('invoice_items(gst_rate, taxable_value, gst_amount)')
    .gte('invoice_date', startDate)
    .lt('invoice_date', endDate)
    .neq('status', 'Cancelled')

  const rateMap = new Map<number, { taxable: number; gst: number; count: number }>()

  for (const inv of invoices ?? []) {
    for (const item of inv.invoice_items ?? []) {
      const rate = Number(item.gst_rate ?? 0)
      const cur = rateMap.get(rate) ?? { taxable: 0, gst: 0, count: 0 }
      cur.taxable += Number(item.taxable_value ?? 0)
      cur.gst += Number(item.gst_amount ?? 0)
      cur.count++
      rateMap.set(rate, cur)
    }
  }

  const totalTaxable = [...rateMap.values()].reduce((s, r) => s + r.taxable, 0)
  const totalGst = [...rateMap.values()].reduce((s, r) => s + r.gst, 0)
  const totalItems = [...rateMap.values()].reduce((s, r) => s + r.count, 0)

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 })

  const rows = [...rateMap.entries()]
    .sort(([a], [b]) => a - b)
    .map(([rate, data]) => ({
      id: rate,
      rate: `${rate}%`,
      taxable: fmt(data.taxable),
      gst: fmt(data.gst),
      count: data.count,
    }))

  return (
    <div className="space-y-6">
      <PageHeader title="GSTR-3B" subtitle="Monthly Return Summary" />

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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="Total Taxable Value" value={fmt(totalTaxable)} icon={IndianRupee} color="blue" />
        <StatsCard title="Total GST" value={fmt(totalGst)} icon={Percent} color="green" />
        <StatsCard title="Total Lines" value={String(totalItems)} icon={ShoppingCart} color="amber" />
      </div>

      <Gstr3bTable data={rows as unknown as Record<string, unknown>[]} />
    </div>
  )
}

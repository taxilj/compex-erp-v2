import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

function getMonthRange(year: number, month: number) {
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const end = new Date(year, month, 0).toISOString().slice(0, 10)
  return { start, end }
}

export default async function GstDashboardPage({
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
    .select('subtotal, gst_amount, grand_total')
    .gte('invoice_date', start)
    .lte('invoice_date', end)
    .not('status', 'eq', 'Cancelled')

  const taxable = invoices?.reduce((s, i) => s + Number(i.subtotal || 0), 0) || 0
  const gst = invoices?.reduce((s, i) => s + Number(i.gst_amount || 0), 0) || 0
  const total = invoices?.reduce((s, i) => s + Number(i.grand_total || 0), 0) || 0
  const count = invoices?.length || 0

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return (
    <div className="min-h-screen bg-slate-900">
      <h1 className="mb-6 text-2xl font-bold text-white">GST Reports</h1>

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
      </form>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <p className="text-xs text-slate-400 uppercase tracking-wide">GST Collected</p>
          <p className="text-2xl font-bold text-white mt-1">₹{gst.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Taxable Value</p>
          <p className="text-2xl font-bold text-white mt-1">₹{taxable.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Invoice Value</p>
          <p className="text-2xl font-bold text-white mt-1">₹{total.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Invoices</p>
          <p className="text-2xl font-bold text-white mt-1">{count}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link href={`/admin/gst/gstr1?year=${year}&month=${month}`}
          className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:bg-slate-700 transition-colors">
          <h3 className="text-lg font-semibold text-white">GSTR-1</h3>
          <p className="text-slate-400 text-sm mt-1">Outward supply details — B2B &amp; B2C invoices with HSN summary</p>
        </Link>
        <Link href={`/admin/gst/gstr3b?year=${year}&month=${month}`}
          className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:bg-slate-700 transition-colors">
          <h3 className="text-lg font-semibold text-white">GSTR-3B</h3>
          <p className="text-slate-400 text-sm mt-1">Monthly summary return — rate-wise outward supplies</p>
        </Link>
      </div>
    </div>
  )
}

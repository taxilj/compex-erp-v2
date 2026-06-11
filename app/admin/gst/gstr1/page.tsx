import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

function getMonthRange(year: number, month: number) {
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const end = new Date(year, month, 0).toISOString().slice(0, 10)
  return { start, end }
}

function esc(v: string | number | null | undefined) {
  const s = v?.toString() || ''
  return s.includes(',') ? `"${s}"` : s
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default async function Gstr1Page({
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
    .select('*, customers(gst, name), invoice_items(*, items(hsn, name))')
    .gte('invoice_date', start)
    .lte('invoice_date', end)
    .not('status', 'eq', 'Cancelled')
    .order('invoice_date')

  const b2b: typeof invoices = []
  const b2c: typeof invoices = []

  for (const inv of invoices || []) {
    if (inv.customers?.gst) {
      b2b.push(inv)
    } else {
      b2c.push(inv)
    }
  }

  const hsnMap = new Map<string, { taxable: number; gst: number }>()
  for (const inv of invoices || []) {
    for (const item of inv.invoice_items || []) {
      const hsn = item.items?.hsn || 'NA'
      const taxable = Number(item.amount || 0)
      const gst = taxable * Number(item.gst_rate || 0) / 100
      const cur = hsnMap.get(hsn) || { taxable: 0, gst: 0 }
      cur.taxable += taxable
      cur.gst += gst
      hsnMap.set(hsn, cur)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/gst" className="text-slate-400 hover:text-white text-sm">&larr; GST Dashboard</Link>
        <h1 className="text-2xl font-bold text-white">GSTR-1 — Outward Supply</h1>
      </div>

      <form className="mb-6 flex gap-4 items-end">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Month</label>
          <select name="month" defaultValue={month} className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm" id="month-sel">
            {months.map((m, i) => (
              <option key={i + 1} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Year</label>
          <select name="year" defaultValue={year} className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm" id="year-sel">
            {[2026, 2025].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
          Filter
        </button>
        <a href={`/api/gst/gstr1/export?year=${year}&month=${month}`}
          className="bg-green-700 text-white px-4 py-2 rounded text-sm hover:bg-green-600 ml-auto">
          Export CSV
        </a>
      </form>

      {/* B2B */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-3">B2B (with GSTIN)</h2>
        {b2b.length === 0 ? (
          <p className="text-slate-500 text-sm">No B2B invoices this period.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-slate-400 text-xs uppercase border-b border-slate-700">
                <tr>
                  <th className="pb-2 pr-4">GSTIN</th>
                  <th className="pb-2 pr-4">Customer</th>
                  <th className="pb-2 pr-4">Invoice</th>
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 pr-4 text-right">Taxable</th>
                  <th className="pb-2 pr-4 text-right">GST</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {b2b.flatMap((inv: any) =>
                  (inv.invoice_items || []).map((item: any, i: number) => (
                    <tr key={`${inv.id}-${i}`} className="border-b border-slate-800">
                      {i === 0 && (
                        <>
                          <td className="py-2 pr-4 align-top" rowSpan={inv.invoice_items?.length}>{inv.customers?.gst || '-'}</td>
                          <td className="py-2 pr-4 align-top" rowSpan={inv.invoice_items?.length}>{inv.customers?.name}</td>
                          <td className="py-2 pr-4 align-top" rowSpan={inv.invoice_items?.length}>
                            <Link href={`/admin/invoices/${inv.id}`} className="text-blue-400 hover:underline">{inv.invoice_number}</Link>
                          </td>
                          <td className="py-2 pr-4 align-top" rowSpan={inv.invoice_items?.length}>{inv.invoice_date}</td>
                        </>
                      )}
                      <td className="py-2 pr-4 text-right">₹{Number(item.amount).toFixed(2)}</td>
                      <td className="py-2 pr-4 text-right">₹{(Number(item.amount) * Number(item.gst_rate || 0) / 100).toFixed(2)}</td>
                      <td className="py-2 text-right">₹{Number(inv.grand_total).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* B2C */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-3">B2C (without GSTIN)</h2>
        {b2c.length === 0 ? (
          <p className="text-slate-500 text-sm">No B2C invoices this period.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-slate-400 text-xs uppercase border-b border-slate-700">
                <tr>
                  <th className="pb-2 pr-4">Customer</th>
                  <th className="pb-2 pr-4">Invoice</th>
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 pr-4 text-right">Taxable</th>
                  <th className="pb-2 pr-4 text-right">GST</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {b2c.flatMap((inv: any) =>
                  (inv.invoice_items || []).map((item: any, i: number) => (
                    <tr key={`${inv.id}-${i}`} className="border-b border-slate-800">
                      {i === 0 && (
                        <>
                          <td className="py-2 pr-4 align-top" rowSpan={inv.invoice_items?.length}>{inv.customers?.name || '-'}</td>
                          <td className="py-2 pr-4 align-top" rowSpan={inv.invoice_items?.length}>
                            <Link href={`/admin/invoices/${inv.id}`} className="text-blue-400 hover:underline">{inv.invoice_number}</Link>
                          </td>
                          <td className="py-2 pr-4 align-top" rowSpan={inv.invoice_items?.length}>{inv.invoice_date}</td>
                        </>
                      )}
                      <td className="py-2 pr-4 text-right">₹{Number(item.amount).toFixed(2)}</td>
                      <td className="py-2 pr-4 text-right">₹{(Number(item.amount) * Number(item.gst_rate || 0) / 100).toFixed(2)}</td>
                      <td className="py-2 text-right">₹{Number(inv.grand_total).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* HSN Summary */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3">HSN-wise Summary</h2>
        {hsnMap.size === 0 ? (
          <p className="text-slate-500 text-sm">No items this period.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-slate-400 text-xs uppercase border-b border-slate-700">
                <tr>
                  <th className="pb-2 pr-4">HSN Code</th>
                  <th className="pb-2 pr-4 text-right">Taxable Value</th>
                  <th className="pb-2 text-right">GST</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {[...hsnMap.entries()].map(([hsn, val]) => (
                  <tr key={hsn} className="border-b border-slate-800">
                    <td className="py-2 pr-4">{hsn}</td>
                    <td className="py-2 pr-4 text-right">₹{val.taxable.toFixed(2)}</td>
                    <td className="py-2 text-right">₹{val.gst.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

function getMonthRange(year: number, month: number) {
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const end = new Date(year, month, 0).toISOString().slice(0, 10)
  return { start, end }
}

export async function GET(req: NextRequest) {
  const year = parseInt(req.nextUrl.searchParams.get('year') || String(new Date().getFullYear()))
  const month = parseInt(req.nextUrl.searchParams.get('month') || String(new Date().getMonth() + 1))
  const { start, end } = getMonthRange(year, month)
  const supabase = createAdminClient()

  const { data: invoices } = await supabase
    .from('sales_invoices')
    .select('invoice_number, invoice_items(gst_rate, amount)')
    .gte('invoice_date', start)
    .lte('invoice_date', end)
    .not('status', 'eq', 'Cancelled')

  const rateMap = new Map<number, { taxable: number; gst: number; count: number }>()
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
    }
  }

  const rows: string[] = ['Rate,Items,Taxable Value,CGST(½),SGST(½),Total Tax']
  let totalTaxable = 0, totalGst = 0
  for (const [rate, val] of [...rateMap.entries()].sort(([a], [b]) => a - b)) {
    rows.push([
      `${rate}%`,
      val.count.toString(),
      val.taxable.toFixed(2),
      (val.gst / 2).toFixed(2),
      (val.gst / 2).toFixed(2),
      val.gst.toFixed(2),
    ].join(','))
    totalTaxable += val.taxable
    totalGst += val.gst
  }
  rows.push(`Total,${[...rateMap.values()].reduce((s, v) => s + v.count, 0)},${totalTaxable.toFixed(2)},${(totalGst / 2).toFixed(2)},${(totalGst / 2).toFixed(2)},${totalGst.toFixed(2)}`)

  const monthLabel = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][month - 1]
  const filename = `gstr3b-${monthLabel}-${year}.csv`

  return new NextResponse(rows.join('\n'), {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

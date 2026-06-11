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
    .select('*, customers(gst, name), invoice_items(*, items(hsn, name))')
    .gte('invoice_date', start)
    .lte('invoice_date', end)
    .not('status', 'eq', 'Cancelled')
    .order('invoice_date')

  const rows: string[] = ['GSTIN,Customer,Invoice,Date,HSN,Item Qty,Rate,Taxable,GST,Total,Type']
  for (const inv of invoices || []) {
    const type = inv.customers?.gst ? 'B2B' : 'B2C'
    for (const item of inv.invoice_items || []) {
      const gst = Number(item.amount) * Number(item.gst_rate || 0) / 100
      rows.push([
        inv.customers?.gst || '',
        `"${inv.customers?.name || ''}"`,
        inv.invoice_number,
        inv.invoice_date,
        item.items?.hsn || '',
        (item.quantity || 0).toString(),
        `${item.gst_rate}%`,
        Number(item.amount).toFixed(2),
        gst.toFixed(2),
        Number(inv.grand_total).toFixed(2),
        type,
      ].join(','))
    }
  }

  const monthLabel = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][month - 1]
  const filename = `gstr1-${monthLabel}-${year}.csv`

  return new NextResponse(rows.join('\n'), {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

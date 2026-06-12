import { createAdminClient } from '@/lib/supabase/admin'
import DashboardClient from './client'

export default async function DashboardPage() {
  const supabase = createAdminClient()

  const [itemsRes, suppliersRes, customersRes, invoicesRes, posRes, stockRes, lowStockRes, glRes] = await Promise.all([
    supabase.from('items').select('id', { count: 'exact', head: true }),
    supabase.from('suppliers').select('id', { count: 'exact', head: true }),
    supabase.from('customers').select('id', { count: 'exact', head: true }),
    supabase.from('sales_invoices').select('total_amount, status, created_at'),
    supabase.from('purchase_orders').select('total_amount, status'),
    supabase.from('stock_bin').select('quantity, items!inner(rate)'),
    supabase.from('stock_bin').select('id, items!inner(name), quantity, bin_code, warehouses!inner(name)').lt('quantity', 50),
    supabase.from('gl_entries').select('account_name, amount, entry_type'),
  ])

  const totalItems = itemsRes.count ?? 0
  const totalSuppliers = suppliersRes.count ?? 0
  const totalCustomers = customersRes.count ?? 0

  const invoices = invoicesRes.data ?? []
  const unpaidInvoices = invoices.filter((inv) => inv.status === 'Unpaid')
  const unpaidInvoiceCount = unpaidInvoices.length
  const totalRevenue = invoices.reduce((s, inv) => s + Number(inv.total_amount ?? 0), 0)

  const pos = posRes.data ?? []
  const pendingPOs = pos.filter((po) => po.status === 'Pending')
  const pendingPOCount = pendingPOs.length

  const stockBin = stockRes.data ?? []
  const stockValue = stockBin.reduce((s, b) => s + Number(b.quantity) * Number((b.items as unknown as { rate: number }).rate ?? 0), 0)

  const lowStockItems = (lowStockRes.data ?? []).map((b) => ({
    name: (b.items as unknown as { name: string }).name,
    quantity: b.quantity,
    bin: b.bin_code,
    warehouse: (b.warehouses as unknown as { name: string }).name,
  }))

  const monthlyRev: Record<string, number> = {}
  invoices.forEach((inv) => {
    const m = (inv.created_at as string)?.slice(0, 7)
    if (m) monthlyRev[m] = (monthlyRev[m] || 0) + Number(inv.total_amount ?? 0)
  })
  const monthlyRevenue = Object.entries(monthlyRev).map(([month, amount]) => ({ month, amount }))

  const glEntries = glRes.data ?? []
  const debitTotal = glEntries.filter((g) => g.entry_type === 'debit').reduce((s, g) => s + Number(g.amount), 0)
  const creditTotal = glEntries.filter((g) => g.entry_type === 'credit').reduce((s, g) => s + Number(g.amount), 0)

  return (
    <DashboardClient
      totalItems={totalItems}
      totalSuppliers={totalSuppliers}
      totalCustomers={totalCustomers}
      totalRevenue={totalRevenue}
      unpaidInvoiceCount={unpaidInvoiceCount}
      pendingPOCount={pendingPOCount}
      stockValue={stockValue}
      lowStockItems={lowStockItems}
      debitTotal={debitTotal}
      creditTotal={creditTotal}
      monthlyRevenue={monthlyRevenue}
    />
  )
}

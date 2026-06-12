import { createAdminClient } from '@/lib/supabase/admin'
import PageHeader from '@/components/ui/page-header'
import StatsCard from '@/components/ui/stats-card'
import { IndianRupee, Clock, TrendingDown } from 'lucide-react'
import PayablesTable from './payables-table'

export default async function PayablesPage() {
  const supabase = createAdminClient()

  const { data: orders } = await supabase
    .from('purchase_orders')
    .select('*, suppliers(name)')
    .in('status', ['Pending', 'Approved', 'Partially Received'])
    .order('order_date', { ascending: false })

  const totalPayables = (orders ?? []).reduce((s, o) => s + Number(o.grand_total), 0)
  const avgPayable = (orders ?? []).length > 0 ? totalPayables / (orders ?? []).length : 0

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 })

  const rows = (orders ?? []).map((o) => ({
    id: o.id,
    supplier_name: o.suppliers?.name ?? 'Unknown',
    po_number: o.po_number,
    order_date: o.order_date,
    grand_total: o.grand_total,
    status: o.status,
  }))

  return (
    <div className="space-y-6">
      <PageHeader title="Payables" subtitle="Outstanding purchase orders" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="Total Payables" value={fmt(totalPayables)} icon={IndianRupee} color="blue" />
        <StatsCard title="Pending Orders" value={String(orders?.length ?? 0)} icon={Clock} color="amber" />
        <StatsCard title="Avg Payable" value={fmt(avgPayable)} icon={TrendingDown} color="green" />
      </div>

      <PayablesTable data={rows as unknown as Record<string, unknown>[]} />
    </div>
  )
}

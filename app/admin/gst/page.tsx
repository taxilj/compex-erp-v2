import { createAdminClient } from '@/lib/supabase/admin'
import PageHeader from '@/components/ui/page-header'
import StatsCard from '@/components/ui/stats-card'
import { FileText, IndianRupee, BarChart3, TrendingUp } from 'lucide-react'

export default async function GSTDashboardPage() {
  const supabase = createAdminClient()

  const { count: totalInvoices } = await supabase
    .from('sales_invoices')
    .select('*', { count: 'exact', head: true })

  const { data: invoices } = await supabase
    .from('sales_invoices')
    .select('grand_total, status')
    .neq('status', 'Cancelled')

  const totalRevenue = (invoices ?? []).reduce((s, i) => s + Number(i.grand_total), 0)
  const paidInvoices = (invoices ?? []).filter((i) => i.status === 'Paid').length

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 })

  return (
    <div className="space-y-6">
      <PageHeader title="GST Dashboard" subtitle="Tax compliance overview" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Invoices" value={String(totalInvoices ?? 0)} icon={FileText} color="blue" />
        <StatsCard title="Total Revenue" value={fmt(totalRevenue)} icon={IndianRupee} color="green" />
        <StatsCard title="Paid Invoices" value={String(paidInvoices)} icon={TrendingUp} color="amber" />
        <StatsCard title="Avg Invoice" value={fmt(totalInvoices ? totalRevenue / totalInvoices : 0)} icon={BarChart3} color="blue" />
      </div>
    </div>
  )
}

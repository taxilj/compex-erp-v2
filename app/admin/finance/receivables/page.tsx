import { createAdminClient } from '@/lib/supabase/admin'
import PageHeader from '@/components/ui/page-header'
import StatsCard from '@/components/ui/stats-card'
import { IndianRupee, FileText, AlertTriangle } from 'lucide-react'
import ReceivablesTable from './receivables-table'

export default async function ReceivablesPage() {
  const supabase = createAdminClient()

  const { data: invoices } = await supabase
    .from('sales_invoices')
    .select('*, customers(name)')
    .in('status', ['Unpaid', 'Overdue'])
    .order('invoice_date', { ascending: false })

  const today = new Date()
  const overdue = (invoices ?? []).filter(
    (i) => i.status === 'Overdue' || (i.status === 'Unpaid' && new Date(i.due_date ?? i.invoice_date) < today)
  )

  const totalReceivables = (invoices ?? []).reduce((s, i) => s + Number(i.grand_total), 0)
  const totalOverdue = overdue.reduce((s, i) => s + Number(i.grand_total), 0)

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 })

  const daysOverdue = (dueDate: string | null): number => {
    if (!dueDate) return 0
    const diff = today.getTime() - new Date(dueDate).getTime()
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
  }

  const rows = (invoices ?? []).map((i) => ({
    id: i.id,
    customer_name: i.customers?.name ?? 'Unknown',
    invoice_number: i.invoice_number,
    invoice_date: i.invoice_date,
    grand_total: i.grand_total,
    days_overdue: daysOverdue(i.due_date),
    status: daysOverdue(i.due_date) > 0 && i.status === 'Unpaid' ? 'Overdue' : i.status,
  }))

  return (
    <div className="space-y-6">
      <PageHeader title="Receivables" subtitle="Outstanding customer invoices" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="Total Receivables" value={fmt(totalReceivables)} icon={IndianRupee} color="blue" />
        <StatsCard title="Outstanding Invoices" value={String(invoices?.length ?? 0)} icon={FileText} color="amber" />
        <StatsCard title="Overdue Amount" value={fmt(totalOverdue)} icon={AlertTriangle} color="red" />
      </div>

      <ReceivablesTable data={rows as unknown as Record<string, unknown>[]} />
    </div>
  )
}

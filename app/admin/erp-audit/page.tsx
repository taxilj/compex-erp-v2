import { createAdminClient } from '@/lib/supabase/admin'
import PageHeader from '@/components/ui/page-header'
import StatsCard from '@/components/ui/stats-card'
import { IndianRupee, ArrowUpDown } from 'lucide-react'
import ErpAuditTable from './erp-audit-table'

export default async function ErpAuditPage() {
  const supabase = createAdminClient()

  const { data: entries } = await supabase
    .from('gl_entries')
    .select('*')
    .order('entry_date', { ascending: false })
    .limit(500)

  const totalDebit = (entries ?? []).reduce((s, e) => s + Number(e.debit), 0)
  const totalCredit = (entries ?? []).reduce((s, e) => s + Number(e.credit), 0)

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 })

  return (
    <div className="space-y-6">
      <PageHeader title="ERP Audit" subtitle="General Ledger Journal Entries" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatsCard title="Total Debit" value={fmt(totalDebit)} icon={IndianRupee} color="blue" />
        <StatsCard title="Total Credit" value={fmt(totalCredit)} icon={ArrowUpDown} color="green" />
      </div>

      <ErpAuditTable data={(entries ?? []) as unknown as Record<string, unknown>[]} />
    </div>
  )
}

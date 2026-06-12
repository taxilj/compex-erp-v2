import { createAdminClient } from '@/lib/supabase/admin'
import StatsCard from '@/components/ui/stats-card'
import DataTable from '@/components/ui/data-table'
import type { Column } from '@/components/ui/data-table'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

export default async function ProfitLossPage() {
  const supabase = createAdminClient()

  const { data: entries } = await supabase
    .from('gl_entries')
    .select('account_name, debit, credit')

  const incomeMap = new Map<string, number>()
  const expenseMap = new Map<string, number>()

  for (const e of entries ?? []) {
    const name = e.account_name
    const cr = Number(e.credit)
    const dr = Number(e.debit)
    if (cr > 0) incomeMap.set(name, (incomeMap.get(name) ?? 0) + cr)
    if (dr > 0) expenseMap.set(name, (expenseMap.get(name) ?? 0) + dr)
  }

  const totalIncome = [...incomeMap.values()].reduce((s, v) => s + v, 0)
  const totalExpense = [...expenseMap.values()].reduce((s, v) => s + v, 0)
  const netProfit = totalIncome - totalExpense

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 })

  const incomeRows = [...incomeMap.entries()].map(([account, amount], i) => ({
    id: i,
    account,
    amount: fmt(amount),
    raw_amount: amount,
  }))

  const expenseRows = [...expenseMap.entries()].map(([account, amount], i) => ({
    id: i,
    account,
    amount: fmt(amount),
    raw_amount: amount,
  }))

  const columns: Column[] = [
    { key: 'account', label: 'Account' },
    {
      key: 'amount',
      label: 'Amount',
      className: 'text-right font-mono',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="Total Income" value={fmt(totalIncome)} icon={TrendingUp} color="green" />
        <StatsCard title="Total Expenses" value={fmt(totalExpense)} icon={TrendingDown} color="red" />
        <StatsCard
          title="Net Profit / Loss"
          value={fmt(netProfit)}
          icon={DollarSign}
          color={netProfit >= 0 ? 'green' : 'red'}
        />
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Income Accounts</h3>
        <DataTable
          data={incomeRows as unknown as Record<string, unknown>[]}
          columns={columns}
          searchable={false}
          emptyMessage="No income entries"
        />
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Expense Accounts</h3>
        <DataTable
          data={expenseRows as unknown as Record<string, unknown>[]}
          columns={columns}
          searchable={false}
          emptyMessage="No expense entries"
        />
      </div>
    </div>
  )
}

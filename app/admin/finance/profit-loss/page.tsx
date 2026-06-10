import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function ProfitLossPage() {
  const supabase = await createServerSupabaseClient()
  const { data: entries } = await supabase
    .from('gl_entries')
    .select('account_name, debit, credit')

  const incomeMap = new Map<string, number>()
  const expenseMap = new Map<string, number>()

  let totalIncome = 0
  let totalExpense = 0

  for (const e of entries ?? []) {
    const cr = Number(e.credit)
    const dr = Number(e.debit)
    if (cr > 0) {
      incomeMap.set(e.account_name, (incomeMap.get(e.account_name) || 0) + cr)
      totalIncome += cr
    }
    if (dr > 0) {
      expenseMap.set(e.account_name, (expenseMap.get(e.account_name) || 0) + dr)
      totalExpense += dr
    }
  }

  const netProfit = totalIncome - totalExpense

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <p className="text-slate-400 text-sm">Total Income</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">₹{totalIncome.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <p className="text-slate-400 text-sm">Total Expenses</p>
          <p className="text-2xl font-bold text-red-400 mt-1">₹{totalExpense.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <p className="text-slate-400 text-sm">Net {netProfit >= 0 ? 'Profit' : 'Loss'}</p>
          <p className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ₹{Math.abs(netProfit).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700">
            <h3 className="text-white font-medium">Income Accounts</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="text-left py-2 px-4 text-slate-400 font-medium">Account</th>
                <th className="text-right py-2 px-4 text-slate-400 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {incomeMap.size === 0 ? (
                <tr><td colSpan={2} className="py-8 text-center text-slate-500">No income entries</td></tr>
              ) : (
                [...incomeMap.entries()].map(([account, amount]) => (
                  <tr key={account} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30">
                    <td className="py-2 px-4 text-white">{account}</td>
                    <td className="py-2 px-4 text-right text-emerald-400">₹{amount.toLocaleString('en-IN')}</td>
                  </tr>
                ))
              )}
              <tr className="border-t border-slate-700 bg-slate-700/20">
                <td className="py-2 px-4 text-white font-medium">Total Income</td>
                <td className="py-2 px-4 text-right text-emerald-400 font-medium">₹{totalIncome.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700">
            <h3 className="text-white font-medium">Expense Accounts</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="text-left py-2 px-4 text-slate-400 font-medium">Account</th>
                <th className="text-right py-2 px-4 text-slate-400 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenseMap.size === 0 ? (
                <tr><td colSpan={2} className="py-8 text-center text-slate-500">No expense entries</td></tr>
              ) : (
                [...expenseMap.entries()].map(([account, amount]) => (
                  <tr key={account} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30">
                    <td className="py-2 px-4 text-white">{account}</td>
                    <td className="py-2 px-4 text-right text-red-400">₹{amount.toLocaleString('en-IN')}</td>
                  </tr>
                ))
              )}
              <tr className="border-t border-slate-700 bg-slate-700/20">
                <td className="py-2 px-4 text-white font-medium">Total Expenses</td>
                <td className="py-2 px-4 text-right text-red-400 font-medium">₹{totalExpense.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

import { createAdminClient } from '@/lib/supabase/admin'

export default async function ErpAuditPage() {
  const supabase = createAdminClient()
  const { data: entries } = await supabase
    .from('gl_entries')
    .select('id, entry_date, account_name, debit, credit, description, reference_type, reference_id')
    .order('created_at', { ascending: false })
    .limit(100)

  const totalDebit = (entries ?? []).reduce((sum, e) => sum + Number(e.debit), 0)
  const totalCredit = (entries ?? []).reduce((sum, e) => sum + Number(e.credit), 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <p className="text-slate-400 text-sm">Total Debit</p>
          <p className="text-2xl font-bold text-white mt-1">₹{totalDebit.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <p className="text-slate-400 text-sm">Total Credit</p>
          <p className="text-2xl font-bold text-white mt-1">₹{totalCredit.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Account</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Debit</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Credit</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Description</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Reference</th>
              </tr>
            </thead>
            <tbody>
              {!entries || entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">No journal entries found</td>
                </tr>
              ) : (
                entries.map((e) => (
                  <tr key={e.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30">
                    <td className="py-3 px-4 text-slate-300">{e.entry_date ? new Date(e.entry_date).toLocaleDateString('en-IN') : '-'}</td>
                    <td className="py-3 px-4 text-white">{e.account_name}</td>
                    <td className="py-3 px-4 text-right text-white">
                      {Number(e.debit) > 0 ? `₹${Number(e.debit).toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right text-white">
                      {Number(e.credit) > 0 ? `₹${Number(e.credit).toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{e.description || '-'}</td>
                    <td className="py-3 px-4 text-slate-400 text-xs">
                      {e.reference_type ? `${e.reference_type}/${(e.reference_id ?? '').toString().slice(0, 8)}` : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-700 bg-slate-700/20">
                <td colSpan={2} className="py-3 px-4 text-white font-medium">Total</td>
                <td className="py-3 px-4 text-right text-white font-medium">₹{totalDebit.toLocaleString('en-IN')}</td>
                <td className="py-3 px-4 text-right text-white font-medium">₹{totalCredit.toLocaleString('en-IN')}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

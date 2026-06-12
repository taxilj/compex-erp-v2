import { createAdminClient } from '@/lib/supabase/admin'
import PageHeader from '@/components/ui/page-header'
import VendorsTable from './vendors-table'

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; source?: string; status?: string }>
}) {
  const supabase = createAdminClient()
  const params = await searchParams
  const q = params.q ?? ''
  const source = params.source ?? ''
  const status = params.status ?? ''

  let query = supabase.from('vendor_profiles').select('*', { count: 'exact' }).limit(100)
  if (q) query = query.or(`company_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`)
  if (source) query = query.eq('source', source)
  if (status) query = query.eq('status', status)

  const { data: vendors, count } = await query.order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <PageHeader title="Vendors" subtitle="Manage vendor profiles" />

      <form className="flex flex-wrap items-end gap-4 bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div>
          <label htmlFor="q" className="block text-xs text-slate-400 mb-1">Search</label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Name, email or phone..."
            className="bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-sm text-white w-56"
          />
        </div>
        <div>
          <label htmlFor="source" className="block text-xs text-slate-400 mb-1">Source</label>
          <select id="source" name="source" defaultValue={source} className="bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-sm text-white">
            <option value="">All</option>
            <option value="manual">Manual</option>
            <option value="import">Import</option>
            <option value="api">API</option>
            <option value="reference">Reference</option>
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-xs text-slate-400 mb-1">Status</label>
          <select id="status" name="status" defaultValue={status} className="bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-sm text-white">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="validated">Validated</option>
            <option value="rejected">Rejected</option>
            <option value="enriched">Enriched</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-sm">
          Filter
        </button>
      </form>

      <p className="text-sm text-slate-400">{count ?? 0} vendor{(count ?? 0) !== 1 ? 's' : ''}</p>

      <VendorsTable data={(vendors ?? []) as unknown as Record<string, unknown>[]} />
    </div>
  )
}

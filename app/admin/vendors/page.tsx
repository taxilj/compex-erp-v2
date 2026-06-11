import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  pending: 'text-yellow-400',
  validated: 'text-green-400',
  rejected: 'text-red-400',
  enriched: 'text-blue-400',
}

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; source?: string; status?: string }>
}) {
  const supabase = createAdminClient()
  const params = await searchParams

  let query = supabase
    .from('vendor_profiles')
    .select('id, company_name, source, city, state, status, created_at, phone, email')
    .order('created_at', { ascending: false })

  if (params.q) {
    query = query.or(
      `company_name.ilike.%${params.q}%,city.ilike.%${params.q}%,state.ilike.%${params.q}%,phone.ilike.%${params.q}%,email.ilike.%${params.q}%`
    )
  }
  if (params.source) {
    query = query.eq('source', params.source)
  }
  if (params.status) {
    query = query.eq('status', params.status)
  }

  const { data: vendors } = await query.limit(100)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <form className="flex gap-3 flex-1">
          <input
            name="q"
            defaultValue={params.q || ''}
            placeholder="Search vendors..."
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white placeholder-slate-500 flex-1 max-w-xs"
          />
          <select
            name="source"
            defaultValue={params.source || ''}
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white"
          >
            <option value="">All Sources</option>
            <option value="tradeindia">TradeIndia</option>
            <option value="indiamart">IndiaMART</option>
            <option value="justdial">Justdial</option>
            <option value="manual">Manual</option>
            <option value="api">API</option>
          </select>
          <select
            name="status"
            defaultValue={params.status || ''}
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="validated">Validated</option>
            <option value="rejected">Rejected</option>
            <option value="enriched">Enriched</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Filter
          </button>
        </form>
        <span className="text-slate-400 text-sm whitespace-nowrap">
          {vendors?.length ?? 0} result{vendors?.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Company</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Source</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">City</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">State</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Phone</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {!vendors || vendors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No vendor profiles found. Ingest data via the API first.
                  </td>
                </tr>
              ) : (
                vendors.map((v) => (
                  <tr
                    key={v.id}
                    className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30"
                  >
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/vendors/${v.id}`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {v.company_name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-slate-300 capitalize">{v.source}</td>
                    <td className="py-3 px-4 text-slate-300">{v.city || '-'}</td>
                    <td className="py-3 px-4 text-slate-300">{v.state || '-'}</td>
                    <td className="py-3 px-4 text-slate-300">{v.phone || '-'}</td>
                    <td className="py-3 px-4 text-slate-300">{v.email || '-'}</td>
                    <td className={`py-3 px-4 capitalize ${statusColors[v.status] || 'text-slate-300'}`}>
                      {v.status}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs">
                      {new Date(v.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { StatusBadge } from './status-badge'
import { StatusActions } from './status-actions'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function VendorDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: vendor } = await supabase
    .from('vendor_profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!vendor) notFound()

  const fields: { label: string; value: string | null }[] = [
    { label: 'Company Name', value: vendor.company_name },
    { label: 'Source', value: vendor.source },
    { label: 'Status', value: vendor.status },
    { label: 'GSTIN', value: vendor.gstin },
    { label: 'City', value: vendor.city },
    { label: 'State', value: vendor.state },
    { label: 'Phone', value: vendor.phone },
    { label: 'Email', value: vendor.email },
    { label: 'Website', value: vendor.website },
    { label: 'Contact Person', value: vendor.contact_person },
    { label: 'Address', value: vendor.address },
    { label: 'Pincode', value: vendor.pincode },
    { label: 'Country', value: vendor.country },
    { label: 'Latitude', value: vendor.latitude ? String(vendor.latitude) : null },
    { label: 'Longitude', value: vendor.longitude ? String(vendor.longitude) : null },
    { label: 'Product Categories', value: vendor.product_categories?.length ? vendor.product_categories.join(', ') : null },
    { label: 'Keywords', value: vendor.keywords?.length ? vendor.keywords.join(', ') : null },
    { label: 'Confidence Score', value: vendor.confidence_score !== null ? String(vendor.confidence_score) : null },
    { label: 'Created', value: vendor.created_at ? new Date(vendor.created_at).toLocaleString() : null },
    { label: 'Updated', value: vendor.updated_at ? new Date(vendor.updated_at).toLocaleString() : null },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/vendors" className="text-sm text-blue-400 hover:text-blue-300 mb-1 inline-block">
            &larr; Back to Vendors
          </Link>
          <h1 className="text-xl font-bold text-white flex items-center gap-3">
            {vendor.company_name}
            <StatusBadge status={vendor.status} />
          </h1>
          <p className="text-slate-400 text-sm mt-1 capitalize">Source: {vendor.source}</p>
        </div>
        <StatusActions vendorId={vendor.id} currentStatus={vendor.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Profile Details</h2>
          <div className="space-y-3">
            {fields.slice(0, 13).map((f) =>
              f.value ? (
                <div key={f.label} className="flex justify-between text-sm">
                  <span className="text-slate-400">{f.label}</span>
                  <span className="text-white ml-4 text-right max-w-[60%] break-words">{f.value}</span>
                </div>
              ) : null
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Categories &amp; Search</h2>
            {vendor.product_categories?.length ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {vendor.product_categories.map((c: string) => (
                  <span key={c} className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded">{c}</span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm mb-4">No categories</p>
            )}
            {vendor.keywords?.length ? (
              <div className="flex flex-wrap gap-2">
                {vendor.keywords.map((k: string) => (
                  <span key={k} className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">{k}</span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No keywords</p>
            )}
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Raw Data</h2>
            <pre className="text-xs text-slate-400 overflow-auto max-h-64 whitespace-pre-wrap font-mono bg-slate-900 p-3 rounded">
              {vendor.raw_data ? JSON.stringify(vendor.raw_data, null, 2) : 'No raw data'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

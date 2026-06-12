import { createAdminClient } from '@/lib/supabase/admin'
import PageHeader from '@/components/ui/page-header'
import DataTable from '@/components/ui/data-table'

export default async function SuppliersPage() {
  const supabase = createAdminClient()
  const { data: suppliers } = await supabase
    .from('suppliers')
    .select('id, name, contact_person, phone, city, gst')
    .order('name')

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'contact_person', label: 'Contact Person' },
    { key: 'phone', label: 'Phone' },
    { key: 'city', label: 'City' },
    { key: 'gst', label: 'GST', className: 'font-mono text-xs' },
  ]

  return (
    <>
      <PageHeader title="Suppliers" />
      <DataTable
        columns={columns}
        data={(suppliers as unknown as Record<string, unknown>[]) || []}
        searchable
        emptyMessage="No suppliers found."
      />
    </>
  )
}

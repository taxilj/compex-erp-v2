import { createAdminClient } from '@/lib/supabase/admin'
import PageHeader from '@/components/ui/page-header'
import DataTable from '@/components/ui/data-table'

export default async function CustomersPage() {
  const supabase = createAdminClient()
  const { data: customers } = await supabase
    .from('customers')
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
      <PageHeader title="Customers" />
      <DataTable
        columns={columns}
        data={(customers as unknown as Record<string, unknown>[]) || []}
        searchable
        emptyMessage="No customers found."
      />
    </>
  )
}

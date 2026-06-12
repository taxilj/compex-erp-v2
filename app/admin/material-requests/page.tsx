import { createAdminClient } from '@/lib/supabase/admin'
import PageHeader from '@/components/ui/page-header'
import MaterialRequestsTable from './material-requests-table'

export default async function MaterialRequestsPage() {
  const supabase = createAdminClient()

  const { data: mrs } = await supabase
    .from('material_requests')
    .select('*, suppliers(name)')
    .order('created_at', { ascending: false })

  return (
    <>
      <PageHeader title="Material Requests" />
      <MaterialRequestsTable data={(mrs as unknown as Record<string, unknown>[]) || []} />
    </>
  )
}

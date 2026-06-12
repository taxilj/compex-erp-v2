import { createAdminClient } from '@/lib/supabase/admin'
import PageHeader from '@/components/ui/page-header'
import GRNTable from './grn-table'

export default async function GRNPage() {
  const supabase = createAdminClient()

  const { data: grns } = await supabase
    .from('grn')
    .select('*, suppliers(name), purchase_orders(po_number)')
    .order('created_at', { ascending: false })

  return (
    <>
      <PageHeader title="Goods Receipt Notes" />
      <GRNTable data={(grns as unknown as Record<string, unknown>[]) || []} />
    </>
  )
}

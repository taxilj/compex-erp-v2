import { createAdminClient } from '@/lib/supabase/admin'
import PageHeader from '@/components/ui/page-header'
import ItemsTable from './items-table'

export default async function ItemsPage() {
  const supabase = createAdminClient()
  const { data: items } = await supabase
    .from('items')
    .select('id, item_code, item_name, item_group, stock_uom, hsn_code, is_stock_item, disabled')
    .order('item_name')

  return (
    <>
      <PageHeader title="Items" />
      <ItemsTable data={(items as unknown as Record<string, unknown>[]) || []} />
    </>
  )
}

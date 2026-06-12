import { createAdminClient } from '@/lib/supabase/admin'
import PageHeader from '@/components/ui/page-header'
import PurchaseOrdersTable from './purchase-orders-table'

export default async function PurchaseOrdersPage() {
  const supabase = createAdminClient()

  const { data: purchaseOrders } = await supabase
    .from('purchase_orders')
    .select('*, suppliers(name)')
    .order('created_at', { ascending: false })

  return (
    <>
      <PageHeader title="Purchase Orders" />
      <PurchaseOrdersTable
        data={
          (purchaseOrders as unknown as Record<string, unknown>[]) ||
          []
        }
      />
    </>
  )
}

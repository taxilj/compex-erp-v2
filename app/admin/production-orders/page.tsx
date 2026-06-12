import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import PageHeader from '@/components/ui/page-header'
import ProductionOrdersTable from './production-orders-table'

export default async function ProductionOrdersPage() {
  const supabase = createAdminClient()

  const { data: orders } = await supabase
    .from('production_orders')
    .select('*, items(name), bom_headers(bom_name)')
    .order('created_at', { ascending: false })

  return (
    <>
      <PageHeader
        title="Production Orders"
        action={
          <Link
            href="/admin/production-orders/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            + New Production Order
          </Link>
        }
      />
      <ProductionOrdersTable data={(orders as unknown as Record<string, unknown>[]) || []} />
    </>
  )
}

import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import PageHeader from '@/components/ui/page-header'
import SalesOrdersTable from './sales-orders-table'

export default async function SalesOrdersPage() {
  const supabase = createAdminClient()

  const { data: orders } = await supabase
    .from('sales_orders')
    .select('*, customers(name), quotations(quote_number)')
    .order('created_at', { ascending: false })

  return (
    <>
      <PageHeader
        title="Sales Orders"
        action={
          <Link
            href="/admin/sales-orders/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            + New Sales Order
          </Link>
        }
      />
      <SalesOrdersTable data={(orders as unknown as Record<string, unknown>[]) || []} />
    </>
  )
}

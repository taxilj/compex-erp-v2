import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import PageHeader from '@/components/ui/page-header'
import DeliveryNotesTable from './delivery-notes-table'

export default async function DeliveryNotesPage() {
  const supabase = createAdminClient()

  const { data: dns } = await supabase
    .from('delivery_notes')
    .select('*, customers(name), sales_orders(so_number)')
    .order('created_at', { ascending: false })

  return (
    <>
      <PageHeader
        title="Delivery Notes"
        action={
          <Link
            href="/admin/delivery-notes/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            + New Delivery Note
          </Link>
        }
      />
      <DeliveryNotesTable data={(dns as unknown as Record<string, unknown>[]) || []} />
    </>
  )
}

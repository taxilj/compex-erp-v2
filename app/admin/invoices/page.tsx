import { createAdminClient } from '@/lib/supabase/admin'
import PageHeader from '@/components/ui/page-header'
import InvoicesTable from './invoices-table'

export default async function InvoicesPage() {
  const supabase = createAdminClient()

  const { data: invoices } = await supabase
    .from('sales_invoices')
    .select('*, customers(name)')
    .order('created_at', { ascending: false })

  return (
    <>
      <PageHeader title="Invoices" />
      <InvoicesTable data={(invoices as unknown as Record<string, unknown>[]) || []} />
    </>
  )
}

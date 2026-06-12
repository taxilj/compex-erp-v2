import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import PageHeader from '@/components/ui/page-header'
import QuotationsTable from './quotations-table'

export default async function QuotationsPage() {
  const supabase = createAdminClient()

  const { data: quotations } = await supabase
    .from('quotations')
    .select('*, customers(name)')
    .order('created_at', { ascending: false })

  return (
    <>
      <PageHeader
        title="Quotations"
        action={
          <Link
            href="/admin/quotations/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            + New Quotation
          </Link>
        }
      />
      <QuotationsTable data={(quotations as unknown as Record<string, unknown>[]) || []} />
    </>
  )
}

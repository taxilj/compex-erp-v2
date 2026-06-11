import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { NewQuotationForm } from './form'

export default async function NewQuotationPage() {
  const supabase = createAdminClient()
  const { data: customers } = await supabase.from('customers').select('id, name').order('name')
  const { data: items } = await supabase.from('items').select('id, name, sku').order('name')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/quotations" className="text-sm text-slate-400 hover:text-white">&larr; Back</Link>
        <h1 className="text-xl font-semibold text-white">New Quotation</h1>
      </div>
      <NewQuotationForm customers={customers || []} items={items || []} />
    </div>
  )
}

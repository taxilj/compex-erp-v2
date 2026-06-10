import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { NewBomForm } from './form'

export default async function NewBomPage() {
  const supabase = createAdminClient()
  const { data: items } = await supabase.from('items').select('id, name, sku').order('name')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/bom" className="text-slate-400 hover:text-white text-sm">&larr; Back</Link>
        <h1 className="text-xl font-semibold text-white">New BOM</h1>
      </div>
      <NewBomForm items={items || []} />
    </div>
  )
}

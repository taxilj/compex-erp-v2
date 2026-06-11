'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProductionOrder(formData: FormData) {
  const supabase = createAdminClient()

  const bomHeaderId = Number(formData.get('bom_header_id'))
  const itemId = Number(formData.get('item_id'))
  const plannedQty = Number(formData.get('planned_qty')) || 0
  const startDate = formData.get('start_date') as string
  const endDate = formData.get('end_date') as string
  const notes = formData.get('notes') as string | null

  if (!bomHeaderId) throw new Error('BOM is required')
  if (!itemId) throw new Error('Item is required')
  if (!plannedQty || plannedQty <= 0) throw new Error('Planned qty must be greater than 0')

  const { count } = await supabase.from('production_orders').select('*', { count: 'exact', head: true })
  const nextNum = String((count || 0) + 1).padStart(3, '0')
  const poNumber = `PROD-${nextNum}`

  const { error } = await supabase.from('production_orders').insert({
    po_number: poNumber,
    bom_header_id: bomHeaderId,
    item_id: itemId,
    planned_qty: plannedQty,
    produced_qty: 0,
    start_date: startDate || null,
    end_date: endDate || null,
    status: 'Planned',
    notes,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/admin/production-orders')
  redirect('/admin/production-orders')
}

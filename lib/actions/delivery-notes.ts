'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createDeliveryNote(formData: FormData) {
  const supabase = createAdminClient()

  const customerId = Number(formData.get('customer_id'))
  const soId = formData.get('so_id') ? formData.get('so_id') as string : null
  const deliveryDate = formData.get('delivery_date') as string
  const notes = formData.get('notes') as string | null

  const itemIdsStr = formData.get('_item_ids') as string
  const soItemIdsStr = formData.get('_so_item_ids') as string
  const qtysStr = formData.get('_qtys') as string
  const remarksStr = formData.get('_remarks') as string

  const itemIds: number[] = JSON.parse(itemIdsStr || '[]')
  const soItemIds: (string | null)[] = JSON.parse(soItemIdsStr || '[]')
  const qtys: number[] = JSON.parse(qtysStr || '[]')
  const remarks: string[] = JSON.parse(remarksStr || '[]')

  if (!customerId) throw new Error('Customer is required')
  if (itemIds.length === 0) throw new Error('At least one item is required')

  const { count } = await supabase.from('delivery_notes').select('*', { count: 'exact', head: true })
  const nextNum = String((count || 0) + 1).padStart(3, '0')
  const dnNumber = `DN-${nextNum}`

  const { data: header, error: headerErr } = await supabase
    .from('delivery_notes')
    .insert({
      dn_number: dnNumber,
      so_id: soId || null,
      customer_id: customerId,
      delivery_date: deliveryDate || new Date().toISOString().split('T')[0],
      status: 'Draft',
      notes,
    })
    .select('id')
    .single()

  if (headerErr || !header) throw new Error(headerErr?.message || 'Failed to create delivery note')

  const dnItems = itemIds.map((itemId, i) => ({
    dn_id: header.id,
    so_item_id: soItemIds[i] || null,
    item_id: itemId,
    quantity: qtys[i] || 0,
    remarks: remarks[i] || null,
  }))

  const { error: itemsErr } = await supabase.from('dn_items').insert(dnItems)
  if (itemsErr) throw new Error(itemsErr.message)

  revalidatePath('/admin/delivery-notes')
  redirect('/admin/delivery-notes')
}

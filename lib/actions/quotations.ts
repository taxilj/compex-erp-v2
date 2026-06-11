'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createQuotation(formData: FormData) {
  const supabase = createAdminClient()

  const customerId = Number(formData.get('customer_id'))
  const quoteDate = formData.get('quote_date') as string
  const validUntil = formData.get('valid_until') as string
  const notes = formData.get('notes') as string | null

  const itemIdsStr = formData.get('_item_ids') as string
  const descriptionsStr = formData.get('_descriptions') as string
  const qtysStr = formData.get('_qtys') as string
  const ratesStr = formData.get('_rates') as string

  const itemIds: number[] = JSON.parse(itemIdsStr || '[]')
  const descriptions: string[] = JSON.parse(descriptionsStr || '[]')
  const qtys: number[] = JSON.parse(qtysStr || '[]')
  const rates: number[] = JSON.parse(ratesStr || '[]')

  if (!customerId) throw new Error('Customer is required')
  if (itemIds.length === 0) throw new Error('At least one item is required')

  const { count } = await supabase.from('quotations').select('*', { count: 'exact', head: true })
  const nextNum = String((count || 0) + 1).padStart(3, '0')
  const quoteNumber = `QOT-${nextNum}`

  let subtotal = 0
  const items = itemIds.map((itemId, i) => {
    const qty = qtys[i] || 1
    const rate = rates[i] || 0
    const amt = qty * rate
    subtotal += amt
    return { item_id: itemId, description: descriptions[i] || '', quantity: qty, rate, amount: amt }
  })

  const gstAmount = subtotal * 0.18
  const grandTotal = subtotal + gstAmount

  const { data: header, error: headerErr } = await supabase
    .from('quotations')
    .insert({
      quote_number: quoteNumber,
      customer_id: customerId,
      quote_date: quoteDate || new Date().toISOString().split('T')[0],
      valid_until: validUntil || null,
      status: 'Draft',
      subtotal,
      gst_amount: gstAmount,
      grand_total: grandTotal,
      notes,
    })
    .select('id')
    .single()

  if (headerErr || !header) throw new Error(headerErr?.message || 'Failed to create quotation')

  const { error: itemsErr } = await supabase.from('quotation_items').insert(
    items.map(i => ({ ...i, quotation_id: header.id }))
  )
  if (itemsErr) throw new Error(itemsErr.message)

  revalidatePath('/admin/quotations')
  redirect('/admin/quotations')
}

'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createBom(formData: FormData) {
  const supabase = createAdminClient()

  const finishedItemId = Number(formData.get('finished_item_id'))
  const quantity = Number(formData.get('quantity')) || 1
  const notes = formData.get('notes') as string | null

  const componentItemsStr = formData.get('_component_items') as string
  const componentQtysStr = formData.get('_component_qtys') as string
  const componentUnitsStr = formData.get('_component_units') as string
  const componentScrapStr = formData.get('_component_scrap') as string

  const componentItemIds: number[] = JSON.parse(componentItemsStr || '[]')
  const componentQtys: number[] = JSON.parse(componentQtysStr || '[]')
  const componentUnits: string[] = JSON.parse(componentUnitsStr || '[]')
  const componentScrapRates: number[] = JSON.parse(componentScrapStr || '[]')

  if (!finishedItemId) throw new Error('Finished item is required')
  if (componentItemIds.length === 0) throw new Error('At least one component is required')

  const { data: header, error: headerErr } = await supabase
    .from('bom_headers')
    .insert({ finished_item_id: finishedItemId, quantity, notes })
    .select('id')
    .single()

  if (headerErr || !header) throw new Error(headerErr?.message || 'Failed to create BOM')

  const bomItems = componentItemIds.map((itemId, i) => ({
    bom_header_id: header.id,
    component_item_id: itemId,
    component_qty: componentQtys[i] || 1,
    component_unit: componentUnits[i] || 'pcs',
    scrap_rate: componentScrapRates[i] || 0,
  }))

  const { error: itemsErr } = await supabase.from('bom_items').insert(bomItems)
  if (itemsErr) throw new Error(itemsErr.message)

  revalidatePath('/admin/bom')
  redirect('/admin/bom')
}

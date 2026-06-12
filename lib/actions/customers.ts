'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function createCustomer(formData: FormData) {
  const supabase = createAdminClient()

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const gst = formData.get('gst') as string
  const address = formData.get('address') as string
  const contactPerson = formData.get('contact_person') as string
  const city = formData.get('city') as string

  if (!name?.trim()) {
    return { success: false, customerId: null, error: 'Name is required' }
  }

  const { data, error } = await supabase
    .from('customers')
    .insert({
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      gst: gst?.trim() || null,
      address: address?.trim() || null,
      contact_person: contactPerson?.trim() || null,
      city: city?.trim() || null,
    })
    .select('id')
    .single()

  if (error) {
    return { success: false, customerId: null, error: error.message }
  }

  revalidatePath('/admin/customers')
  return { success: true, customerId: data.id, error: null }
}

export async function updateCustomer(id: number, formData: FormData) {
  const supabase = createAdminClient()

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const gst = formData.get('gst') as string
  const address = formData.get('address') as string
  const contactPerson = formData.get('contact_person') as string
  const city = formData.get('city') as string

  if (!name?.trim()) {
    return { success: false, error: 'Name is required' }
  }

  const { error } = await supabase
    .from('customers')
    .update({
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      gst: gst?.trim() || null,
      address: address?.trim() || null,
      contact_person: contactPerson?.trim() || null,
      city: city?.trim() || null,
    })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/customers')
  revalidatePath(`/admin/customers/${id}`)
  return { success: true, error: null }
}

export async function deleteCustomer(id: number) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/customers')
  return { success: true, error: null }
}

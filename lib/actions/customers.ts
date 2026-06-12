'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function createCustomer(formData: FormData) {
  const supabase = createAdminClient()

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const gst = formData.get('gst') as string
  const address = formData.get('address') as string

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
    })
    .select('id')
    .single()

  if (error) {
    return { success: false, customerId: null, error: error.message }
  }

  return { success: true, customerId: data.id, error: null }
}

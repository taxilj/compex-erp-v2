import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const transitions: Record<string, string[]> = {
  pending: ['validated', 'rejected'],
  validated: ['enriched', 'rejected'],
  enriched: [],
  rejected: ['pending'],
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { status: newStatus } = body

  if (!newStatus) {
    return NextResponse.json({ error: 'Missing status field' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: vendor } = await supabase
    .from('vendor_profiles')
    .select('status')
    .eq('id', id)
    .single()

  if (!vendor) {
    return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
  }

  const allowed = transitions[vendor.status] || []
  if (!allowed.includes(newStatus)) {
    return NextResponse.json(
      { error: `Cannot transition from '${vendor.status}' to '${newStatus}'. Allowed: ${allowed.join(', ') || 'none'}` },
      { status: 422 }
    )
  }

  const { error } = await supabase
    .from('vendor_profiles')
    .update({ status: newStatus })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id, status: newStatus })
}

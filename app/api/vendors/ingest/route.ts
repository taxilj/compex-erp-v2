import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'

function hashData(data: unknown): string {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { source, company_name, phone, email, contact_person, city, state, gstin, website, address, product_categories, keywords, raw_data } = body

    if (!source || !company_name) {
      return NextResponse.json({ error: 'Missing required fields: source, company_name' }, { status: 400 })
    }

    const validSources = ['tradeindia', 'indiamart', 'justdial', 'manual', 'api']
    if (!validSources.includes(source)) {
      return NextResponse.json({ error: `Invalid source. Must be one of: ${validSources.join(', ')}` }, { status: 400 })
    }

    const supabase = createAdminClient()
    const rawDataStr = raw_data || body
    const rawDataHash = hashData(rawDataStr)

    const { data: existing } = await supabase
      .from('vendor_profiles')
      .select('id, status')
      .eq('raw_data_hash', rawDataHash)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ id: existing.id, status: existing.status, duplicate: true }, { status: 200 })
    }

    const record: Record<string, unknown> = {
      source,
      company_name,
      raw_data: rawDataStr,
      raw_data_hash: rawDataHash,
      status: 'pending',
      phone: phone || null,
      email: email || null,
      contact_person: contact_person || null,
      city: city || null,
      state: state || null,
      gstin: gstin || null,
      website: website || null,
      address: address || null,
      product_categories: product_categories || null,
      keywords: keywords || null,
    }

    const { data, error } = await supabase
      .from('vendor_profiles')
      .insert(record)
      .select('id, company_name, source, status, created_at')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ...data, duplicate: false }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

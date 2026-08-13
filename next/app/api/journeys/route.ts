import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabaseServer'
import { sanitizeJourney } from '../../../../src/lib/sanitize'
import { validateJourney } from '../../../../src/lib/validate'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const sanitized = sanitizeJourney(body)
    const validation = validateJourney(sanitized)
    if (!validation.valid) return NextResponse.json({ error: validation.errors.join('; ') }, { status: 400 })

    const payload = { ...sanitized }
    const { data, error } = await supabaseAdmin.from('journeys').insert({ ...payload, published: payload.published ?? false }).select('id').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ id: data.id })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  const { data, error } = await supabaseAdmin.from('journeys').select('*').order('created_at', { ascending: false }).limit(limit)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

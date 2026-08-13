import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabaseServer'

const ASSET_BUCKET = 'journey-assets'

const UPLOAD_RULES: Record<string, { accept: string[]; maxBytes: number }> = {
  photos: { accept: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'], maxBytes: 6_000_000 },
  audio: { accept: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'], maxBytes: 12_000_000 },
  games: { accept: ['image/jpeg', 'image/png', 'image/webp'], maxBytes: 10_000_000 },
  surprise: { accept: ['image/jpeg', 'image/png', 'image/webp'], maxBytes: 8_000_000 },
}

function genId() {
  try {
    // @ts-ignore
    if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') return (crypto as any).randomUUID()
  } catch (e) {
    // ignore
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folder = String(formData.get('folder') || 'photos')

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const rule = UPLOAD_RULES[folder]
    if (rule) {
      if (!rule.accept.includes((file as any).type)) {
        return NextResponse.json({ error: `Upload rejected: ${(file as any).type} not allowed for folder ${folder}` }, { status: 400 })
      }
      if ((file as any).size > rule.maxBytes) {
        return NextResponse.json({ error: `Upload rejected: file too large (${(file as any).size} bytes) for folder ${folder}` }, { status: 400 })
      }
    }

    const ext = (file as any).name?.split('.').pop() || 'bin'
    const path = `${folder}/${genId()}.${ext}`

    // Upload using Supabase admin client
    const arrayBuffer = await (file as File).arrayBuffer()
    const uint8 = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await supabaseAdmin.storage.from(ASSET_BUCKET).upload(path, uint8, {
      contentType: (file as any).type,
      upsert: false,
      cacheControl: '3600',
    })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Create a signed URL valid for 1 hour
    const { data: urlData, error: urlError } = await supabaseAdmin.storage.from(ASSET_BUCKET).createSignedUrl(path, 60 * 60)
    if (urlError) return NextResponse.json({ error: urlError.message }, { status: 500 })

    return NextResponse.json({ url: urlData.signedUrl, path })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

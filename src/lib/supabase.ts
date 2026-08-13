import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Basic env validation so misconfiguration fails fast with a clear message
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
}

export const SUPABASE_CONFIGURED = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: { persistSession: false },
})

export const ASSET_BUCKET = 'journey-assets'

function genId() {
  // crypto.randomUUID() may not exist in older browsers/envs — fall back to timestamp+random
  try {
    // @ts-ignore
    if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') return (crypto as any).randomUUID()
  } catch (e) {
    // ignore
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const UPLOAD_RULES: Record<string, { accept: string[]; maxBytes: number }> = {
  photos: { accept: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'], maxBytes: 6_000_000 },
  audio: { accept: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'], maxBytes: 12_000_000 },
  games: { accept: ['image/jpeg', 'image/png', 'image/webp'], maxBytes: 10_000_000 },
  surprise: { accept: ['image/jpeg', 'image/png', 'image/webp'], maxBytes: 8_000_000 },
}

export async function uploadAsset(file: File, folder: string): Promise<string | null> {
  if (!SUPABASE_CONFIGURED) {
    console.error('Supabase is not configured. Cannot upload asset.')
    return null
  }

  const rule = UPLOAD_RULES[folder]
  if (rule) {
    if (!rule.accept.includes(file.type)) {
      console.error(`Upload rejected: ${file.type} not allowed for folder ${folder}`)
      return null
    }
    if (file.size > rule.maxBytes) {
      console.error(`Upload rejected: ${file.name} too large (${file.size} bytes) for folder ${folder}`)
      return null
    }
  }

  const ext = file.name.split('.').pop() || 'bin'
  const path = `${folder}/${genId()}.${ext}`
  try {
    const { error: uploadError } = await supabase.storage.from(ASSET_BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })
    if (uploadError) {
      console.error('Upload error:', uploadError.message)
      return null
    }

    const { data, error: urlError } = supabase.storage.from(ASSET_BUCKET).getPublicUrl(path)
    if (urlError) {
      console.error('Error getting public URL:', urlError.message)
      return null
    }
    return data.publicUrl
  } catch (err: any) {
    console.error('Upload exception:', err?.message ?? err)
    return null
  }
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
})

export const ASSET_BUCKET = 'journey-assets'

export async function uploadAsset(file: File, folder: string): Promise<string | null> {
  const ext = file.name.split('.').pop() || 'bin'
  const path = `${folder}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(ASSET_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) {
    console.error('Upload error:', error.message)
    return null
  }
  const { data } = supabase.storage.from(ASSET_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

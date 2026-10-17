import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(
  url &&
  anonKey &&
  url.startsWith('http') &&
  anonKey.length > 10 &&
  !url.includes('your-project-ref')
)

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum diatur di file .env.local. Mode pratinjau data lokal aktif.'
  )
}

// Fallback aman agar createClient tidak melempar error URL invalid jika belum diatur
const safeUrl = isSupabaseConfigured ? (url as string) : 'https://placeholder.supabase.co'
const safeAnonKey = isSupabaseConfigured ? (anonKey as string) : 'placeholder-anon-key'

export const supabase = createClient(safeUrl, safeAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

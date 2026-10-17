import { supabase, isSupabaseConfigured } from './supabase'
import { DEFAULT_SETTINGS } from './constants'
import type {
  Activity,
  ActivityPhoto,
  Announcement,
  ContactMessage,
  OrgPosition,
  OrgUnit,
  SiteSettings,
} from '../types'

/** 1. CMS Pengaturan Situs */
export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured) return DEFAULT_SETTINGS
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'main')
      .maybeSingle()

    if (error || !data) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...data }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Supabase belum diatur di .env.local')
  const { error } = await supabase
    .from('site_settings')
    .upsert({ id: 'main', ...settings, updated_at: new Date().toISOString() })

  if (error) throw error
}

/** 2. Struktur Organisasi */
export async function fetchOrgStructure(): Promise<{ units: OrgUnit[]; positions: OrgPosition[] }> {
  if (!isSupabaseConfigured) {
    return { units: [], positions: [] }
  }
  const [unitsRes, posRes] = await Promise.all([
    supabase.from('org_units').select('*').order('sort_order', { ascending: true }),
    supabase.from('org_positions').select('*').order('sort_order', { ascending: true }),
  ])

  if (unitsRes.error) throw unitsRes.error
  if (posRes.error) throw posRes.error

  return {
    units: (unitsRes.data ?? []) as OrgUnit[],
    positions: (posRes.data ?? []) as OrgPosition[],
  }
}

/** 3. Kegiatan & Galeri */
export async function fetchActivities(onlyPublished = true): Promise<Activity[]> {
  if (!isSupabaseConfigured) return []
  let query = supabase.from('activities').select('*').order('event_date', { ascending: false })
  if (onlyPublished) query = query.eq('is_published', true)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Activity[]
}

export async function fetchActivity(id: string): Promise<Activity | null> {
  if (!isSupabaseConfigured) return null
  const { data, error } = await supabase.from('activities').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data as Activity | null
}

export async function fetchActivityPhotos(activityId: string): Promise<ActivityPhoto[]> {
  if (!isSupabaseConfigured) return []
  const { data, error } = await supabase
    .from('activity_photos')
    .select('*')
    .eq('activity_id', activityId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as ActivityPhoto[]
}

/** 4. Pengumuman */
export async function fetchAnnouncements(limit?: number, onlyPublished = true): Promise<Announcement[]> {
  if (!isSupabaseConfigured) return []
  let query = supabase
    .from('announcements')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (onlyPublished) query = query.eq('is_published', true)
  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Announcement[]
}

/** 5. Pesan Kontak */
export async function submitContactMessage(form: {
  name: string
  email: string
  phone?: string
  message: string
}): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Supabase belum terhubung.')
  const { error } = await supabase.from('contact_messages').insert(form)
  if (error) throw error
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  if (!isSupabaseConfigured) return []
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as ContactMessage[]
}

/** 6. Penyimpanan Berkas & Gambar (Storage) */
export type Bucket = 'org-assets' | 'activity-photos'

export async function uploadFile(bucket: Bucket, file: File, folder: string) {
  if (!isSupabaseConfigured) throw new Error('Supabase belum diatur.')
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${folder}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '31536000',
    contentType: file.type,
  })

  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return { url: data.publicUrl, path }
}

export async function removeFiles(bucket: Bucket, paths: string[]) {
  if (!isSupabaseConfigured || paths.length === 0) return
  const { error } = await supabase.storage.from(bucket).remove(paths)
  if (error) throw error
}

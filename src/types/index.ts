export type OrgUnitCategory = 'advisor' | 'core' | 'division' | 'region'

export interface SiteSettings {
  id: string
  org_name: string
  org_tagline: string
  cabinet_name: string
  about_text: string
  vision: string
  missions: string[]
  stats: { value: string; label: string }[]
  pillars: { title: string; desc: string; icon: string }[]
  leader_welcome: {
    name: string
    title: string
    quote: string
    photo_url: string
  }
  contact_info: {
    address: string
    email: string
    whatsapp: string
    instagram: string
    maps_embed_url: string
  }
  documents: {
    title: string
    desc: string
    file_url: string
  }[]
  updated_at?: string
}

export interface OrgUnit {
  id: string
  name: string
  category: OrgUnitCategory
  parent_id: string | null
  sort_order: number
  created_at?: string
}

export interface OrgPosition {
  id: string
  unit_id: string
  title: string
  person_name: string | null
  subtitle: string | null
  photo_url: string | null
  social_link: string | null
  sort_order: number
  created_at?: string
}

export interface Activity {
  id: string
  title: string
  category: string
  description: string | null
  location: string | null
  event_date: string
  is_upcoming: boolean
  cover_url: string | null
  is_published: boolean
  created_at?: string
}

export interface ActivityPhoto {
  id: string
  activity_id: string
  photo_url: string
  storage_path: string
  caption: string | null
  created_at?: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  category: string
  is_pinned: boolean
  is_published: boolean
  file_url: string | null
  created_at?: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  is_read: boolean
  created_at: string
}

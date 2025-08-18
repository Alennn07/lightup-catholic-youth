import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

// Create a singleton Supabase client to prevent multiple instances
let supabaseClient: ReturnType<typeof createClient> | null = null

export const supabase = (() => {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }
  return supabaseClient
})()

// Database types
export interface User {
  id: string
  name: string
  email: string
  age: number
  parish: string
  diocese: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface PrayerRequest {
  id: number
  user_id: string
  name: string
  request: string
  category: string
  is_anonymous: boolean
  prayer_count: number
  created_at: string
  updated_at: string
  user?: User
}

export interface YouthGroup {
  id: number
  name: string
  parish: string
  address: string
  city: string
  age_range: string
  meeting_day: string
  meeting_time: string
  description: string
  contact_person: string
  contact_email: string
  contact_phone: string
  type: string[]
  members_count: number
  created_at: string
  updated_at: string
}

export interface Event {
  id: number
  title: string
  date: string
  start_time: string
  end_time: string
  location: string
  description: string
  category: string
  organizer: string
  group_id?: number
  user_id: string
  created_at: string
  updated_at: string
  youth_group?: YouthGroup
}

export interface JournalEntry {
  id: number
  user_id: string
  title: string
  content: string
  mood: string
  tags: string[]
  date: string
  created_at: string
  updated_at: string
}

export interface BibleVerse {
  id: number
  verse: string
  reference: string
  reflection: string
  date: string
  created_at: string
}

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for browser/client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Database types
export interface UserProfile {
  id: string
  name: string
  email: string
  age: number
  parish: string
  diocese: string
  avatar_url?: string
  bio?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  date_of_birth?: string
  gender?: "male" | "female" | "other" | "prefer_not_to_say"
  interests?: string[]
  spiritual_gifts?: string[]
  ministry_roles?: string[]
  is_active: boolean
  last_seen: string
  created_at: string
  updated_at: string
}

export interface PrayerRequest {
  id: number
  user_id: string
  name: string
  request: string
  category: "Health" | "Family" | "Education" | "Work" | "Spiritual" | "Relationships" | "Financial" | "Other"
  urgency: "low" | "normal" | "high" | "urgent"
  is_anonymous: boolean
  is_public: boolean
  prayer_count: number
  status: "active" | "answered" | "closed"
  answered_description?: string
  expires_at?: string
  created_at: string
  updated_at: string
  user?: UserProfile
}

export interface YouthGroup {
  id: number
  name: string
  parish: string
  address: string
  city: string
  state: string
  postal_code?: string
  age_range: string
  meeting_day: string
  meeting_time: string
  description: string
  contact_person: string
  contact_email: string
  contact_phone: string
  website_url?: string
  social_media?: Record<string, string>
  type: string[]
  activities?: string[]
  requirements?: string[]
  members_count: number
  max_capacity?: number
  is_active: boolean
  registration_open: boolean
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: number
  user_id: string
  group_id?: number
  title: string
  description: string
  event_type: "youth-mass" | "service" | "social" | "prayer" | "education" | "retreat" | "pilgrimage" | "other"
  date: string
  start_time: string
  end_time: string
  location: string
  address?: string
  city?: string
  max_attendees?: number
  current_attendees: number
  registration_required: boolean
  registration_deadline?: string
  cost: number
  organizer: string
  contact_email?: string
  contact_phone?: string
  requirements?: string[]
  what_to_bring?: string[]
  image_url?: string
  is_recurring: boolean
  recurrence_pattern?: Record<string, any>
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  created_at: string
  updated_at: string
  youth_group?: YouthGroup
}

export interface JournalEntry {
  id: number
  user_id: string
  title: string
  content: string
  mood:
    | "joyful"
    | "peaceful"
    | "grateful"
    | "hopeful"
    | "contemplative"
    | "struggling"
    | "anxious"
    | "sad"
    | "excited"
    | "blessed"
  spiritual_insights?: string
  prayer_requests?: string
  gratitude_list?: string[]
  scripture_references?: string[]
  tags: string[]
  is_private: boolean
  date: string
  weather?: string
  location?: string
  created_at: string
  updated_at: string
}

export interface BibleVerse {
  id: number
  verse: string
  reference: string
  translation: string
  reflection: string
  author: string
  theme?: string
  season?: string
  date: string
  image_url?: string
  audio_url?: string
  related_verses?: string[]
  discussion_questions?: string[]
  prayer_suggestion?: string
  created_at: string
}

export interface GroupMembership {
  id: number
  user_id: string
  group_id: number
  status: "pending" | "approved" | "rejected" | "left"
  role: "member" | "leader" | "coordinator" | "admin"
  joined_at: string
  approved_at?: string
  approved_by?: string
  notes?: string
}

export interface EventAttendee {
  id: number
  event_id: number
  user_id: string
  status: "registered" | "attended" | "no_show" | "cancelled"
  registration_date: string
  notes?: string
  dietary_requirements?: string
  emergency_contact?: string
}

export interface PrayerIntention {
  id: number
  user_id: string
  prayer_request_id: number
  prayed_at: string
  prayer_type: "general" | "rosary" | "novena" | "mass_intention" | "personal"
  duration_minutes?: number
  notes?: string
}

export interface Notification {
  id: number
  user_id: string
  title: string
  message: string
  type: "prayer_request" | "event" | "group" | "system" | "reminder"
  data: Record<string, any>
  is_read: boolean
  action_url?: string
  expires_at?: string
  created_at: string
}

export interface FeatureFeedback {
  id: number
  user_id?: string
  feature_id: string
  feedback_type: "bug" | "suggestion" | "compliment" | "question"
  title: string
  description: string
  rating?: number
  email?: string
  status: "pending" | "reviewed" | "in_progress" | "resolved" | "rejected"
  admin_response?: string
  created_at: string
  updated_at: string
}

export interface AppAnalytics {
  id: number
  user_id?: string
  event_type: string
  event_name: string
  page_path?: string
  feature_used?: string
  session_id?: string
  user_agent?: string
  ip_address?: string
  country?: string
  city?: string
  device_type?: string
  browser?: string
  os?: string
  referrer?: string
  duration_seconds?: number
  metadata: Record<string, any>
  created_at: string
}

// Helper functions for database operations
export const dbHelpers = {
  // User profile helpers
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return null
    }

    return data
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    const { error } = await supabase.from("users").update(updates).eq("id", userId)

    if (error) {
      console.error("Error updating user profile:", error)
      return false
    }

    return true
  },

  // Prayer request helpers
  async getPrayerRequests(filters?: {
    category?: string
    status?: string
    limit?: number
  }): Promise<PrayerRequest[]> {
    let query = supabase
      .from("prayer_requests")
      .select(`
        *,
        user:users(name, avatar_url)
      `)
      .eq("is_public", true)
      .order("created_at", { ascending: false })

    if (filters?.category) {
      query = query.eq("category", filters.category)
    }

    if (filters?.status) {
      query = query.eq("status", filters.status)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching prayer requests:", error)
      return []
    }

    return data || []
  },

  async incrementPrayerCount(requestId: number): Promise<boolean> {
    const { error } = await supabase.rpc("increment_prayer_count", {
      request_id: requestId,
    })

    if (error) {
      console.error("Error incrementing prayer count:", error)
      return false
    }

    return true
  },

  // Youth group helpers
  async getYouthGroups(filters?: {
    city?: string
    ageRange?: string
    type?: string
    search?: string
  }): Promise<YouthGroup[]> {
    let query = supabase.from("youth_groups").select("*").eq("is_active", true).order("name")

    if (filters?.city) {
      query = query.eq("city", filters.city)
    }

    if (filters?.ageRange) {
      query = query.eq("age_range", filters.ageRange)
    }

    if (filters?.type) {
      query = query.contains("type", [filters.type])
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,parish.ilike.%${filters.search}%,city.ilike.%${filters.search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching youth groups:", error)
      return []
    }

    return data || []
  },

  // Event helpers
  async getEvents(filters?: {
    date?: string
    category?: string
    userId?: string
    groupId?: number
  }): Promise<Event[]> {
    let query = supabase
      .from("events")
      .select(`
        *,
        youth_group:youth_groups(name, parish)
      `)
      .order("date", { ascending: true })

    if (filters?.date) {
      query = query.eq("date", filters.date)
    }

    if (filters?.category) {
      query = query.eq("event_type", filters.category)
    }

    if (filters?.userId) {
      query = query.eq("user_id", filters.userId)
    }

    if (filters?.groupId) {
      query = query.eq("group_id", filters.groupId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching events:", error)
      return []
    }

    return data || []
  },

  // Analytics helper
  async trackEvent(eventData: Partial<AppAnalytics>): Promise<boolean> {
    const { error } = await supabase.from("app_analytics").insert(eventData)

    if (error) {
      console.error("Error tracking event:", error)
      return false
    }

    return true
  },
}

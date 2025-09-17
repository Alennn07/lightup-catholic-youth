/**
 * Group Categories and Enhanced Features Types
 * Enterprise-level type definitions for Youth Groups
 */

export interface GroupCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface GroupInvitation {
  id: string
  group_id: string
  invitation_code: string
  invited_by: string
  invited_email?: string
  invited_user_id?: string
  message?: string
  expires_at: string
  used_at?: string
  used_by?: string
  is_active: boolean
  created_at: string
  group?: {
    id: string
    name: string
    description: string
    group_image_url?: string
  }
  inviter?: {
    id: string
    name: string
    email: string
  }
}

export interface GroupAnalytics {
  id: string
  group_id: string
  metric_type: 'views' | 'joins' | 'events_created' | 'posts_created' | 'activity_score' | 'member_engagement'
  metric_value: number
  metric_date: string
  additional_data?: Record<string, any>
  created_at: string
}

export interface GroupAnalyticsSummary {
  group_id: string
  total_views: number
  total_joins: number
  total_events: number
  total_posts: number
  activity_score: number
  member_engagement: number
  growth_rate: number
  popular_content: Array<{
    type: string
    title: string
    engagement: number
  }>
  recent_activity: Array<{
    type: string
    description: string
    timestamp: string
    user_name: string
  }>
  member_demographics: {
    age_groups: Record<string, number>
    locations: Record<string, number>
    join_sources: Record<string, number>
  }
}

export interface CreateInvitationData {
  group_id: string
  invited_email?: string
  message?: string
  expires_in_days?: number
}

export interface InvitationFormData {
  invited_email: string
  message: string
  expires_in_days: number
}

export interface GroupImageUpload {
  file: File
  alt_text: string
  group_id: string
}

export interface EnhancedYouthGroup extends YouthGroup {
  category?: GroupCategory
  group_image_url?: string
  group_image_alt?: string
  invitation_code?: string
  invitation_expires_at?: string
  is_invitation_only?: boolean
  analytics?: GroupAnalyticsSummary
  recent_invitations?: GroupInvitation[]
}

// Category management types
export interface CategoryFormData {
  name: string
  description: string
  icon: string
  color: string
  sort_order: number
}

export interface EditCategoryFormData extends CategoryFormData {
  id: string
  is_active: boolean
}

// Analytics filter types
export interface AnalyticsFilters {
  date_range: {
    start: string
    end: string
  }
  metric_types: string[]
  group_ids?: string[]
}

// Image upload types
export interface ImageUploadResult {
  success: boolean
  url?: string
  error?: string
  alt_text?: string
}

// Invitation management types
export interface InvitationStats {
  total_sent: number
  total_used: number
  pending: number
  expired: number
  conversion_rate: number
}

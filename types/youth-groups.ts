// Comprehensive TypeScript types for Youth Groups feature
// These types match the database schema and API responses

export interface GroupCategory {
  id: string
  name: string
  description?: string
  color: string
  icon?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface YouthGroup {
  id: string
  name: string
  description: string
  mission_statement?: string
  parish?: string
  diocese?: string
  city?: string
  state?: string
  country?: string
  meeting_location?: string
  meeting_time?: string
  meeting_frequency?: string
  age_range?: string
  max_members: number
  member_count?: number
  is_public: boolean
  is_active: boolean
  requires_approval: boolean
  owner_id: string
  created_by?: string
  created_at: string
  updated_at: string
  // Category information
  category_id?: string
  category?: GroupCategory
  // User-specific fields (added by API)
  is_owner?: boolean
  is_member?: boolean
  is_pending?: boolean
  user_role?: string
  user_status?: string
  // Related data (loaded separately)
  members?: GroupMember[]
  events?: GroupEvent[]
  posts?: GroupPost[]
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member'
  status: 'active' | 'pending' | 'inactive'
  joined_at: string
  // User profile data (enriched by API)
  email?: string
  name?: string
  user?: {
    id: string
    email: string
    name?: string
    username?: string
  }
}

export interface GroupJoinRequest {
  id: string
  group_id: string
  user_id: string
  status: 'pending' | 'approved' | 'rejected'
  message?: string
  requested_at: string
  reviewed_at?: string
  reviewed_by?: string
  review_message?: string
  // User profile data (enriched by API)
  user?: {
    id: string
    email: string
    name?: string
  }
}

export interface GroupEvent {
  id: string
  group_id: string
  title: string
  description?: string
  event_date: string
  event_time?: string
  location?: string
  max_attendees?: number
  is_public: boolean
  created_by: string
  created_at: string
  updated_at: string
  // User profile data (enriched by API)
  user?: {
    id: string
    email: string
    name?: string
  }
}

export interface GroupPost {
  id: string
  group_id: string
  user_id: string
  title?: string
  content: string
  post_type: 'general' | 'announcement' | 'prayer' | 'event' | 'discussion' | 'prayer_request' | 'event_reminder'
  is_pinned: boolean
  is_public: boolean
  created_at: string
  updated_at: string
  // User profile data (enriched by API)
  user?: {
    id: string
    email: string
    name?: string
  }
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  details?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form data types
export interface CreateGroupFormData {
  name: string
  description: string
  mission_statement?: string
  parish?: string
  diocese?: string
  city?: string
  state?: string
  country?: string
  meeting_location?: string
  meeting_time?: string
  meeting_frequency?: string
  age_range?: string
  max_members: number
  is_public: boolean
  requires_approval: boolean
  category_id?: string
}

export interface EditGroupFormData {
  name: string
  description: string
  mission_statement?: string
  meeting_time?: string
  meeting_location?: string
  age_range?: string
  max_members: string
  is_public: boolean
  requires_approval: boolean
  category_id?: string
}

export interface CreateEventFormData {
  title: string
  description: string
  date: string
  time: string
  location?: string
  maxAttendees?: string
}

export interface CreatePostFormData {
  title: string
  content: string
  type: 'announcement' | 'discussion' | 'prayer_request' | 'event_reminder'
}

// Filter and search types
export interface GroupFilters {
  search?: string
  category?: 'all' | 'my_groups' | 'public' | 'private'
  category_id?: string
  ageRange?: string
  location?: string
  page?: number
  limit?: number
}

// Permission types
export interface GroupPermissions {
  canCreateGroups: boolean
  canManageGroup: (groupId: string) => boolean
  canJoinGroup: (groupId: string) => boolean
  canCreateEvents: (groupId: string) => boolean
  canCreatePosts: (groupId: string) => boolean
  canManageMembers: (groupId: string) => boolean
}

// Statistics types
export interface GroupStatistics {
  totalGroups: number
  myGroups: number
  pendingRequests: number
  totalMembers: number
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: 'group_created' | 'member_joined' | 'event_created' | 'post_created'
  description: string
  timestamp: string
  user_id: string
  group_id: string
}

// Error types
export interface GroupError {
  code: string
  message: string
  details?: string
  field?: string
}

// Constants
export const GROUP_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member'
} as const

export const MEMBER_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  INACTIVE: 'inactive'
} as const

export const JOIN_REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const

export const POST_TYPES = {
  GENERAL: 'general',
  ANNOUNCEMENT: 'announcement',
  PRAYER: 'prayer',
  EVENT: 'event',
  DISCUSSION: 'discussion',
  PRAYER_REQUEST: 'prayer_request',
  EVENT_REMINDER: 'event_reminder'
} as const

export type GroupRole = typeof GROUP_ROLES[keyof typeof GROUP_ROLES]
export type MemberStatus = typeof MEMBER_STATUS[keyof typeof MEMBER_STATUS]
export type JoinRequestStatus = typeof JOIN_REQUEST_STATUS[keyof typeof JOIN_REQUEST_STATUS]
export type PostType = typeof POST_TYPES[keyof typeof POST_TYPES]

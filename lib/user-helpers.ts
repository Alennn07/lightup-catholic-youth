import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { 
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: 'public' }
  }
)

export interface UserProfile {
  id: string
  email: string
  user_metadata?: {
    name?: string
    avatar_url?: string
    [key: string]: any
  }
}

/**
 * Fetch user profile information by user ID
 * This function safely fetches user data from the auth schema
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data: { user }, error } = await supabase.auth.admin.getUserById(userId)
    
    if (error || !user) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return {
      id: user.id,
      email: user.email || '',
      user_metadata: user.user_metadata || {}
    }
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    return null
  }
}

/**
 * Fetch multiple user profiles by user IDs
 * This function efficiently fetches multiple user profiles
 */
export async function getUserProfiles(userIds: string[]): Promise<Record<string, UserProfile>> {
  const profiles: Record<string, UserProfile> = {}
  
  try {
    // Fetch all users in parallel
    const promises = userIds.map(async (userId) => {
      const profile = await getUserProfile(userId)
      if (profile) {
        profiles[userId] = profile
      }
    })
    
    await Promise.all(promises)
    return profiles
  } catch (error) {
    console.error('Error in getUserProfiles:', error)
    return profiles
  }
}

/**
 * Enrich members data with user profiles
 * This function adds user profile information to member objects
 */
export async function enrichMembersWithProfiles(members: any[]): Promise<any[]> {
  if (!members || members.length === 0) return members
  
  const userIds = members.map(member => member.user_id).filter(Boolean)
  const userProfiles = await getUserProfiles(userIds)
  
  return members.map(member => ({
    ...member,
    user: userProfiles[member.user_id] || null
  }))
}

/**
 * Enrich events data with user profiles
 * This function adds user profile information to event objects
 */
export async function enrichEventsWithProfiles(events: any[]): Promise<any[]> {
  if (!events || events.length === 0) return events
  
  const userIds = events.map(event => event.created_by).filter(Boolean)
  const userProfiles = await getUserProfiles(userIds)
  
  return events.map(event => ({
    ...event,
    user: userProfiles[event.created_by] || null
  }))
}

/**
 * Enrich posts data with user profiles
 * This function adds user profile information to post objects
 */
export async function enrichPostsWithProfiles(posts: any[]): Promise<any[]> {
  if (!posts || posts.length === 0) return posts
  
  const userIds = posts.map(post => post.user_id).filter(Boolean)
  const userProfiles = await getUserProfiles(userIds)
  
  return posts.map(post => ({
    ...post,
    user: userProfiles[post.user_id] || null
  }))
}

// User Service - Handles user creation and profile management
// This ensures users are properly created in the database during registration

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface CreateUserData {
  id: string
  email: string
  name?: string
  username?: string
  age?: number
  parish?: string
  diocese?: string
  bio?: string
  avatar_url?: string
}

export interface UserProfile {
  id: string
  email: string
  name: string
  username: string
  age?: number
  parish?: string
  diocese?: string
  bio?: string
  avatar_url?: string
  user_role: string
  can_create_groups: boolean
  is_group_leader: boolean
  created_at: string
  updated_at: string
  last_login?: string
  is_verified: boolean
  is_active: boolean
}

/**
 * Creates a user profile in the database
 * This should be called during user registration
 */
export async function createUserProfile(userData: CreateUserData): Promise<UserProfile> {
  try {
    console.log('👤 Creating user profile:', userData.id)
    
    // Generate username if not provided
    const username = userData.username || `user_${userData.id.slice(0, 8)}`
    
    // Create user profile data
    const profileData = {
      id: userData.id,
      email: userData.email,
      name: userData.name || userData.email.split('@')[0],
      username,
      age: userData.age || 18,
      parish: userData.parish || '',
      diocese: userData.diocese || '',
      bio: userData.bio || '',
      avatar_url: userData.avatar_url || '',
      user_role: 'member',
      can_create_groups: false,
      is_group_leader: false,
      is_verified: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Insert user profile
    const { data, error } = await supabase
      .from('users')
      .insert([profileData])
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating user profile:', error)
      throw new Error(`Failed to create user profile: ${error.message}`)
    }

    console.log('✅ User profile created successfully:', data.id)
    return data

  } catch (error: any) {
    console.error('❌ Error in createUserProfile:', error)
    throw error
  }
}

/**
 * Ensures a user profile exists in the database
 * This is a safe function that can be called multiple times
 */
export async function ensureUserProfile(userData: CreateUserData): Promise<UserProfile> {
  try {
    console.log('🔍 Ensuring user profile exists:', userData.id)
    
    // First, try to get existing user
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userData.id)
      .single()

    if (existingUser && !fetchError) {
      console.log('✅ User profile already exists:', existingUser.id)
      return existingUser
    }

    // If user doesn't exist, create it
    console.log('👤 User profile not found, creating new one...')
    return await createUserProfile(userData)

  } catch (error: any) {
    console.error('❌ Error in ensureUserProfile:', error)
    throw error
  }
}

/**
 * Updates user profile information
 */
export async function updateUserProfile(
  userId: string, 
  updates: Partial<CreateUserData>
): Promise<UserProfile> {
  try {
    console.log('🔄 Updating user profile:', userId)
    
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('❌ Error updating user profile:', error)
      throw new Error(`Failed to update user profile: ${error.message}`)
    }

    console.log('✅ User profile updated successfully:', data.id)
    return data

  } catch (error: any) {
    console.error('❌ Error in updateUserProfile:', error)
    throw error
  }
}

/**
 * Gets user profile by ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    console.log('🔍 Getting user profile:', userId)
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('👤 User profile not found:', userId)
        return null
      }
      console.error('❌ Error getting user profile:', error)
      throw new Error(`Failed to get user profile: ${error.message}`)
    }

    console.log('✅ User profile retrieved:', data.id)
    return data

  } catch (error: any) {
    console.error('❌ Error in getUserProfile:', error)
    throw error
  }
}

/**
 * Gets user profile by email
 */
export async function getUserProfileByEmail(email: string): Promise<UserProfile | null> {
  try {
    console.log('🔍 Getting user profile by email:', email)
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('👤 User profile not found for email:', email)
        return null
      }
      console.error('❌ Error getting user profile by email:', error)
      throw new Error(`Failed to get user profile: ${error.message}`)
    }

    console.log('✅ User profile retrieved by email:', data.id)
    return data

  } catch (error: any) {
    console.error('❌ Error in getUserProfileByEmail:', error)
    throw error
  }
}

/**
 * Updates user's last login timestamp
 */
export async function updateLastLogin(userId: string): Promise<void> {
  try {
    console.log('🔄 Updating last login for user:', userId)
    
    const { error } = await supabase
      .from('users')
      .update({
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('❌ Error updating last login:', error)
      throw new Error(`Failed to update last login: ${error.message}`)
    }

    console.log('✅ Last login updated for user:', userId)

  } catch (error: any) {
    console.error('❌ Error in updateLastLogin:', error)
    throw error
  }
}

/**
 * Grants group creation permissions to a user
 */
export async function grantGroupCreationPermissions(userId: string): Promise<void> {
  try {
    console.log('🔓 Granting group creation permissions to user:', userId)
    
    const { error } = await supabase
      .from('users')
      .update({
        can_create_groups: true,
        is_group_leader: true,
        user_role: 'group_leader',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('❌ Error granting group creation permissions:', error)
      throw new Error(`Failed to grant permissions: ${error.message}`)
    }

    console.log('✅ Group creation permissions granted to user:', userId)

  } catch (error: any) {
    console.error('❌ Error in grantGroupCreationPermissions:', error)
    throw error
  }
}

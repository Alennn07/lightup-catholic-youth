import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logIfEnabled, logPerformanceIfEnabled } from '@/lib/performance-monitor'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now()
  
  try {
    logIfEnabled(`🚀 GET /api/youth-groups/[id] - Starting request for group: ${params.id}`)
    
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create Supabase client with optimized settings
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { 
        auth: { autoRefreshToken: false, persistSession: false },
        db: { schema: 'public' }
      }
    )

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // 🚀 OPTIMIZED: Single efficient query for group details
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('id, name, description, mission_statement, parish, diocese, city, state, country, meeting_location, meeting_time, meeting_frequency, age_range, max_members, is_public, is_active, owner_id, created_at, updated_at')
      .eq('id', params.id)
      .eq('is_active', true)
      .single()

    if (groupError || !group) {
      logIfEnabled(`❌ Error fetching group: ${groupError?.message || 'Group not found'}`, 'error')
      return NextResponse.json({ 
        error: 'Group not found or access denied',
        details: groupError?.message || 'Group does not exist'
      }, { status: 404 })
    }

    // 🚀 OPTIMIZED: Parallel queries for maximum performance
    const [membersResult, eventsResult, postsResult, memberCountResult] = await Promise.all([
      // Get group members with minimal data
      supabase
        .from('group_members')
        .select('id, group_id, user_id, role, status, joined_at')
        .eq('group_id', params.id)
        .eq('status', 'active')
        .order('joined_at', { ascending: true }),

      // Get upcoming events only (limit to 5)
      supabase
        .from('group_events')
        .select('id, title, description, event_date, location, max_attendees, is_public, created_by, created_at')
        .eq('group_id', params.id)
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true })
        .limit(5),

      // Get recent posts only (limit to 10)
      supabase
        .from('group_posts')
        .select('id, title, content, post_type, is_public, user_id, created_at')
        .eq('group_id', params.id)
        .order('created_at', { ascending: false })
        .limit(10),

      // Get member count efficiently
      supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', params.id)
        .eq('status', 'active')
    ])

    // Process results efficiently
    const members: any[] = membersResult.data || []
    const events = eventsResult.data || []
    const posts = postsResult.data || []
    const memberCount = memberCountResult.count || 0

    // 🚀 OPTIMIZED: Batch fetch user profiles in single query
    const allUserIds = new Set<string>()
    members.forEach(member => allUserIds.add(member.user_id))
    posts.forEach(post => allUserIds.add(post.user_id))
    events.forEach(event => allUserIds.add(event.created_by))
    
    if (allUserIds.size > 0) {
      const userIdsArray = Array.from(allUserIds)
      const { data: userProfiles } = await supabase
        .from('users')
        .select('id, email, name, username, user_metadata')
        .in('id', userIdsArray)
      
      if (userProfiles) {
        // Create lookup map for O(1) user profile access
        const userProfileMap = new Map(
          userProfiles.map(profile => [profile.id, profile])
        )
        
        // Merge user profiles efficiently
        members.forEach((member: any) => {
          const userProfile = userProfileMap.get(member.user_id)
          member.user = userProfile || { id: member.user_id, email: null, name: null, username: null, user_metadata: {} }
        })
        
        posts.forEach((post: any) => {
          const userProfile = userProfileMap.get(post.user_id)
          post.user = userProfile || { id: post.user_id, email: null, name: null, username: null, user_metadata: {} }
        })
        
        events.forEach((event: any) => {
          const userProfile = userProfileMap.get(event.created_by)
          event.user = userProfile || { id: event.created_by, email: null, name: null, username: null, user_metadata: {} }
        })
      }
    }

    // Check user membership efficiently
    const userMembership = members.find((member: any) => member.user_id === user.id)
    const isMember = !!userMembership || group.owner_id === user.id
    const userRole = userMembership?.role || (group.owner_id === user.id ? 'owner' : null)
    
    // Ensure owner is in members list
    if (group.owner_id === user.id && !userMembership) {
      const ownerProfile = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || 'Unknown',
        username: user.user_metadata?.username || 'unknown',
        user_metadata: user.user_metadata || {}
      }
      
      members.push({
        id: `temp-owner-${Date.now()}`,
        group_id: params.id,
        user_id: user.id,
        role: 'owner',
        status: 'active',
        joined_at: new Date().toISOString(),
        user: ownerProfile
      })
    }

    // Build the complete group object
    const completeGroup = {
      ...group,
      members,
      events,
      posts,
      member_count: memberCount,
      is_member: isMember,
      user_role: userRole,
      is_owner: group.owner_id === user.id
    }

    const endTime = Date.now()
    const totalDuration = endTime - startTime
    logPerformanceIfEnabled('Youth Group Details API - GET', totalDuration)
    
    logIfEnabled(`✅ Group details loaded successfully in ${totalDuration}ms: ${members.length} members, ${events.length} events, ${posts.length} posts`)
    
    // Add cache headers for better performance
    const response = NextResponse.json({ group: completeGroup })
    response.headers.set('Cache-Control', 'private, max-age=60') // Cache for 1 minute
    
    return response

  } catch (error: any) {
    const endTime = Date.now()
    const totalDuration = endTime - startTime
    
    logIfEnabled(`❌ Error in Youth Group Details API after ${totalDuration}ms: ${error.message || 'Unknown error'}`, 'error')
    logPerformanceIfEnabled('Youth Group Details API - Error', totalDuration)
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🚀 PUT /api/youth-groups/[id] - Starting request for group:', params.id)
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      console.log('❌ No authorization token provided')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create Supabase client with service role key
    let supabase: any
    try {
      supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )
      console.log('✅ Supabase client created successfully')
    } catch (clientError: any) {
      console.error('❌ Error creating Supabase client:', clientError)
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    // Verify user token
    let user: any
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !authUser) {
        console.log('❌ Auth error:', authError)
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }
      user = authUser
      console.log('✅ User authenticated:', user.id)
    } catch (authError: any) {
      console.error('❌ Error verifying user:', authError)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }

    // Check if user is the owner of the group
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('owner_id')
      .eq('id', params.id)
      .single()

    if (groupError || !group) {
      console.error('❌ Group not found:', groupError)
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    if (group.owner_id !== user.id) {
      console.log('❌ User is not the owner of this group')
      return NextResponse.json({ error: 'Only group owners can update groups' }, { status: 403 })
    }

    // Get request body
    const body = await request.json()
    const { name, description, mission_statement, parish, diocese, city, state, country, meeting_location, meeting_time, meeting_frequency, age_range, max_members, is_public } = body

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required' }, { status: 400 })
    }

    // Update the group
    const { data: updatedGroup, error: updateError } = await supabase
      .from('youth_groups')
      .update({
        name,
        description,
        mission_statement,
        parish,
        diocese,
        city,
        state,
        country,
        meeting_location,
        meeting_time,
        meeting_frequency,
        age_range,
        max_members: max_members || 50,
        is_public: is_public !== undefined ? is_public : true
      })
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Error updating group:', updateError)
      return NextResponse.json({ error: 'Failed to update group' }, { status: 500 })
    }

    console.log('✅ Group updated successfully')
    return NextResponse.json({ group: updatedGroup, message: 'Group updated successfully' })

  } catch (error: any) {
    console.error('❌ Unexpected error in PUT /api/youth-groups/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🚀 DELETE /api/youth-groups/[id] - Starting request for group:', params.id)
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      console.log('❌ No authorization token provided')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create Supabase client with service role key
    let supabase: any
    try {
      supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )
      console.log('✅ Supabase client created successfully')
    } catch (clientError: any) {
      console.error('❌ Error creating Supabase client:', clientError)
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    // Verify user token
    let user: any
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !authUser) {
        console.log('❌ Auth error:', authError)
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }
      user = authUser
      console.log('✅ User authenticated:', user.id)
    } catch (authError: any) {
      console.error('❌ Error verifying user:', authError)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }

    // Check if user is the owner of the group
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('owner_id')
      .eq('id', params.id)
      .single()

    if (groupError || !group) {
      console.error('❌ Group not found:', groupError)
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    if (group.owner_id !== user.id) {
      console.log('❌ User is not the owner of this group')
      return NextResponse.json({ error: 'Only group owners can delete groups' }, { status: 403 })
    }

    // Delete the group (cascade will handle related records)
    const { error: deleteError } = await supabase
      .from('youth_groups')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('❌ Error deleting group:', deleteError)
      return NextResponse.json({ error: 'Failed to delete group' }, { status: 500 })
    }

    console.log('✅ Group deleted successfully')
    return NextResponse.json({ message: 'Group deleted successfully' })

  } catch (error: any) {
    console.error('❌ Unexpected error in DELETE /api/youth-groups/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

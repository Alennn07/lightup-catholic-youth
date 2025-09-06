import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GET /api/youth-groups - Starting request')
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Simple query without user-specific data
    const { data: groups, error: groupsError } = await supabase
      .from('youth_groups')
      .select(`
        id, 
        name, 
        description, 
        parish, 
        city, 
        state, 
        country, 
        meeting_time, 
        age_range, 
        max_members, 
        is_public, 
        is_active, 
        owner_id, 
        requires_approval,
        created_at
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(50)

    if (groupsError) {
      console.error(`❌ Error fetching groups: ${groupsError.message}`, groupsError)
      return NextResponse.json({ 
        error: 'Failed to fetch groups',
        details: groupsError.message 
      }, { status: 500 })
    }

    console.log(`✅ Found ${groups?.length || 0} groups`)

    // Get user from token if available
    let currentUserId = null
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (token) {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)
        if (!authError && user) {
          currentUserId = user.id
        }
      } catch (error) {
        console.log('Auth error in middleware:', error)
      }
    }

    // Get user's membership and pending status for all groups
    let userMemberships: any[] = []
    let userPendingRequests: any[] = []
    
    if (currentUserId) {
      console.log('🔍 Checking membership status for user:', currentUserId)
      
      // Get user's memberships
      const { data: memberships } = await supabase
        .from('group_members')
        .select('group_id, role, status')
        .eq('user_id', currentUserId)
        .eq('status', 'active')
      
      // Get user's pending join requests
      const { data: pendingRequests } = await supabase
        .from('group_join_requests')
        .select('group_id, status')
        .eq('user_id', currentUserId)
        .eq('status', 'pending')
      
      userMemberships = memberships || []
      userPendingRequests = pendingRequests || []
      
      console.log('📊 User memberships:', userMemberships.length)
      console.log('⏳ User pending requests:', userPendingRequests.length)
      console.log('📋 Pending group IDs:', userPendingRequests.map(p => p.group_id))
    }

    // Add user info based on current user
    const groupsWithUserInfo = (groups || []).map(group => {
      const membership = userMemberships.find(m => m.group_id === group.id)
      const pendingRequest = userPendingRequests.find(p => p.group_id === group.id)
      
      const groupInfo = {
        ...group,
        is_owner: currentUserId ? group.owner_id === currentUserId : false,
        is_member: Boolean(membership),
        is_pending: Boolean(pendingRequest),
        user_role: membership?.role || (currentUserId && group.owner_id === currentUserId ? 'owner' : 'none')
      }
      
      // Debug logging for each group
      if (currentUserId) {
        console.log(`🔍 Group: ${group.name}`, {
          is_owner: groupInfo.is_owner,
          is_member: groupInfo.is_member,
          is_pending: groupInfo.is_pending,
          hasMembership: !!membership,
          hasPendingRequest: !!pendingRequest
        })
      }
      
      return groupInfo
    })

    return NextResponse.json({ 
      groups: groupsWithUserInfo,
      total: groupsWithUserInfo.length
    })

  } catch (error: any) {
    console.error(`❌ Error in Youth Groups API:`, error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message || 'Unknown error occurred'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/youth-groups - Starting request')
    
    const body = await request.json()
    const { name, description, parish, city, state, country, meeting_time, age_range, max_members, is_public, requires_approval } = body

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get user from token
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Create group
    const { data: group, error: createError } = await supabase
      .from('youth_groups')
      .insert([{
        name,
        description,
        parish,
        city,
        state,
        country,
        meeting_time,
        age_range,
        max_members: max_members || 50,
        is_public: is_public !== false,
        is_active: true,
        owner_id: user.id,
        requires_approval: requires_approval !== false
      }])
      .select()
      .single()

    if (createError) {
      console.error('❌ Error creating group:', createError)
      return NextResponse.json({ 
        error: 'Failed to create group',
        details: createError.message 
      }, { status: 500 })
    }

    // Add the creator as an owner member
    const { error: memberError } = await supabase
      .from('group_members')
      .insert([{
        group_id: group.id,
        user_id: user.id,
        role: 'owner',
        status: 'active'
      }])

    if (memberError) {
      console.error('❌ Error adding owner as member:', memberError)
      // Don't fail the whole request, just log the error
    }

    console.log('✅ Group created successfully:', group.id)
    return NextResponse.json({ group })

  } catch (error: any) {
    console.error('❌ Unexpected error in POST /api/youth-groups:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message || 'Unknown error occurred'
    }, { status: 500 })
  }
}
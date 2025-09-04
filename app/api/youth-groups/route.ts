import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logIfEnabled, logPerformanceIfEnabled } from '@/lib/performance-monitor'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    logIfEnabled('🚀 GET /api/youth-groups - Starting request')
    
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    // Create Supabase client with service role key (bypasses RLS for now)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { 
        auth: { autoRefreshToken: false, persistSession: false },
        db: { schema: 'public' }
      }
    )

    // If token is provided, verify it, otherwise use service role
    if (token) {
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        console.log('⚠️ Invalid token, using service role for now')
      }
    } else {
      console.log('⚠️ No token provided, using service role')
    }

    // 🚀 OPTIMIZED: Single efficient query with proper indexing
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
        member_count,
        created_at
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(50) // Increased limit for better UX

    if (groupsError) {
      logIfEnabled(`❌ Error fetching groups: ${groupsError.message}`, 'error')
      return NextResponse.json({ 
        error: 'Failed to fetch groups',
        details: groupsError.message 
      }, { status: 500 })
    }

    if (!groups || groups.length === 0) {
      const endTime = Date.now()
      const totalDuration = endTime - startTime
      logPerformanceIfEnabled('Youth Groups API - Empty Result', totalDuration)
      
      return NextResponse.json({ groups: [] })
    }

    // 🚀 OPTIMIZED: Batch fetch user memberships and pending requests
    const [membershipsResult, pendingRequestsResult] = await Promise.all([
      supabase
        .from('youth_group_members')
        .select('group_id, role, status')
        .eq('user_id', user.id)
        .eq('status', 'active'),
      supabase
        .from('group_join_requests')
        .select('group_id, status')
        .eq('user_id', user.id)
        .eq('status', 'pending')
    ])

    const userMemberships = membershipsResult.data || []
    const pendingRequests = pendingRequestsResult.data || []

    // Create lookup maps for O(1) checks
    const membershipMap = new Map(
      userMemberships.map(member => [member.group_id, member])
    )
    const pendingMap = new Map(
      pendingRequests.map(request => [request.group_id, request])
    )

    // 🚀 FAST PROCESSING: Process groups with membership info
    const groupsWithInfo = groups.map((group) => {
      const membership = membershipMap.get(group.id)
      const pendingRequest = pendingMap.get(group.id)
      const isOwner = group.owner_id === user.id
      
      return {
        ...group,
        user_role: membership?.role || null,
        user_status: membership?.status || null,
        is_member: isOwner || !!membership,
        is_owner: isOwner,
        is_pending: !!pendingRequest
      }
    })

    const endTime = Date.now()
    const totalDuration = endTime - startTime
    logPerformanceIfEnabled('Youth Groups API - GET', totalDuration)
    
    logIfEnabled(`✅ Youth groups fetched successfully in ${totalDuration}ms: ${groupsWithInfo.length} groups`)
    
    // Add cache headers for better performance
    const response = NextResponse.json({ 
      groups: groupsWithInfo,
      loadTime: `${totalDuration}ms`
    })
    
    // Cache for 2 minutes to reduce repeated API calls
    response.headers.set('Cache-Control', 'private, max-age=120')
    
    return response

  } catch (error: any) {
    const endTime = Date.now()
    const totalDuration = endTime - startTime
    
    logIfEnabled(`❌ Error in Youth Groups API after ${totalDuration}ms: ${error.message || 'Unknown error'}`, 'error')
    logPerformanceIfEnabled('Youth Groups API - Error', totalDuration)
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message || 'Unknown error occurred'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/youth-groups - Starting request')
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token) {
      console.log('❌ No authorization token provided')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      console.log('❌ Auth error:', authError)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    console.log('📝 Request body:', body)

    // Create the group
    const { data: group, error: createError } = await supabase
      .from('youth_groups')
      .insert([{
        name: body.name,
        description: body.description,
        mission_statement: body.mission_statement,
        parish: body.parish,
        diocese: body.diocese,
        city: body.city,
        state: body.state,
        country: body.country,
        meeting_location: body.meeting_location,
        meeting_time: body.meeting_time,
        meeting_frequency: body.meeting_frequency,
        age_range: body.age_range,
        max_members: body.max_members || 50,
        is_public: body.is_public !== undefined ? body.is_public : true,
        owner_id: user.id
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

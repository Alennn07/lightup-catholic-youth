import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limiter'
import { createSuccessResponse, createErrorResponse, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/api-response'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GET /api/youth-groups - Starting request')
    console.log('🔍 Request URL:', request.url)
    console.log('🔍 Request headers:', Object.fromEntries(request.headers.entries()))
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

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
        console.log('Auth error:', error)
      }
    }

    // Run ALL queries concurrently for maximum speed
    const [groupsResult, membershipsResult, pendingRequestsResult] = await Promise.all([
      // Main groups query
      supabase
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
          category_id,
          created_at,
          group_categories (
            id,
            name,
            description,
            color,
            icon
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(50),

      // User memberships (only if user exists)
      currentUserId ? supabase
        .from('group_members')
        .select('group_id, role, status')
        .eq('user_id', currentUserId)
        .eq('status', 'active') : Promise.resolve({ data: [] }),
     
      // User pending requests (only if user exists)
      currentUserId ? supabase
        .from('group_join_requests')
        .select('group_id, status')
        .eq('user_id', currentUserId)
        .eq('status', 'pending') : Promise.resolve({ data: [] })
    ])

    if (groupsResult.error) {
      console.error(`❌ Error fetching groups: ${groupsResult.error.message}`)
      return NextResponse.json(createErrorResponse(
        'Failed to fetch groups',
        groupsResult.error.message
      ), { status: 500 })
    }

    const groups = groupsResult.data || []
    const userMemberships = membershipsResult.data || []
    const userPendingRequests = pendingRequestsResult.data || []

    console.log(`✅ Found ${groups.length} groups from database`)
    console.log('🔍 Groups from DB:', groups.map(g => ({ id: g.id, name: g.name })))

    // Add user info based on current user
    const groupsWithUserInfo = groups.map(group => {
      const membership = userMemberships.find(m => m.group_id === group.id)
      const pendingRequest = userPendingRequests.find(p => p.group_id === group.id)
     
      return {
        ...group,
        category: group.group_categories || null,
        is_owner: currentUserId ? group.owner_id === currentUserId : false,
        is_member: !!membership,
        is_pending: !!pendingRequest,
        user_role: membership?.role || (currentUserId && group.owner_id === currentUserId ? 'owner' : 'none')
      }
    })

    return NextResponse.json(createSuccessResponse(
      groupsWithUserInfo,
      `Found ${groupsWithUserInfo.length} groups`,
      {
        page: 1,
        limit: 50,
        total: groupsWithUserInfo.length,
        totalPages: 1
      }
    ), {
      headers: {
        'Cache-Control': 'public, max-age=300', // 5 minutes cache
        'CDN-Cache-Control': 'max-age=300'
      }
    })

  } catch (error: any) {
    console.error(`❌ Error in Youth Groups API:`, error)
    return NextResponse.json(createErrorResponse(
      ERROR_MESSAGES.INTERNAL_ERROR,
      error.message || 'Unknown error occurred'
    ), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/youth-groups - Starting request')
    
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const rateLimit = await checkRateLimit(ip, 'GENERAL_API', ip)
    
    if (!rateLimit.allowed) {
      console.log('❌ Rate limit exceeded for youth group creation')
      return NextResponse.json(
        { error: 'Too many requests. Please wait before creating another group.' },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime)
        }
      )
    }
    
    const body = await request.json()
    const { name, description, parish, city, state, country, meeting_time, age_range, max_members, is_public, requires_approval, category_id } = body

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get user from token
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED), { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(createErrorResponse(ERROR_MESSAGES.INVALID_TOKEN), { status: 401 })
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
        requires_approval: requires_approval !== false,
        category_id: category_id || null
      }])
      .select()
      .single()

    if (createError) {
      console.error('❌ Error creating group:', createError)
      return NextResponse.json(createErrorResponse(
        'Failed to create group',
        createError.message
      ), { status: 500 })
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
    return NextResponse.json(createSuccessResponse(
      group,
      SUCCESS_MESSAGES.GROUP_CREATED
    ))

  } catch (error: any) {
    console.error('❌ Unexpected error in POST /api/youth-groups:', error)
    return NextResponse.json(createErrorResponse(
      ERROR_MESSAGES.INTERNAL_ERROR,
      error.message || 'Unknown error occurred'
    ), { status: 500 })
  }
}
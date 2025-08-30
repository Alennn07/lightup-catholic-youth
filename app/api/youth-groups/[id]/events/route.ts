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
    logIfEnabled(`🚀 GET /api/youth-groups/[id]/events - Starting request for group: ${params.id}`)
    
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

    // 🚀 OPTIMIZED: Check membership and fetch events in parallel
    const [membershipResult, eventsResult] = await Promise.all([
      supabase
        .from('group_members')
        .select('role, status')
        .eq('group_id', params.id)
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('group_events')
        .select('id, title, description, event_date, location, max_attendees, is_public, created_by, created_at')
        .eq('group_id', params.id)
        .order('event_date', { ascending: true })
        .limit(20) // Limit to prevent excessive data
    ])

    const membership = membershipResult.data
    if (!membership || membership.status !== 'active') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (eventsResult.error) {
      logIfEnabled(`❌ Error fetching events: ${eventsResult.error.message}`, 'error')
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
    }

    const endTime = Date.now()
    const totalDuration = endTime - startTime
    logPerformanceIfEnabled('Youth Groups Events API - GET', totalDuration)
    
    logIfEnabled(`✅ Successfully fetched ${eventsResult.data?.length || 0} events in ${totalDuration}ms`)
    
    // Add cache headers for better performance
    const response = NextResponse.json({ events: eventsResult.data || [] })
    response.headers.set('Cache-Control', 'private, max-age=60') // Cache for 1 minute
    
    return response

  } catch (error: any) {
    const endTime = Date.now()
    const totalDuration = endTime - startTime
    
    logIfEnabled(`❌ Error in Youth Groups Events API after ${totalDuration}ms: ${error.message || 'Unknown error'}`, 'error')
    logPerformanceIfEnabled('Youth Groups Events API - Error', totalDuration)
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🚀 POST /api/youth-groups/[id]/events - Starting request for group:', params.id)
    
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

    // Check if user is a member of this group
    const { data: membership } = await supabase
      .from('group_members')
      .select('role, status')
      .eq('group_id', params.id)
      .eq('user_id', user.id)
      .single()

    if (!membership || membership.status !== 'active') {
      console.log('❌ User is not a member of this group')
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const body = await request.json()
    console.log('📝 Request body:', body)

    // Validate required fields
    if (!body.title || !body.description || !body.event_date) {
      return NextResponse.json({ error: 'Title, description, and event date are required' }, { status: 400 })
    }

    // Create the event
    const { data: event, error: createError } = await supabase
      .from('group_events')
      .insert([{
        group_id: params.id,
        title: body.title,
        description: body.description,
        event_date: body.event_date,
        location: body.location || null,
        max_attendees: body.max_attendees || 50,
        is_public: body.is_public || false,
        created_by: user.id
      }])
      .select()
      .single()

    if (createError) {
      console.error('❌ Error creating event:', createError)
      return NextResponse.json({ 
        error: 'Failed to create event',
        details: createError.message 
      }, { status: 500 })
    }

    console.log('✅ Event created successfully:', event.id)
    return NextResponse.json({ 
      event,
      message: 'Event created successfully' 
    }, { status: 201 })

  } catch (error: any) {
    console.error('❌ Unexpected error in POST /api/youth-groups/[id]/events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

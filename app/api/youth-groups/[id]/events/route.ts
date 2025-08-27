import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🚀 GET /api/youth-groups/[id]/events - Starting request for group:', params.id)
    
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

    // Get group events
    const { data: events, error: eventsError } = await supabase
      .from('group_events')
      .select('*')
      .eq('group_id', params.id)
      .order('event_date', { ascending: true })

    if (eventsError) {
      console.error('❌ Error fetching events:', eventsError)
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
    }

    console.log('✅ Successfully fetched events')
    return NextResponse.json({ events: events || [] })

  } catch (error: any) {
    console.error('❌ Unexpected error in GET /api/youth-groups/[id]/events:', error)
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

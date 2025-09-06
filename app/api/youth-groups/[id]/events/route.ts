import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logIfEnabled } from '@/lib/performance-monitor'
import { enrichEventsWithProfiles } from '@/lib/user-helpers'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: groupId } = params
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    logIfEnabled(`🔍 GET /api/youth-groups/${groupId}/events - Token: ${token ? 'Present' : 'None'}`)

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

    // Check if user is group owner or member
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select('role, status')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single()

    // Also check if user is group owner
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('owner_id')
      .eq('id', groupId)
      .single()

    const isOwner = group && group.owner_id === user.id
    const isMember = membership && membership.status === 'active'

    if (!isOwner && !isMember) {
      console.log('❌ Access denied - User is neither owner nor member:', {
        userId: user.id,
        groupId,
        isOwner,
        isMember,
        membershipError: membershipError?.message,
        groupError: groupError?.message
      })
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get all group events
    const { data: events, error: eventsError } = await supabase
      .from('group_events')
      .select(`
        id,
        title,
        description,
        event_date,
        location,
        max_attendees,
        is_public,
        created_at,
        created_by
      `)
      .eq('group_id', groupId)
      .order('event_date', { ascending: true })

    if (eventsError) {
      logIfEnabled(`❌ Error fetching events: ${eventsError.message}`, 'error')
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
    }

    // Enrich events with user profile information
    const enrichedEvents = await enrichEventsWithProfiles(events || [])

    logIfEnabled(`✅ Events fetched for group ${groupId}: ${enrichedEvents?.length || 0} events`)
    
    return NextResponse.json({
      success: true,
      events: enrichedEvents
    })

  } catch (error: any) {
    logIfEnabled(`❌ Error in events API: ${error.message}`, 'error')
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: groupId } = params
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Check if user is group owner
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('owner_id')
      .eq('id', groupId)
      .single()

    if (groupError || !group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    if (group.owner_id !== user.id) {
      return NextResponse.json({ error: 'Only group owners can create events' }, { status: 403 })
    }

    const { title, description, date, time, location, maxAttendees } = await request.json()
    
    if (!title || !description || !date) {
      return NextResponse.json({ error: 'Title, description, and date are required' }, { status: 400 })
    }

    // Combine date and time into event_date
    const eventDateTime = time ? `${date}T${time}` : date

    // Create event
    const { data: event, error: createError } = await supabase
      .from('group_events')
      .insert({
        group_id: groupId,
        title,
        description,
        event_date: eventDateTime,
        location: location || null,
        max_attendees: maxAttendees ? parseInt(maxAttendees) : 50,
        is_public: false,
        created_by: user.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (createError) {
      logIfEnabled(`❌ Error creating event: ${createError.message}`, 'error')
      return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
    }

    logIfEnabled(`✅ Event created for group ${groupId}: ${title}`)
    
    return NextResponse.json({
      success: true,
      message: 'Event created successfully',
      event
    })

  } catch (error: any) {
    logIfEnabled(`❌ Error in create event API: ${error.message}`, 'error')
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}
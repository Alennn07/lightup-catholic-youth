import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; eventId: string } }
) {
  try {
    console.log('🚀 PUT /api/youth-groups/[id]/events/[eventId]/visibility - Starting request for event:', params.eventId)
    
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

    const body = await request.json()
    console.log('📝 Request body:', body)

    // Check if user can toggle this event's visibility
    const { data: event, error: eventError } = await supabase
      .from('group_events')
      .select('created_by, group_id')
      .eq('id', params.eventId)
      .single()

    if (eventError || !event) {
      console.error('❌ Event not found:', eventError)
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check if user is the creator or group owner
    const { data: membership } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', event.group_id)
      .eq('user_id', user.id)
      .single()

    if (event.created_by !== user.id && membership?.role !== 'owner') {
      console.log('❌ User cannot toggle this event visibility')
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Toggle the event visibility
    const { data: updatedEvent, error: updateError } = await supabase
      .from('group_events')
      .update({
        is_public: body.is_public
      })
      .eq('id', params.eventId)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Error updating event visibility:', updateError)
      return NextResponse.json({ 
        error: 'Failed to update event visibility',
        details: updateError.message 
      }, { status: 500 })
    }

    console.log('✅ Event visibility updated successfully')
    return NextResponse.json({ 
      event: updatedEvent,
      message: 'Event visibility updated successfully' 
    })

  } catch (error: any) {
    console.error('❌ Unexpected error in PUT /api/youth-groups/[id]/events/[eventId]/visibility:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

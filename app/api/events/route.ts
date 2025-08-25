import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Fetch all events
export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching events:', error)
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
    }

    return NextResponse.json({ events: events || [] })
  } catch (error) {
    console.error('Events API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, type, date, location, maxAttendees, description, requirements, contactEmail, contactPhone } = body

    // Validate required fields
    if (!title || !type || !date || !location || !maxAttendees) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create event
    const { data: event, error: createError } = await supabase
      .from('events')
      .insert({
        title,
        type,
        date,
        location,
        max_attendees: maxAttendees,
        description: description || '',
        requirements: requirements || '',
        contact_email: contactEmail || '',
        contact_phone: contactPhone || '',
        owner_id: user.id,
        owner_email: user.email,
        attendees: 0,
        is_active: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating event:', createError)
      return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
    }

    return NextResponse.json({ event, message: 'Event created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Create event API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

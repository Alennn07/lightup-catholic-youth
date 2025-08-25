import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// POST - Register for an event
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Event registration API called')
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    console.log('🔑 Auth header:', authHeader ? 'Present' : 'Missing')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ No authorization header found')
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('✅ Token received:', token ? 'Yes' : 'No')
    console.log('🔍 Token length:', token.length)

    console.log('🔧 Creating Supabase client...')
    console.log('🌐 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing')
    console.log('🔑 Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing')
    
    // Create Supabase client with token
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            if (name === 'sb-access-token') return token
            return undefined
          },
          set() {},
          remove() {},
        },
      }
    )
    console.log('✅ Supabase client created')

    // Get current user using token
    console.log('🔍 Authenticating user with token...')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    console.log('👤 Auth check - User ID:', user?.id, 'Error:', authError)
    
    if (authError) {
      console.error('Authentication error:', authError)
      return NextResponse.json({ error: `Authentication error: ${authError.message}` }, { status: 401 })
    }
    
    if (!user) {
      console.error('No user found in session')
      return NextResponse.json({ error: 'No user found in session' }, { status: 401 })
    }

    console.log('📝 Parsing request body...')
    const body = await request.json()
    console.log('📦 Request body received:', JSON.stringify(body, null, 2))
    
    const { 
      eventId, 
      name, 
      email, 
      phone, 
      age, 
      parish,
      diocese,
      emergencyContact, 
      dietaryRestrictions, 
      specialNeeds, 
      agreeToTerms, 
      agreeToPhotoRelease 
    } = body

    // Validate required fields
    if (!eventId || !name || !email || !age || !parish || !diocese || !emergencyContact || !agreeToTerms) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if event exists and has capacity
    console.log('Looking for event with ID:', eventId, 'Type:', typeof eventId)
    
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', parseInt(eventId))
      .single()

    if (eventError || !event) {
      console.error('Event lookup error:', eventError)
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    
    console.log('Found event:', event)

    if (event.attendees >= event.max_attendees) {
      return NextResponse.json({ error: 'Event is full' }, { status: 400 })
    }

    // Check if user is already registered
    const { data: existingRegistration, error: checkError } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', parseInt(eventId))
      .eq('user_id', user.id)
      .single()

    if (existingRegistration) {
      return NextResponse.json({ error: 'Already registered for this event' }, { status: 400 })
    }

    // Create registration
    console.log('Creating registration with event_id:', eventId, 'user_id:', user.id)
    
    const { data: registration, error: regError } = await supabase
      .from('event_registrations')
      .insert({
        event_id: parseInt(eventId),
        user_id: user.id,
        user_email: user.email,
        name,
        email,
        phone: phone || '',
        age: parseInt(age),
        parish,
        diocese,
        emergency_contact: emergencyContact,
        dietary_restrictions: dietaryRestrictions || '',
        special_needs: specialNeeds || '',
        agree_to_terms: agreeToTerms,
        agree_to_photo_release: agreeToPhotoRelease || false,
        registration_date: new Date().toISOString(),
        status: 'confirmed'
      })
      .select()
      .single()

    if (regError) {
      console.error('Error creating registration:', regError)
      return NextResponse.json({ error: 'Failed to register for event' }, { status: 500 })
    }

    // Update event attendee count
    const { error: updateError } = await supabase
      .from('events')
      .update({ attendees: event.attendees + 1 })
      .eq('id', parseInt(eventId))

    if (updateError) {
      console.error('Error updating attendee count:', updateError)
      // Don't fail the registration if this fails
    }

    return NextResponse.json({ 
      registration, 
      message: 'Successfully registered for event' 
    }, { status: 201 })
  } catch (error) {
    console.error('Event registration API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET - Get user's event registrations
export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('GET No authorization header found')
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('GET Token received:', token ? 'Yes' : 'No')

    // Create Supabase client with token
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            if (name === 'sb-access-token') return token
            return undefined
          },
          set() {},
          remove() {},
        },
      }
    )

    // Get current user using token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    console.log('GET Auth check - User:', user, 'Error:', authError)
    
    if (authError) {
      console.error('GET Authentication error:', authError)
      return NextResponse.json({ error: `Authentication error: ${authError.message}` }, { status: 401 })
    }
    
    if (!user) {
      console.error('GET No user found in session')
      return NextResponse.json({ error: 'No user found in session' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')

    let query = supabase
      .from('event_registrations')
      .select(`
        *,
        event:events(title, date, location, type)
      `)
      .eq('user_id', user.id)

    if (eventId) {
      query = query.eq('event_id', eventId)
    }

    const { data: registrations, error } = await query.order('registration_date', { ascending: false })

    if (error) {
      console.error('Error fetching registrations:', error)
      return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 })
    }

    return NextResponse.json({ registrations: registrations || [] })
  } catch (error) {
    console.error('Get registrations API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

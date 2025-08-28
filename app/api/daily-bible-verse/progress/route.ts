import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/daily-bible-verse/progress - Starting request')
    
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
    const { action, verse_id, verse_text } = body

    if (!action || !verse_id) {
      return NextResponse.json({ error: 'Action and verse_id are required' }, { status: 400 })
    }

    console.log(`🎯 Action: ${action} for verse: ${verse_id}`)

    if (action === 'mark_completed') {
      // For now, just return success since tables don't exist yet
      console.log('✅ Verse marked as completed (simulated)')
      return NextResponse.json({ 
        success: true, 
        message: 'Verse marked as completed!',
        note: 'Progress tracking will be enabled once database is fully set up'
      })

    } else if (action === 'toggle_favorite') {
      // For now, just return success since tables don't exist yet
      console.log('❤️ Favorite toggled (simulated)')
      return NextResponse.json({ 
        success: true, 
        message: 'Favorite status updated!',
        note: 'Favorites will be saved once database is fully set up'
      })

    } else {
      return NextResponse.json({ error: 'Invalid action. Use "mark_completed" or "toggle_favorite"' }, { status: 400 })
    }

  } catch (error: any) {
    console.error('❌ Unexpected error in POST /api/daily-bible-verse/progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GET /api/daily-bible-verse/progress - Starting request')
    
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

    // For now, return empty data since tables don't exist yet
    const response = {
      favorites: [],
      reading_history: [],
      stats: {
        reading_streak: 0,
        total_completed: 0,
        favorites_count: 0
      },
      note: 'Progress tracking will be enabled once database is fully set up'
    }

    console.log('✅ User progress data fetched (simulated)')
    return NextResponse.json(response)

  } catch (error: any) {
    console.error('❌ Unexpected error in GET /api/daily-bible-verse/progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { PrayerSessionSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get user's prayer sessions (use service role to ensure server-side access)
    const { data: sessions, error } = await supabaseAdmin
      .from('prayer_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching prayer sessions:', error)
      return NextResponse.json({ error: 'Failed to fetch prayer sessions' }, { status: 500 })
    }

    // Get prayer statistics
    const { data: stats, error: statsError } = await supabaseAdmin
      .from('prayer_sessions')
      .select('duration_minutes, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days

    if (statsError) {
      console.error('Error fetching prayer stats:', statsError)
    }

    const totalMinutes = stats?.reduce((sum, session) => sum + (session.duration_minutes || 0), 0) || 0
    const sessionCount = stats?.length || 0

    return NextResponse.json({ 
      sessions: sessions || [],
      stats: {
        totalMinutes,
        sessionCount,
        averageMinutes: sessionCount > 0 ? Math.round(totalMinutes / sessionCount) : 0
      }
    })
  } catch (error) {
    console.error('Prayer sessions API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = PrayerSessionSchema.parse(body)
    
    const { userId, ...sessionData } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Insert new prayer session
    // Use service role to avoid RLS issues on server-side writes
    const { data, error } = await supabaseAdmin
      .from('prayer_sessions')
      .insert({
        user_id: userId,
        session_type: validatedData.session_type,
        duration_minutes: validatedData.duration_minutes,
        prayer_focus: validatedData.prayer_focus,
        mood_before: validatedData.mood_before,
        mood_after: validatedData.mood_after,
        notes: validatedData.notes
      })
      .select()

    if (error) {
      console.error('Error creating prayer session:', error)
      return NextResponse.json({ error: 'Failed to create prayer session' }, { status: 500 })
    }

    // Also record this as user activity
    await supabaseAdmin
      .from('user_activity')
      .insert({
        user_id: userId,
        activity_type: 'prayer',
        activity_data: {
          session_type: validatedData.session_type,
          duration_minutes: validatedData.duration_minutes,
          prayer_focus: validatedData.prayer_focus
        },
        duration_minutes: validatedData.duration_minutes
      })

    return NextResponse.json({ session: data[0] })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 })
    }
    
    console.error('Prayer sessions POST API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

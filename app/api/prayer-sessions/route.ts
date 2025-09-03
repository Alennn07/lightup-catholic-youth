import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'

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
    const { 
      userId, 
      sessionType = 'guided', 
      durationMinutes, 
      prayerFocus, 
      moodBefore, 
      moodAfter, 
      notes 
    } = await request.json()

    if (!userId || !durationMinutes) {
      return NextResponse.json({ error: 'User ID and duration are required' }, { status: 400 })
    }

    // Insert new prayer session
    // Use service role to avoid RLS issues on server-side writes
    const { data, error } = await supabaseAdmin
      .from('prayer_sessions')
      .insert({
        user_id: userId,
        session_type: sessionType,
        duration_minutes: durationMinutes,
        prayer_focus: prayerFocus,
        mood_before: moodBefore,
        mood_after: moodAfter,
        notes: notes
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
          session_type: sessionType,
          duration_minutes: durationMinutes,
          prayer_focus: prayerFocus
        },
        duration_minutes: durationMinutes
      })

    return NextResponse.json({ session: data[0] })
  } catch (error) {
    console.error('Prayer sessions POST API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

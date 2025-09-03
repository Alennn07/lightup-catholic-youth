import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 })

    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    // Parallel queries
    const [sessionsRes, progressRes, journalRes] = await Promise.all([
      supabaseAdmin
        .from('prayer_sessions')
        .select('id, duration_minutes, created_at', { count: 'exact' })
        .eq('user_id', userId)
        .gte('created_at', since7d),
      supabaseAdmin
        .from('user_progress')
        .select('verse_date, is_completed', { count: 'exact' })
        .eq('user_id', userId)
        .gte('verse_date', since7d.split('T')[0]),
      supabaseAdmin
        .from('journal_entries')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
    ])

    const totalPrayerMinutes = (sessionsRes.data || []).reduce((s, r: any) => s + (r.duration_minutes || 0), 0)

    const result = {
      totalPrayerMinutes,
      totalPrayerSessions: sessionsRes.count || 0,
      bibleCompletions7d: progressRes.count || 0,
      journalEntries: journalRes.count || 0,
    }

    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GET /api/daily-bible-verse - Starting request')
    
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

    // Get today's date
    const today = new Date().toISOString().split('T')[0]
    console.log('📅 Fetching verse for date:', today)

    // Get today's assigned verse
    let { data: dailyAssignment, error: assignmentError } = await supabase
      .from('daily_verse_assignments')
      .select(`
        verse_id,
        theme,
        bible_verses (
          verse_id,
          verse_text,
          book,
          chapter,
          verse,
          theme,
          reflection,
          action_prompt
        )
      `)
      .eq('assigned_date', today)
      .single()

    if (assignmentError || !dailyAssignment) {
      console.log('⚠️ No verse assigned for today, using fallback')
      
      // Fallback: Get a random verse
      const { data: fallbackVerse, error: fallbackError } = await supabase
        .from('bible_verses')
        .select('*')
        .eq('is_active', true)
        .order('RANDOM()')
        .limit(1)
        .single()
      
      if (fallbackError || !fallbackVerse) {
        console.error('❌ Error fetching fallback verse:', fallbackError)
        return NextResponse.json({ error: 'Failed to fetch verse' }, { status: 500 })
      }
      
      dailyAssignment = {
        verse_id: fallbackVerse.verse_id,
        theme: fallbackVerse.theme,
        bible_verses: fallbackVerse
      }
    }

    // Get user's progress for today
    const { data: userProgress, error: progressError } = await supabase
      .from('user_verse_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('verse_date', today)
      .single()

    // Check if user has favorited this verse
    const { data: isFavorited, error: favoriteError } = await supabase
      .from('favorite_verses')
      .select('id')
      .eq('user_id', user.id)
      .eq('verse_id', dailyAssignment.verse_id)
      .single()

    // Get user's reading streak
    const { data: streakResult, error: streakError } = await supabase
      .rpc('get_user_reading_streak', { user_uuid: user.id })

    if (streakError) {
      console.log('⚠️ Could not fetch reading streak:', streakError)
    }

    // Get user's total completed verses
    const { count: totalCompleted, error: countError } = await supabase
      .from('user_verse_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_completed', true)

    if (countError) {
      console.log('⚠️ Could not fetch total completed count:', countError)
    }

    // Prepare the response
    const verseData = dailyAssignment.bible_verses
    const response = {
      verse: {
        id: verseData.verse_id,
        text: verseData.verse_text,
        reference: `${verseData.book} ${verseData.chapter}:${verseData.verse}`,
        book: verseData.book,
        chapter: verseData.chapter,
        verse: verseData.verse,
        theme: verseData.theme,
        reflection: verseData.reflection,
        action_prompt: verseData.action_prompt
      },
      user_progress: {
        is_completed: userProgress?.is_completed || false,
        read_at: userProgress?.read_at || null,
        is_favorited: !!isFavorited
      },
      stats: {
        reading_streak: streakResult || 0,
        total_completed: totalCompleted || 0,
        today_date: today
      }
    }

    console.log('✅ Daily Bible verse data prepared successfully')
    console.log('📊 User stats - Streak:', streakResult, 'Total:', totalCompleted)

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('❌ Unexpected error in GET /api/daily-bible-verse:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

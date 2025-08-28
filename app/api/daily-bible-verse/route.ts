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

    try {
      // Try to get today's assigned verse from database
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
        
        // Fallback: Get a random verse from database
        const { data: fallbackVerse, error: fallbackError } = await supabase
          .from('bible_verses')
          .select('*')
          .eq('is_active', true)
          .order('RANDOM()')
          .limit(1)
          .single()
        
        if (fallbackError || !fallbackVerse) {
          console.log('⚠️ Database tables not ready, using hardcoded fallback')
          
          // Hardcoded fallback verse
          dailyAssignment = {
            verse_id: 'Proverbs 17:17',
            theme: 'Friendship',
            bible_verses: {
              verse_id: 'Proverbs 17:17',
              verse_text: 'A friend loves at all times, and a brother is born for a time of adversity.',
              book: 'Proverbs',
              chapter: 17,
              verse: 17,
              theme: 'Friendship',
              reflection: 'True friends stick with you through the good times and the bad. They\'re the ones who celebrate your victories and pick you up when you fall.',
              action_prompt: 'Reach out to a friend who might be going through a hard time today.'
            }
          }
        } else {
          dailyAssignment = {
            verse_id: fallbackVerse.verse_id,
            theme: fallbackVerse.theme,
            bible_verses: fallbackVerse
          }
        }
      }

      // Try to get user's progress for today
      let userProgress = null
      try {
        const { data: progress, error: progressError } = await supabase
          .from('user_verse_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('verse_date', today)
          .single()
        
        if (!progressError) {
          userProgress = progress
        }
      } catch (error) {
        console.log('⚠️ Progress table not ready yet')
      }

      // Try to check if user has favorited this verse
      let isFavorited = false
      try {
        const { data: favorite, error: favoriteError } = await supabase
          .from('favorite_verses')
          .select('id')
          .eq('user_id', user.id)
          .eq('verse_id', dailyAssignment.verse_id)
          .single()
        
        if (!favoriteError) {
          isFavorited = !!favorite
        }
      } catch (error) {
        console.log('⚠️ Favorites table not ready yet')
      }

      // Try to get user's reading streak
      let readingStreak = 0
      try {
        const { data: streakResult, error: streakError } = await supabase
          .rpc('get_user_reading_streak', { user_uuid: user.id })
        
        if (!streakError) {
          readingStreak = streakResult || 0
        }
      } catch (error) {
        console.log('⚠️ Reading streak function not ready yet')
      }

      // Try to get total completed count
      let totalCompleted = 0
      try {
        const { count: completed, error: countError } = await supabase
          .from('user_verse_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_completed', true)
        
        if (!countError) {
          totalCompleted = completed || 0
        }
      } catch (error) {
        console.log('⚠️ Progress counting not ready yet')
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
          is_favorited: isFavorited
        },
        stats: {
          reading_streak: readingStreak,
          total_completed: totalCompleted,
          today_date: today
        }
      }

      console.log('✅ Daily Bible verse data prepared successfully')
      console.log('📊 User stats - Streak:', readingStreak, 'Total:', totalCompleted)

      return NextResponse.json(response)

    } catch (databaseError) {
      console.log('⚠️ Database error, using hardcoded fallback:', databaseError)
      
      // Hardcoded fallback response
      const fallbackResponse = {
        verse: {
          id: 'Proverbs 17:17',
          text: 'A friend loves at all times, and a brother is born for a time of adversity.',
          reference: 'Proverbs 17:17',
          book: 'Proverbs',
          chapter: 17,
          verse: 17,
          theme: 'Friendship',
          reflection: 'True friends stick with you through the good times and the bad. They\'re the ones who celebrate your victories and pick you up when you fall.',
          action_prompt: 'Reach out to a friend who might be going through a hard time today.'
        },
        user_progress: {
          is_completed: false,
          read_at: null,
          is_favorited: false
        },
        stats: {
          reading_streak: 0,
          total_completed: 0,
          today_date: today
        }
      }

      return NextResponse.json(fallbackResponse)
    }

  } catch (error: any) {
    console.error('❌ Unexpected error in GET /api/daily-bible-verse:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
      // Get today's verse from the existing bible_verses table
      const { data: todayVerse, error: verseError } = await supabase
        .from('bible_verses')
        .select('*')
        .eq('date', today)
        .single()

      if (verseError || !todayVerse) {
        console.log('⚠️ No verse for today, using fallback')
        
        // Fallback: Get a random verse from existing table
        const { data: fallbackVerse, error: fallbackError } = await supabase
          .from('bible_verses')
          .select('*')
          .order('RANDOM()')
          .limit(1)
          .single()
        
        if (fallbackError || !fallbackVerse) {
          console.log('⚠️ No verses in table, using hardcoded fallback')
          
          // Hardcoded fallback verse
          const fallbackResponse = {
            verse: {
              id: 'fallback-1',
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
        
        todayVerse = fallbackVerse
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
          .eq('verse_id', todayVerse.reference) // Use reference as verse_id
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

      // Prepare the response using the existing table structure
      const response = {
        verse: {
          id: todayVerse.reference, // Use reference as ID
          text: todayVerse.verse, // Use 'verse' column
          reference: todayVerse.reference, // Use 'reference' column
          book: todayVerse.reference.split(' ')[0], // Extract book from reference
          chapter: parseInt(todayVerse.reference.split(' ')[1]?.split(':')[0]) || 1,
          verse: parseInt(todayVerse.reference.split(' ')[1]?.split(':')[1]) || 1,
          theme: todayVerse.theme || 'Faith',
          reflection: todayVerse.reflection || 'Reflect on this verse today.',
          action_prompt: todayVerse.prayer_suggestion || 'Take a moment to pray about this verse.'
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


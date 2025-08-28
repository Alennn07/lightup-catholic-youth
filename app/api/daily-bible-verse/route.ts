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
      let { data: todayVerse, error: verseError } = await supabase
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

      // Test database connection and table access
      console.log('🔍 Testing database connection...')
      try {
        const { data: testData, error: testError } = await supabase
          .from('user_verse_progress')
          .select('count')
          .limit(1)
        
        if (testError) {
          console.log('⚠️ Database table test failed:', testError)
        } else {
          console.log('✅ Database table accessible')
        }
      } catch (error) {
        console.log('⚠️ Database connection test failed:', error)
      }

      // Try to get user's progress for today
      let userProgress = null
      let totalCompleted = 0
      let isFavorited = false
      
      try {
        // Get today's completion status
        const { data: todayProgress, error: progressError } = await supabase
          .from('user_verse_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('verse_date', today)
          .single()
        
        if (!progressError) {
          userProgress = todayProgress
          console.log('✅ Today\'s progress found:', userProgress)
        } else if (progressError.code !== 'PGRST116') {
          console.log('⚠️ Error checking today\'s progress:', progressError)
        }
        
        // Get total completed count
        const { count: completed, error: countError } = await supabase
          .from('user_verse_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_completed', true)
        
        if (countError) {
          console.log('⚠️ Error counting completed verses:', countError)
          totalCompleted = 0
        } else {
          totalCompleted = completed || 0
          console.log('✅ Total completed count:', totalCompleted)
        }
        
      } catch (error) {
        console.log('⚠️ Progress table not ready yet:', error)
        totalCompleted = 0
      }

      // Try to check if user has favorited this verse
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
          console.log('✅ Reading streak calculated:', readingStreak)
        } else {
          console.log('⚠️ Reading streak function error:', streakError)
        }
      } catch (error) {
        console.log('⚠️ Reading streak function not ready yet')
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


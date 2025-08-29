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
      // Get today's verse from the bible_verses table
      let { data: todayVerse, error: verseError } = await supabase
        .from('bible_verses')
        .select('*')
        .eq('date', today)
        .single()

      if (verseError || !todayVerse) {
        console.log('⚠️ No verse for today, trying to get a verse for any recent date')
        
        // Try to get a verse from the last 7 days
        const { data: recentVerse, error: recentError } = await supabase
          .from('bible_verses')
          .select('*')
          .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .lte('date', today)
          .order('date', { ascending: false })
          .limit(1)
          .single()
        
        if (recentError || !recentVerse) {
          console.log('⚠️ No recent verses found, using fallback')
          
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
        
        todayVerse = recentVerse
      }

      console.log('✅ Found verse for date:', todayVerse.date, 'Reference:', todayVerse.reference)

      // Get user's progress for today
      let userProgress = null
      let isFavorited = false
      
      try {
        const { data: progress, error: progressError } = await supabase
          .from('user_verse_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('verse_date', today)
          .single()
        
        if (!progressError && progress) {
          userProgress = progress
          console.log('✅ Found user progress for today:', progress.is_completed)
        } else {
          console.log('ℹ️ No user progress found for today, user has not completed')
          userProgress = { is_completed: false, read_at: null }
        }
      } catch (error) {
        console.log('⚠️ Progress check failed, defaulting to not completed')
        userProgress = { is_completed: false, read_at: null }
      }

      // Check if user has favorited this verse
      try {
        const { data: favorite, error: favoriteError } = await supabase
          .from('favorite_verses')
          .select('id')
          .eq('user_id', user.id)
          .eq('verse_id', todayVerse.reference)
          .single()
        
        if (!favoriteError) {
          isFavorited = !!favorite
        }
      } catch (error) {
        console.log('⚠️ Favorites check failed')
      }

      // Get fresh stats from progress API
      let readingStreak = 0
      
      console.log('🔍 Getting fresh stats from progress API')
      try {
        const baseUrl = request.nextUrl.origin
        const progressUrl = `${baseUrl}/api/daily-bible-verse/progress`
        
        const progressResponse = await fetch(progressUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (progressResponse.ok) {
          const progressData = await progressResponse.json()
          readingStreak = progressData.stats?.reading_streak || 0
          console.log('✅ Fresh streak from progress API:', readingStreak)
        } else {
          console.log('⚠️ Progress API call failed, using default streak')
        }
      } catch (error) {
        console.log('⚠️ Could not fetch fresh stats, using default streak')
      }

      // Prepare the response using the database verse
      const response = {
        verse: {
          id: todayVerse.reference,
          text: todayVerse.verse,
          reference: todayVerse.reference,
          book: todayVerse.reference.split(' ')[0],
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
          total_completed: 0,
          today_date: today
        }
      }

      console.log('✅ Daily Bible verse data prepared successfully')
      console.log('📊 User stats - Streak:', readingStreak, 'Date:', today)

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


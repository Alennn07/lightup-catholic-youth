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

      // Get fresh stats from progress API
      let readingStreak = 0
      
      console.log('🔍 Step 1: About to call progress API for fresh stats')
      try {
        // Call the progress API to get fresh stats using relative path
        const progressUrl = '/api/daily-bible-verse/progress'
        console.log('🔍 Step 2: Calling progress API at:', progressUrl)
        
        // Get the base URL from the request
        const baseUrl = request.nextUrl.origin
        const fullProgressUrl = `${baseUrl}${progressUrl}`
        console.log('🔍 Step 2b: Full progress API URL:', fullProgressUrl)
        
        const progressResponse = await fetch(fullProgressUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        console.log('🔍 Step 3: Progress API response status:', progressResponse.status)
        
        if (progressResponse.ok) {
          const progressData = await progressResponse.json()
          console.log('🔍 Step 4: Progress API response data:', progressData)
          
          readingStreak = progressData.stats?.reading_streak || 0
          console.log('✅ Fresh streak from progress API:', readingStreak)
        } else {
          console.log('⚠️ Progress API call failed with status:', progressResponse.status)
          const errorText = await progressResponse.text()
          console.log('⚠️ Progress API error response:', errorText)
        }
      } catch (error) {
        console.log('⚠️ Could not fetch fresh stats:', error)
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
          total_completed: 0, // Removed total_completed
          today_date: today
        }
      }

      console.log('✅ Daily Bible verse data prepared successfully')
      console.log('📊 User stats - Streak:', readingStreak, 'Total:', 0) // Removed total_completed

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


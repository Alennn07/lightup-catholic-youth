import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    
    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    const today = new Date().toISOString().split('T')[0]
    console.log('📅 Today:', today, 'User:', user.id)
    
    // Ensure user is not null for TypeScript
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }
    
    // Type assertion since we've already checked user is not null
    const currentUser = user as NonNullable<typeof user>
    
    // Get today's verse
    const { data: todayVerse, error: verseError } = await supabase
      .from('bible_verses')
      .select('*')
      .eq('date', today)
      .single()
    
    // TEMPORARILY: Force fallback for testing new system
    // TODO: Remove this once we have proper daily verses
    if (true || verseError || !todayVerse) {
      console.log('🔄 Using dynamic fallback system for testing')
      
      // Create a dynamic fallback verse based on the date
      const fallbackVerses = [
        {
          id: 'Proverbs 17:17',
          text: 'A friend loves at all times, and a brother is born for a time of adversity.',
          reference: 'Proverbs 17:17',
          book: 'Proverbs',
          chapter: 17,
          verse: 17,
          theme: 'Friendship',
          reflection: 'True friends stick with you through good times and bad. They celebrate your victories and pick you up when you fall.',
          action_prompt: 'Take a moment to pray about this verse.'
        },
        {
          id: 'Philippians 4:13',
          text: 'I can do all things through Christ who strengthens me.',
          reference: 'Philippians 4:13',
          book: 'Philippians',
          chapter: 4,
          verse: 13,
          theme: 'Strength',
          reflection: 'God gives us the strength to face any challenge. When you feel weak, remember that Christ is your source of power.',
          action_prompt: 'Reflect on a challenge you\'re facing and pray for God\'s strength.'
        },
        {
          id: 'Jeremiah 29:11',
          text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
          reference: 'Jeremiah 29:11',
          book: 'Jeremiah',
          chapter: 29,
          verse: 11,
          theme: 'Hope',
          reflection: 'God has a beautiful plan for your life. Even when things seem uncertain, trust that He is working for your good.',
          action_prompt: 'Write down one thing you\'re hopeful about and thank God for it.'
        },
        {
          id: 'Psalm 119:105',
          text: 'Your word is a lamp to my feet and a light to my path.',
          reference: 'Psalm 119:105',
          book: 'Psalm',
          chapter: 119,
          verse: 105,
          theme: 'Guidance',
          reflection: 'God\'s Word illuminates our path and shows us the way forward. Let Scripture guide your decisions today.',
          action_prompt: 'Read a favorite Bible verse and let it guide your actions today.'
        },
        {
          id: 'Matthew 28:19-20',
          text: 'Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all that I have commanded you.',
          reference: 'Matthew 28:19-20',
          book: 'Matthew',
          chapter: 28,
          verse: 19,
          theme: 'Mission',
          reflection: 'Jesus calls us to share our faith with others. Look for opportunities to be a witness for Christ today.',
          action_prompt: 'Pray for one person you can share God\'s love with today.'
        }
      ]
      
      // Select verse based on day of month for variety
      const dayOfMonth = new Date(today).getDate()
      const selectedVerse = fallbackVerses[dayOfMonth % fallbackVerses.length]
      
      // For fallback system, we need to check user progress and calculate streak
      // Get user's progress for today
      let isCompleted = false
      let readAt = null
      
      try {
        const { data: progress, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', currentUser.id)
          .eq('verse_date', today)
          .single()
        
        if (!progressError && progress) {
          isCompleted = progress.is_completed || false
          readAt = progress.completed_at || null
        }
      } catch (error) {
        // No progress for today yet, which is expected for a new day
        console.log('🆕 New day - no progress yet')
      }
      
      // Calculate reading streak for fallback system
      let readingStreak = 0
      
      // Always check yesterday first to see if we have a streak to maintain
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      
      try {
        // Check if user completed yesterday
        const { data: yesterdayProgress, error: yesterdayError } = await supabase
          .from('user_progress')
          .select('is_completed')
          .eq('user_id', currentUser.id)
          .eq('verse_date', yesterdayStr)
          .eq('is_completed', true)
          .single()
        
        if (!yesterdayError && yesterdayProgress?.is_completed) {
          // User completed yesterday, so they have a streak to maintain
          readingStreak = 1
          
          // Count backwards from day before yesterday to build the streak
          let checkDate = new Date(yesterday)
          checkDate.setDate(checkDate.getDate() - 1)
          
          while (true) {
            const checkDateStr = checkDate.toISOString().split('T')[0]
            const { data: prevProgress, error: prevError } = await supabase
              .from('user_progress')
              .select('is_completed')
              .eq('user_id', currentUser.id)
              .eq('verse_date', checkDateStr)
              .eq('is_completed', true)
              .single()
            
            if (prevError || !prevProgress) {
              break
            }
            
            readingStreak++
            checkDate.setDate(checkDate.getDate() - 1)
          }
        }
      } catch (error) {
        // No progress yesterday, streak is 0
        console.log('📅 No progress yesterday, streak reset to 0')
      }
      
      // DON'T add to streak if completed today - streak should only show previous days
      // The streak will be updated when they actually complete today's verse
      console.log('📊 Fallback system - Yesterday completed:', readingStreak > 0, 'Today completed:', isCompleted, 'Base streak:', readingStreak)
      
      return NextResponse.json({
        verse: selectedVerse,
        user_progress: {
          is_completed: isCompleted,
          read_at: readAt,
          is_favorited: false
        },
        stats: {
          reading_streak: readingStreak,
          today_date: today
        }
      })
    }
    
    // Get user's progress for today - ALWAYS start fresh each day
    let isCompleted = false
    let readAt = null
    
    // Check if user already completed today (in case they refresh the page)
    try {
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('verse_date', today)
        .single()
      
      if (!progressError && progress) {
        isCompleted = progress.is_completed || false
        readAt = progress.completed_at || null
      }
    } catch (error) {
      // No progress for today yet, which is expected for a new day
      console.log('🆕 New day - no progress yet')
    }
    
    // Check if user has favorited this verse
    const { data: favorite, error: favoriteError } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', currentUser.id)
      .eq('verse_reference', todayVerse.reference)
      .single()
    
    const isFavorited = !favoriteError && favorite ? true : false
    
    // Calculate reading streak - simplified and fixed logic
    let readingStreak = 0
    
    // Always check yesterday first to see if we have a streak to maintain
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    
    try {
      // Check if user completed yesterday
      const { data: yesterdayProgress, error: yesterdayError } = await supabase
        .from('user_progress')
        .select('is_completed')
        .eq('user_id', currentUser.id)
        .eq('verse_date', yesterdayStr)
        .eq('is_completed', true)
        .single()
      
      if (!yesterdayError && yesterdayProgress?.is_completed) {
        // User completed yesterday, so they have a streak to maintain
        readingStreak = 1
        
        // Count backwards from day before yesterday to build the streak
        let checkDate = new Date(yesterday)
        checkDate.setDate(checkDate.getDate() - 1)
        
        while (true) {
          const checkDateStr = checkDate.toISOString().split('T')[0]
          const { data: prevProgress, error: prevError } = await supabase
            .from('user_progress')
            .select('is_completed')
            .eq('user_id', currentUser.id)
            .eq('verse_date', checkDateStr)
            .eq('is_completed', true)
            .single()
          
          if (prevError || !prevProgress) {
            break
          }
          
          readingStreak++
          checkDate.setDate(checkDate.getDate() - 1)
        }
      }
    } catch (error) {
      // No progress yesterday, streak is 0
      console.log('📅 No progress yesterday, streak reset to 0')
    }
    
    // DON'T add to streak if completed today - streak should only show previous days
    // The streak will be updated when they actually complete today's verse
    console.log('📊 Streak calculation - Yesterday completed:', readingStreak > 0, 'Today completed:', isCompleted, 'Base streak:', readingStreak)
    
    // Prepare response
    const response = {
      verse: {
        id: todayVerse.reference,
        text: todayVerse.verse,
        reference: todayVerse.reference,
        book: todayVerse.reference.split(' ')[0],
        chapter: parseInt(todayVerse.reference.split(' ')[1]?.split(':')[0]) || 1,
        verse: parseInt(todayVerse.reference.split(' ')[1]?.split(':')[1]) || 1,
        theme: todayVerse.theme,
        reflection: todayVerse.reflection,
        action_prompt: 'Take a moment to pray about this verse.'
      },
      user_progress: {
        is_completed: isCompleted,
        read_at: readAt,
        is_favorited: isFavorited
      },
      stats: {
        reading_streak: readingStreak,
        today_date: today
      }
    }
    
    console.log('✅ Daily Bible verse data prepared successfully')
    console.log('📊 User stats - Streak:', readingStreak, 'Completed:', isCompleted)
    
    return NextResponse.json(response)
    
  } catch (error: any) {
    console.error('❌ Error in GET /api/daily-bible-verse:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


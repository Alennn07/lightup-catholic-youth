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
    
    // Get client's date from query params as fallback
    const { searchParams } = new URL(request.url)
    const clientDate = searchParams.get('date')
    
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
    
    // Get today's date - FIX TIMEZONE ISSUE
    const now = new Date()
    
    // Method 1: Use UTC date (more reliable for server)
    const utcToday = now.toISOString().split('T')[0]
    
    // Method 2: Use local date from client timezone
    const localToday = now.toLocaleDateString('en-CA') // Returns YYYY-MM-DD format
    
    // Method 3: Use Date constructor with local timezone
    const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const localTodayStr = localDate.toISOString().split('T')[0]
    
    // Use the most reliable method (local date)
    let today = localTodayStr
    
    // If client provided a date, use that instead (more reliable)
    if (clientDate) {
      console.log('📱 Client provided date:', clientDate)
      // Validate the date format (should be YYYY-MM-DD)
      if (/^\d{4}-\d{2}-\d{2}$/.test(clientDate)) {
        console.log('✅ Using client date instead of server date')
        // Use client date but validate it's reasonable (not too far in past/future)
        const clientDateObj = new Date(clientDate)
        const now = new Date()
        const diffDays = Math.abs((clientDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        
        if (diffDays <= 7) { // Allow up to 7 days difference
          console.log('✅ Client date is reasonable, using it')
          today = clientDate
        } else {
          console.log('⚠️ Client date too far from server date, using server date')
        }
      } else {
        console.log('⚠️ Invalid client date format, using server date')
      }
    }
    
    console.log('📅 Date calculation debug:')
    console.log('  - Current time:', now.toISOString())
    console.log('  - UTC today:', utcToday)
    console.log('  - Local today (en-CA):', localToday)
    console.log('  - Local today (constructor):', localTodayStr)
    console.log('  - Client date:', clientDate)
    console.log('  - Final today:', today)
    console.log('  - User:', user.id)
    
    // Force fallback system for testing
    console.log('🔄 Using dynamic fallback system for testing')
    
    // Create dynamic fallback verses
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
    
    // Select verse based on day of month
    const dayOfMonth = new Date(today).getDate()
    const selectedVerse = fallbackVerses[dayOfMonth % fallbackVerses.length]
    
    // Check if user already completed today's verse
    let isCompleted = false
    let readAt = null
    
    try {
      const { data: todayProgress, error: todayError } = await supabase
        .from('user_progress')
        .select('is_completed, completed_at')
        .eq('user_id', user.id)
        .eq('verse_date', today)
        .eq('is_completed', true)
        .single()
      
      if (!todayError && todayProgress) {
        isCompleted = true
        readAt = todayProgress.completed_at
        console.log('✅ User already completed today\'s verse at:', readAt)
      } else {
        console.log('🆕 User has not completed today\'s verse yet')
      }
    } catch (error) {
      console.log('🆕 No progress for today yet (expected for new day)')
    }
    
    console.log('🆕 Current completion status - isCompleted:', isCompleted, 'readAt:', readAt)
    
    // SIMPLE STREAK CALCULATION
    console.log('🔍 Starting SIMPLE streak calculation for user:', user.id)
    
    // DEBUG: Check what's in the database
    console.log('🔍 DEBUG: Checking database structure...')
    
    // Check if user_progress table exists and has data
    const { data: allProgress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('verse_date', { ascending: false })
      .limit(5)
    
    console.log('📊 All user progress (last 5):', { allProgress, progressError })
    
    // Check table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('user_progress')
      .select('*')
      .limit(1)
    
    console.log('📋 Table structure sample:', { tableInfo, tableError })
    
    // Step 1: Calculate yesterday's date
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    
    console.log('📅 Today:', today, 'Yesterday:', yesterdayStr)
    
    // Step 2: Check if user completed yesterday
    const { data: yesterdayProgress, error: yesterdayError } = await supabase
      .from('user_progress')
      .select('is_completed')
      .eq('user_id', user.id)
      .eq('verse_date', yesterdayStr)
      .eq('is_completed', true)
      .single()
    
    console.log('📊 Yesterday progress query result:', { yesterdayProgress, yesterdayError })
    
    let readingStreak = 0
    
    // Step 3: If yesterday completed, start streak at 1
    if (yesterdayProgress && yesterdayProgress.is_completed) {
      readingStreak = 1
      console.log('✅ Yesterday completed! Starting streak at 1')
      
      // Step 4: Count backwards for consecutive days
      let checkDate = new Date(yesterday)
      checkDate.setDate(checkDate.getDate() - 1)
      
      while (true) {
        const checkDateStr = checkDate.toISOString().split('T')[0]
        console.log('🔍 Checking previous day:', checkDateStr)
        
        const { data: prevProgress, error: prevError } = await supabase
          .from('user_progress')
          .select('is_completed')
          .eq('user_id', user.id)
          .eq('verse_date', checkDateStr)
          .eq('is_completed', true)
          .single()
        
        if (prevError || !prevProgress || !prevProgress.is_completed) {
          console.log('🛑 No more consecutive completions found at:', checkDateStr)
          break
        }
        
        readingStreak++
        console.log('📈 Found consecutive completion at:', checkDateStr, 'Streak now:', readingStreak)
        checkDate.setDate(checkDate.getDate() - 1)
      }
    } else {
      console.log('❌ Yesterday not completed. Streak starts at 0')
      readingStreak = 0
    }
    
    console.log('📊 FINAL STREAK RESULT:', readingStreak)
    
    // Return response
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
    
  } catch (error: any) {
    console.error('❌ Error in GET /api/daily-bible-verse:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


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
    
    // Get today's date from client query param (more reliable)
    const { searchParams } = new URL(request.url)
    const clientDate = searchParams.get('date')
    
    // Use client date if provided, otherwise use server date
    const today = clientDate || new Date().toISOString().split('T')[0]
    console.log('📅 Using date:', today, 'User:', user.id)
    
    // Simple verse selection (5 verses that rotate daily)
    const verses = [
      {
        id: 'Matthew 28:19-20',
        text: 'Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all that I have commanded you.',
        reference: 'Matthew 28:19-20',
        theme: 'Mission',
        reflection: 'Jesus calls us to share our faith with others. Look for opportunities to be a witness for Christ today.',
        action: 'Pray for one person you can share God\'s love with today.'
      },
      {
        id: 'Philippians 4:13',
        text: 'I can do all things through Christ who strengthens me.',
        reference: 'Philippians 4:13',
        theme: 'Strength',
        reflection: 'God gives us the strength to face any challenge. When you feel weak, remember that Christ is your source of power.',
        action: 'Reflect on a challenge you\'re facing and pray for God\'s strength.'
      },
      {
        id: 'Jeremiah 29:11',
        text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
        reference: 'Jeremiah 29:11',
        theme: 'Hope',
        reflection: 'God has a beautiful plan for your life. Even when things seem uncertain, trust that He is working for your good.',
        action: 'Write down one thing you\'re hopeful about and thank God for it.'
      },
      {
        id: 'Psalm 119:105',
        text: 'Your word is a lamp to my feet and a light to my path.',
        reference: 'Psalm 119:105',
        theme: 'Guidance',
        reflection: 'God\'s Word illuminates our path and shows us the way forward. Let Scripture guide your decisions today.',
        action: 'Read a favorite Bible verse and let it guide your actions today.'
      },
      {
        id: 'Proverbs 17:17',
        text: 'A friend loves at all times, and a brother is born for a time of adversity.',
        reference: 'Proverbs 17:17',
        theme: 'Friendship',
        reflection: 'True friends stick with you through good times and bad. They celebrate your victories and pick you up when you fall.',
        action: 'Take a moment to pray about this verse.'
      }
    ]
    
    // Select verse based on day of month
    const dayOfMonth = new Date(today).getDate()
    const selectedVerse = verses[dayOfMonth % verses.length]
    
    // Check if user completed today's verse
    let isCompleted = false
    let readAt = null
    
    try {
      const { data: progress } = await supabase
        .from('user_progress')
        .select('is_completed, completed_at')
        .eq('user_id', user.id)
        .eq('verse_date', today)
        .eq('is_completed', true)
        .single()
      
      if (progress) {
        isCompleted = true
        readAt = progress.completed_at
        console.log('✅ User completed today\'s verse')
      }
    } catch (error) {
      console.log('🆕 User has not completed today\'s verse yet')
    }
    
    // SIMPLE STREAK CALCULATION
    let streak = 0
    
    try {
      // Check yesterday's completion
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      
      const { data: yesterdayProgress } = await supabase
        .from('user_progress')
        .select('is_completed')
        .eq('user_id', user.id)
        .eq('verse_date', yesterdayStr)
        .eq('is_completed', true)
        .single()
      
      if (yesterdayProgress?.is_completed) {
        streak = 1
        console.log('✅ Yesterday completed, streak starts at 1')
        
        // Count backwards for consecutive days
        let checkDate = new Date(yesterday)
        checkDate.setDate(checkDate.getDate() - 1)
        
        while (true) {
          const checkDateStr = checkDate.toISOString().split('T')[0]
          const { data: prevProgress } = await supabase
            .from('user_progress')
            .select('is_completed')
            .eq('user_id', user.id)
            .eq('verse_date', checkDateStr)
            .eq('is_completed', true)
            .single()
          
          if (!prevProgress?.is_completed) break
          
          streak++
          checkDate.setDate(checkDate.getDate() - 1)
        }
      }
    } catch (error) {
      console.log('📅 No progress yesterday, streak is 0')
    }
    
    console.log('📊 Final streak:', streak, 'Completed today:', isCompleted)
    
    return NextResponse.json({
      verse: selectedVerse,
      user_progress: {
        is_completed: isCompleted,
        read_at: readAt,
        is_favorited: false
      },
      stats: {
        reading_streak: streak,
        today_date: today
      }
    })
    
  } catch (error: any) {
    console.error('❌ Error in Daily Bible Verse API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

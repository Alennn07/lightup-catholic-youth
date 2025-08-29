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
    
    // Get today's verse
    const { data: todayVerse, error: verseError } = await supabase
      .from('bible_verses')
      .select('*')
      .eq('date', today)
      .single()
    
    if (verseError || !todayVerse) {
      console.log('⚠️ No verse for today, using fallback')
      return NextResponse.json({
        verse: {
          id: 'Proverbs 17:17',
          text: 'A friend loves at all times, and a brother is born for a time of adversity.',
          reference: 'Proverbs 17:17',
          book: 'Proverbs',
          chapter: 17,
          verse: 17,
          theme: 'Friendship',
          reflection: 'True friends stick with you through good times and bad.',
          action_prompt: 'Take a moment to pray about this verse.'
        },
        user_progress: {
          is_completed: false,
          read_at: null,
          is_favorited: false
        },
        stats: {
          reading_streak: 0,
          today_date: today
        }
      })
    }
    
    // Get user's progress for today
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('verse_date', today)
      .single()
    
    const isCompleted = progress?.is_completed || false
    const readAt = progress?.completed_at || null
    
    // Check if user has favorited this verse
    const { data: favorite, error: favoriteError } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('verse_reference', todayVerse.reference)
      .single()
    
    const isFavorited = !favoriteError && favorite ? true : false
    
    // Calculate reading streak
    let readingStreak = 0
    if (isCompleted) {
      readingStreak = 1
      
      // Count consecutive days backwards
      let checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - 1)
      
      while (true) {
        const checkDateStr = checkDate.toISOString().split('T')[0]
        const { data: prevProgress, error: prevError } = await supabase
          .from('user_progress')
          .select('is_completed')
          .eq('user_id', user.id)
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


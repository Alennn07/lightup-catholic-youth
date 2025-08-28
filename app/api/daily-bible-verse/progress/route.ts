import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { action, verseId } = await request.json()
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    // Create Supabase client with service role for admin operations
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
    
    if (action === 'mark_completed') {
      // Check if progress already exists for today
      const { data: existingProgress, error: selectError } = await supabase
        .from('user_verse_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('verse_date', today)
        .single()
      
      if (existingProgress) {
        // Update existing progress
        const { error: updateError } = await supabase
          .from('user_verse_progress')
          .update({ 
            is_completed: true, 
            read_at: new Date().toISOString() 
          })
          .eq('id', existingProgress.id)
        
        if (updateError) throw updateError
      } else {
        // Insert new progress
        const { error: insertError } = await supabase
          .from('user_verse_progress')
          .insert({
            user_id: user.id,
            verse_id: verseId,
            verse_date: today,
            is_completed: true,
            read_at: new Date().toISOString()
          })
        
        if (insertError) throw insertError
      }
      
      return NextResponse.json({ success: true, message: 'Verse marked as completed' })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    
  } catch (error: any) {
    console.error('Progress API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    // Create Supabase client with service role for admin operations
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
    
    // Get reading streak using the function
    const { data: streakData, error: streakError } = await supabase
      .rpc('get_user_reading_streak', { user_uuid: user.id })
    
    if (streakError) {
      console.error('Streak function error:', streakError)
      return NextResponse.json({ error: 'Failed to get streak' }, { status: 500 })
    }
    
    const readingStreak = streakData || 0
    
    return NextResponse.json({
      stats: {
        reading_streak: readingStreak
      }
    })
    
  } catch (error: any) {
    console.error('Progress API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

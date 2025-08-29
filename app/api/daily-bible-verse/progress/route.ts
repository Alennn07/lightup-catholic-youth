import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { action, verse_id, verseId } = await request.json()
    
    // Handle both parameter names for compatibility
    const actualVerseId = verseId || verse_id
    
    console.log('🔍 Progress API - Action:', action, 'Verse ID:', actualVerseId)
    
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
    console.log('📅 Today\'s date:', today, 'User ID:', user.id)
    
    if (action === 'mark_completed') {
      // Ensure we have a verseId
      if (!actualVerseId) {
        console.log('❌ No verseId provided for mark_completed action')
        return NextResponse.json({ error: 'Verse ID is required' }, { status: 400 })
      }
      
      console.log('✅ Marking verse as completed:', actualVerseId, 'for user:', user.id, 'on date:', today)
      
      // Check if progress already exists for today
      const { data: existingProgress, error: selectError } = await supabase
        .from('user_verse_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('verse_date', today)
        .single()
      
      if (existingProgress) {
        console.log('🔄 Updating existing progress for today')
        // Update existing progress
        const { error: updateError } = await supabase
          .from('user_verse_progress')
          .update({ 
            verse_id: actualVerseId, // Use the actual verse ID
            is_completed: true, 
            read_at: new Date().toISOString() 
          })
          .eq('id', existingProgress.id)
        
        if (updateError) {
          console.log('❌ Update error:', updateError)
          throw updateError
        }
        
        console.log('✅ Progress updated successfully')
      } else {
        console.log('🆕 Creating new progress for today')
        // Insert new progress
        const { error: insertError } = await supabase
          .from('user_verse_progress')
          .insert({
            user_id: user.id,
            verse_id: actualVerseId, // Use the actual verse ID
            verse_date: today,
            is_completed: true,
            read_at: new Date().toISOString()
          })
        
        if (insertError) {
          console.log('❌ Insert error:', insertError)
          throw insertError
        }
        
        console.log('✅ Progress created successfully')
      }
      
      return NextResponse.json({ success: true, message: 'Verse marked as completed' })
    }
    
    if (action === 'toggle_favorite') {
      // Ensure we have a verseId
      if (!actualVerseId) {
        console.log('❌ No verseId provided for toggle_favorite action')
        return NextResponse.json({ error: 'Verse ID is required' }, { status: 400 })
      }
      
      console.log('💖 Toggling favorite for verse:', actualVerseId, 'for user:', user.id)
      
      // Check if verse is already favorited
      const { data: existingFavorite, error: selectError } = await supabase
        .from('favorite_verses')
        .select('id')
        .eq('user_id', user.id)
        .eq('verse_id', actualVerseId)
        .single()
      
      if (existingFavorite) {
        // Remove from favorites
        console.log('🗑️ Removing verse from favorites')
        const { error: deleteError } = await supabase
          .from('favorite_verses')
          .delete()
          .eq('id', existingFavorite.id)
        
        if (deleteError) {
          console.log('❌ Delete error:', deleteError)
          throw deleteError
        }
        
        console.log('✅ Verse removed from favorites')
        return NextResponse.json({ 
          success: true, 
          message: 'Verse removed from favorites',
          is_favorited: false
        })
      } else {
        // Add to favorites
        console.log('❤️ Adding verse to favorites')
        const { error: insertError } = await supabase
          .from('favorite_verses')
          .insert({
            user_id: user.id,
            verse_id: actualVerseId
          })
        
        if (insertError) {
          console.log('❌ Insert error:', insertError)
          throw insertError
        }
        
        console.log('✅ Verse added to favorites')
        return NextResponse.json({ 
          success: true, 
          message: 'Verse added to favorites',
          is_favorited: true
        })
      }
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    
  } catch (error: any) {
    console.error('❌ Progress API error:', error)
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

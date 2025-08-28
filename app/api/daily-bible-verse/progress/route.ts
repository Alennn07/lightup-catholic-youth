import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/daily-bible-verse/progress - Starting request')
    
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

    const body = await request.json()
    const { action, verse_id, verse_text } = body

    if (!action || !verse_id) {
      return NextResponse.json({ error: 'Action and verse_id are required' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]

    if (action === 'mark_completed') {
      // Mark verse as completed for today
      console.log('✅ Marking verse as completed:', verse_id)
      
      try {
        const { data: progress, error: progressError } = await supabase
          .from('user_verse_progress')
          .upsert({
            user_id: user.id,
            verse_id: verse_id, // This is the verse reference (e.g., "John 3:16")
            verse_date: today,
            is_completed: true,
            read_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,verse_id,verse_date'
          })
          .select()
          .single()

        if (progressError) {
          console.error('❌ Error marking verse as completed:', progressError)
          return NextResponse.json({ error: 'Failed to mark verse as completed' }, { status: 500 })
        }

        console.log('✅ Verse marked as completed successfully')
        return NextResponse.json({ 
          success: true, 
          message: 'Verse marked as completed',
          progress: progress
        })
      } catch (error) {
        console.error('❌ Error in mark_completed:', error)
        return NextResponse.json({ error: 'Failed to mark verse as completed' }, { status: 500 })
      }

    } else if (action === 'toggle_favorite') {
      // Toggle favorite status
      console.log('❤️ Toggling favorite status for verse:', verse_id)
      
      try {
        // Check if already favorited
        const { data: existingFavorite, error: checkError } = await supabase
          .from('favorite_verses')
          .select('id')
          .eq('user_id', user.id)
          .eq('verse_id', verse_id)
          .single()

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('❌ Error checking favorite status:', checkError)
          return NextResponse.json({ error: 'Failed to check favorite status' }, { status: 500 })
        }

        if (existingFavorite) {
          // Remove from favorites
          const { error: deleteError } = await supabase
            .from('favorite_verses')
            .delete()
            .eq('user_id', user.id)
            .eq('verse_id', verse_id)

          if (deleteError) {
            console.error('❌ Error removing from favorites:', deleteError)
            return NextResponse.json({ error: 'Failed to remove from favorites' }, { status: 500 })
          }

          console.log('✅ Verse removed from favorites')
          return NextResponse.json({ 
            success: true, 
            message: 'Verse removed from favorites',
            is_favorited: false
          })
        } else {
          // Add to favorites
          const { data: newFavorite, error: insertError } = await supabase
            .from('favorite_verses')
            .insert({
              user_id: user.id,
              verse_id: verse_id,
              verse_text: verse_text || verse_id
            })
            .select()
            .single()

          if (insertError) {
            console.error('❌ Error adding to favorites:', insertError)
            return NextResponse.json({ error: 'Failed to add to favorites' }, { status: 500 })
          }

          console.log('✅ Verse added to favorites')
          return NextResponse.json({ 
            success: true, 
            message: 'Verse added to favorites',
            is_favorited: true,
            favorite: newFavorite
          })
        }
      } catch (error) {
        console.error('❌ Error in toggle_favorite:', error)
        return NextResponse.json({ error: 'Failed to toggle favorite status' }, { status: 500 })
      }

    } else {
      return NextResponse.json({ error: 'Invalid action. Use "mark_completed" or "toggle_favorite"' }, { status: 400 })
    }

  } catch (error: any) {
    console.error('❌ Unexpected error in POST /api/daily-bible-verse/progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GET /api/daily-bible-verse/progress - Starting request')
    
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

    // Get user's favorite verses
    const { data: favoriteVerses, error: favoritesError } = await supabase
      .from('favorite_verses')
      .select('*')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false })

    if (favoritesError) {
      console.error('❌ Error fetching favorite verses:', favoritesError)
      return NextResponse.json({ error: 'Failed to fetch favorite verses' }, { status: 500 })
    }

    // Get user's reading history (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { data: readingHistory, error: historyError } = await supabase
      .from('user_verse_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_completed', true)
      .gte('verse_date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('verse_date', { ascending: false })

    if (historyError) {
      console.error('❌ Error fetching reading history:', historyError)
    }

    // Get user's reading streak
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

    // Get total completed count
    const { count: totalCompleted, error: countError } = await supabase
      .from('user_verse_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_completed', true)

    if (countError) {
      console.log('⚠️ Could not fetch total completed count:', countError)
    }

    const response = {
      favorites: favoriteVerses || [],
      reading_history: readingHistory || [],
      stats: {
        reading_streak: readingStreak,
        total_completed: totalCompleted || 0,
        favorites_count: favoriteVerses?.length || 0
      }
    }

    console.log('✅ User progress data fetched successfully')
    return NextResponse.json(response)

  } catch (error: any) {
    console.error('❌ Unexpected error in GET /api/daily-bible-verse/progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
    console.log(`🎯 Action: ${action} for verse: ${verse_id} on ${today}`)

    if (action === 'mark_completed') {
      // Mark verse as completed for today using real table
      console.log('✅ Marking verse as completed in database')
      
      try {
        // First check if record exists
        const { data: existing, error: checkError } = await supabase
          .from('user_verse_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('verse_id', verse_id)
          .eq('verse_date', today)
          .single()

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('❌ Error checking existing record:', checkError)
          return NextResponse.json({ error: 'Failed to check existing progress' }, { status: 500 })
        }

        let progress
        if (existing) {
          // Update existing record
          const { data: updated, error: updateError } = await supabase
            .from('user_verse_progress')
            .update({
              is_completed: true,
              read_at: new Date().toISOString()
            })
            .eq('id', existing.id)
            .select()
            .single()

          if (updateError) {
            console.error('❌ Error updating record:', updateError)
            return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
          }
          progress = updated
        } else {
          // Insert new record
          const { data: inserted, error: insertError } = await supabase
            .from('user_verse_progress')
            .insert({
              user_id: user.id,
              verse_id: verse_id,
              verse_date: today,
              is_completed: true,
              read_at: new Date().toISOString()
            })
            .select()
            .single()

          if (insertError) {
            console.error('❌ Error inserting record:', insertError)
            return NextResponse.json({ error: 'Failed to insert progress' }, { status: 500 })
          }
          progress = inserted
        }

        console.log('✅ Verse marked as completed successfully in database')
        return NextResponse.json({ 
          success: true, 
          message: 'Verse marked as completed!',
          progress: progress
        })
      } catch (error) {
        console.error('❌ Error in mark_completed:', error)
        return NextResponse.json({ error: 'Failed to mark verse as completed' }, { status: 500 })
      }

    } else if (action === 'toggle_favorite') {
      // For now, just return success since favorites table doesn't exist yet
      console.log('❤️ Favorite toggled (simulated - favorites table not ready)')
      return NextResponse.json({ 
        success: true, 
        message: 'Favorite status updated!',
        note: 'Favorites will be saved once favorites table is created'
      })

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

    // Test if table exists and is accessible
    let tableTest = null
    try {
      const { data: testData, error: testError } = await supabase
        .from('user_verse_progress')
        .select('count')
        .limit(1)
      
      if (testError) {
        console.error('❌ Table test failed:', testError)
        tableTest = { error: testError.message }
      } else {
        console.log('✅ Table test successful')
        tableTest = { success: true }
      }
    } catch (error) {
      console.error('❌ Table test exception:', error)
      tableTest = { error: 'Table not accessible' }
    }

    // Get user's reading history from real table
    let readingHistory = []
    let totalCompleted = 0
    
    try {
      // First get total completed count
      const { count: completedCount, error: countError } = await supabase
        .from('user_verse_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_completed', true)

      if (countError) {
        console.error('❌ Error counting completed verses:', countError)
        totalCompleted = 0
      } else {
        totalCompleted = completedCount || 0
        console.log('✅ Total completed count:', totalCompleted)
      }

      // Then get reading history
      const { data: history, error: historyError } = await supabase
        .from('user_verse_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .order('verse_date', { ascending: false })
        .limit(30)

      if (historyError) {
        console.error('❌ Error fetching reading history:', historyError)
        readingHistory = []
      } else {
        readingHistory = history || []
        console.log('✅ Reading history count:', readingHistory.length)
      }
    } catch (error) {
      console.error('❌ Exception in data fetching:', error)
      totalCompleted = 0
      readingHistory = []
    }

    // For now, return data from real table (no favorites yet)
    const response = {
      favorites: [],
      reading_history: readingHistory,
      stats: {
        reading_streak: 0, // We'll add this later
        total_completed: totalCompleted,
        favorites_count: 0
      },
      table_test: tableTest,
      note: 'Progress tracking is now live! Favorites coming next.'
    }

    console.log('✅ User progress data fetched from real database')
    return NextResponse.json(response)

  } catch (error: any) {
    console.error('❌ Unexpected error in GET /api/daily-bible-verse/progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

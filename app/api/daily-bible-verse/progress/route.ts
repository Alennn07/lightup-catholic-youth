import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logIfEnabled, logPerformanceIfEnabled } from '@/lib/performance-monitor'
import { getUserTimezone, isTodayInTimezone } from '@/lib/streak-calculator'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const days = parseInt(searchParams.get('days') || '7')
    if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('user_progress')
      .select('is_completed, verse_date')
      .eq('user_id', userId)
      .gte('verse_date', since)

    if (error) return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })

    const completedCount = (data || []).filter(r => r.is_completed).length
    const todayKey = new Date().toISOString().split('T')[0]
    const completedToday = (data || []).some(r => r.verse_date === todayKey && r.is_completed)

    return NextResponse.json({ completedCount, completedToday })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { action, date, is_favorited, timezone } = await request.json()
    const userTimezone = timezone || getUserTimezone()
    
    logIfEnabled(`🔍 Progress API - Action: ${action}, Date: ${date}, Timezone: ${userTimezone}`)
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    // Create Supabase client with optimized settings
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { 
        auth: { autoRefreshToken: false, persistSession: false },
        db: { schema: 'public' }
      }
    )
    
    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    // Use provided date or default to today in user's timezone
    const targetDate = date || new Date().toLocaleString("en-US", { timeZone: userTimezone }).split(',')[0]
    logIfEnabled(`📅 Target date: ${targetDate}, User: ${user.id}, Timezone: ${userTimezone}`)
    
    if (action === 'mark_completed') {
      logIfEnabled(`✅ Marking verse as completed for date: ${targetDate}`)
      
      // 🚀 OPTIMIZED: Single upsert operation instead of check-then-insert/update
      const { error: upsertError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          verse_date: targetDate,
          is_completed: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,verse_date' // Use composite key for conflict resolution
        })
      
      if (upsertError) {
        logIfEnabled(`❌ Error upserting progress: ${upsertError.message}`, 'error')
        throw upsertError
      }
      
      logIfEnabled('✅ Progress upserted successfully')
      
      const endTime = Date.now()
      const totalDuration = endTime - startTime
      logPerformanceIfEnabled('Progress API - Mark Completed', totalDuration)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Verse marked as completed',
        date: targetDate
      })
    }
    
    if (action === 'toggle_favorite') {
      logIfEnabled(`❤️ Toggling favorite status for date: ${targetDate}, is_favorited: ${is_favorited}`)
      
      // 🚀 OPTIMIZED: Single upsert operation for favorite status
      const { error: upsertError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          verse_date: targetDate,
          is_favorited: is_favorited,
          favorited_at: is_favorited ? new Date().toISOString() : null
        }, {
          onConflict: 'user_id,verse_date' // Use composite key for conflict resolution
        })
      
      if (upsertError) {
        logIfEnabled(`❌ Error upserting favorite status: ${upsertError.message}`, 'error')
        throw upsertError
      }
      
      logIfEnabled('✅ Favorite status updated successfully')
      
      const endTime = Date.now()
      const totalDuration = endTime - startTime
      logPerformanceIfEnabled('Progress API - Toggle Favorite', totalDuration)
      
      return NextResponse.json({ 
        success: true, 
        message: is_favorited ? 'Verse added to favorites' : 'Verse removed from favorites',
        date: targetDate,
        is_favorited
      })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    
  } catch (error: any) {
    const endTime = Date.now()
    const totalDuration = endTime - startTime
    
    logIfEnabled(`❌ Error in Progress API after ${totalDuration}ms: ${error.message || 'Unknown error'}`, 'error')
    logPerformanceIfEnabled('Progress API - Error', totalDuration)
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

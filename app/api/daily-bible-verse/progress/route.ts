import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logIfEnabled } from '@/lib/performance-monitor'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { action, date } = await request.json()
    
    logIfEnabled(`🔍 Progress API - Action: ${action}, Date: ${date}`)
    
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
    
    // Use provided date or default to today
    const targetDate = date || new Date().toISOString().split('T')[0]
    logIfEnabled(`📅 Target date: ${targetDate}, User: ${user.id}`)
    
    if (action === 'mark_completed') {
      logIfEnabled(`✅ Marking verse as completed for date: ${targetDate}`)
      
      // Check if progress already exists for the target date
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('verse_date', targetDate)
        .single()
      
      if (existingProgress) {
        // Update existing progress
        const { error: updateError } = await supabase
          .from('user_progress')
          .update({ 
            is_completed: true, 
            completed_at: new Date().toISOString() 
          })
          .eq('id', existingProgress.id)
        
        if (updateError) {
          logIfEnabled(`❌ Error updating progress: ${updateError.message}`, 'error')
          throw updateError
        }
        logIfEnabled('✅ Progress updated successfully')
      } else {
        // Insert new progress
        const { error: insertError } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            verse_date: targetDate,
            is_completed: true,
            completed_at: new Date().toISOString()
          })
        
        if (insertError) {
          logIfEnabled(`❌ Error creating progress: ${insertError.message}`, 'error')
          throw insertError
        }
        logIfEnabled('✅ Progress created successfully')
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Verse marked as completed',
        date: targetDate
      })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    
  } catch (error: any) {
    logIfEnabled(`❌ Error in Progress API: ${error.message || 'Unknown error'}`, 'error')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { action, verse_id } = await request.json()
    
    console.log('🔍 Progress API - Action:', action, 'Verse ID:', verse_id)
    
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
    
    if (action === 'mark_completed') {
      if (!verse_id) {
        return NextResponse.json({ error: 'Verse ID is required' }, { status: 400 })
      }
      
      console.log('✅ Marking verse as completed:', verse_id)
      
      // Check if progress already exists for today
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('verse_date', today)
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
        
        if (updateError) throw updateError
        console.log('✅ Progress updated successfully')
      } else {
        // Insert new progress
        const { error: insertError } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            verse_date: today,
            is_completed: true,
            completed_at: new Date().toISOString()
          })
        
        if (insertError) throw insertError
        console.log('✅ Progress created successfully')
      }
      
      return NextResponse.json({ success: true, message: 'Verse marked as completed' })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    
  } catch (error: any) {
    console.error('❌ Error in Progress API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

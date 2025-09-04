import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logIfEnabled } from '@/lib/performance-monitor'

export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { 
        auth: { autoRefreshToken: false, persistSession: false },
        db: { schema: 'public' }
      }
    )

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('group_id')

    // Build query
    let query = supabase
      .from('group_notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)

    if (groupId) {
      query = query.eq('group_id', groupId)
    }

    const { data: notifications, error: updateError } = await query.select()

    if (updateError) {
      logIfEnabled(`❌ Error marking all notifications as read: ${updateError.message}`, 'error')
      return NextResponse.json({ error: 'Failed to mark notifications as read' }, { status: 500 })
    }

    logIfEnabled(`✅ All notifications marked as read for user ${user.id}`)

    return NextResponse.json({
      success: true,
      message: 'All notifications marked as read',
      updated_count: notifications?.length || 0
    })

  } catch (error: any) {
    logIfEnabled(`❌ Error in mark all notifications as read API: ${error.message}`, 'error')
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

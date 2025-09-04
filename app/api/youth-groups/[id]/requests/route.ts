import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logIfEnabled } from '@/lib/performance-monitor'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: groupId } = params
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

    // Check if user is group owner
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('owner_id, name')
      .eq('id', groupId)
      .single()

    if (groupError || !group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    if (group.owner_id !== user.id) {
      return NextResponse.json({ error: 'Only group owners can view join requests' }, { status: 403 })
    }

    // Get pending join requests
    const { data: requests, error: requestsError } = await supabase
      .from('group_join_requests')
      .select(`
        id,
        user_id,
        message,
        status,
        requested_at
      `)
      .eq('group_id', groupId)
      .eq('status', 'pending')
      .order('requested_at', { ascending: false })

    if (requestsError) {
      logIfEnabled(`❌ Error fetching join requests: ${requestsError.message}`, 'error')
      return NextResponse.json({ error: 'Failed to fetch join requests' }, { status: 500 })
    }

    logIfEnabled(`✅ Join requests fetched for group ${groupId}: ${requests?.length || 0} requests`)
    
    // Debug: Log the actual requests data
    if (requests && requests.length > 0) {
      logIfEnabled(`📋 Requests data:`, requests.map(r => ({ id: r.id, status: r.status, user_id: r.user_id })))
    }

    return NextResponse.json({
      success: true,
      requests: requests || []
    })

  } catch (error: any) {
    logIfEnabled(`❌ Error in join requests API: ${error.message}`, 'error')
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

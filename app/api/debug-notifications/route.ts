import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
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

    // Get all notifications for this user
    const { data: notifications, error: notificationsError } = await supabase
      .from('group_notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (notificationsError) {
      return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
    }

    // Get all join requests for groups owned by this user
    const { data: ownedGroups, error: ownedGroupsError } = await supabase
      .from('youth_groups')
      .select('id, name')
      .eq('owner_id', user.id)

    if (ownedGroupsError) {
      return NextResponse.json({ error: 'Failed to fetch owned groups' }, { status: 500 })
    }

    const ownedGroupIds = ownedGroups?.map(g => g.id) || []

    const { data: joinRequests, error: joinRequestsError } = await supabase
      .from('group_join_requests')
      .select(`
        id,
        group_id,
        user_id,
        message,
        status,
        requested_at,
        youth_groups!inner(name)
      `)
      .in('group_id', ownedGroupIds)
      .order('requested_at', { ascending: false })

    if (joinRequestsError) {
      return NextResponse.json({ error: 'Failed to fetch join requests' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email
      },
      ownedGroups: ownedGroups || [],
      notifications: notifications || [],
      joinRequests: joinRequests || []
    })

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

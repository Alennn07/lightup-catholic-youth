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

    // Get group information
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('id, name, owner_id, is_public, requires_approval, is_active')
      .eq('id', groupId)
      .single()

    if (groupError || !group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    // Get user's membership status
    const { data: membership, error: membershipError } = await supabase
      .from('youth_group_members')
      .select('role, status, can_manage_members, can_create_events, can_create_posts')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single()

    // Get pending join request
    const { data: joinRequest, error: joinRequestError } = await supabase
      .from('group_join_requests')
      .select('status')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single()

    const isOwner = group.owner_id === user.id
    const isMember = membership && membership.status === 'active'
    const isPending = joinRequest && joinRequest.status === 'pending'
    const userRole = membership?.role || 'non_member'

    // Build permissions object
    const permissions = {
      isOwner,
      isMember,
      isPending,
      canManage: isOwner || (membership?.can_manage_members || false),
      canJoin: !isMember && !isPending && group.is_public && group.is_active,
      canLeave: isMember && !isOwner,
      canCreateEvents: isOwner || (membership?.can_create_events || false),
      canCreatePosts: isOwner || (membership?.can_create_posts || false),
      canManageMembers: isOwner || (membership?.can_manage_members || false),
      userRole,
      groupInfo: {
        id: group.id,
        name: group.name,
        isPublic: group.is_public,
        requiresApproval: group.requires_approval,
        isActive: group.is_active,
      }
    }

    logIfEnabled(`✅ Group permissions fetched for user ${user.id} in group ${groupId}`)

    return NextResponse.json({
      success: true,
      permissions
    })

  } catch (error: any) {
    logIfEnabled(`❌ Error in group permissions API: ${error.message}`, 'error')
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

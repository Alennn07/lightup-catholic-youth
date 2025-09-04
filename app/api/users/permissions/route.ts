import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logIfEnabled } from '@/lib/performance-monitor'

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

    // Get user permissions from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('user_role, can_create_groups, is_group_leader')
      .eq('id', user.id)
      .single()

    if (userError) {
      logIfEnabled(`❌ Error fetching user permissions: ${userError.message}`, 'error')
      return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 })
    }

    // Get groups where user is owner
    const { data: ownedGroups, error: ownedGroupsError } = await supabase
      .from('youth_groups')
      .select('id')
      .eq('owner_id', user.id)

    if (ownedGroupsError) {
      logIfEnabled(`❌ Error fetching owned groups: ${ownedGroupsError.message}`, 'error')
    }

    // Get groups where user is member
    const { data: memberGroups, error: memberGroupsError } = await supabase
      .from('youth_group_members')
      .select('group_id, role, can_manage_members, can_create_events, can_create_posts')
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (memberGroupsError) {
      logIfEnabled(`❌ Error fetching member groups: ${memberGroupsError.message}`, 'error')
    }

    const ownedGroupIds = ownedGroups?.map(g => g.id) || []
    const memberGroupData = memberGroups || []

    // Build permissions object
    const permissions = {
      canCreateGroups: userData?.can_create_groups || false,
      isGroupLeader: userData?.is_group_leader || false,
      userRole: userData?.user_role || 'member',
      canManageGroup: (groupId: string) => ownedGroupIds.includes(groupId),
      canJoinGroup: (groupId: string) => {
        // Users can join groups they're not already members of
        return !memberGroupData.some(m => m.group_id === groupId)
      },
      canCreateEvents: (groupId: string) => {
        if (ownedGroupIds.includes(groupId)) return true
        const memberData = memberGroupData.find(m => m.group_id === groupId)
        return memberData?.can_create_events || false
      },
      canCreatePosts: (groupId: string) => {
        if (ownedGroupIds.includes(groupId)) return true
        const memberData = memberGroupData.find(m => m.group_id === groupId)
        return memberData?.can_create_posts || false
      },
      canManageMembers: (groupId: string) => {
        if (ownedGroupIds.includes(groupId)) return true
        const memberData = memberGroupData.find(m => m.group_id === groupId)
        return memberData?.can_manage_members || false
      },
    }

    logIfEnabled(`✅ User permissions fetched for user ${user.id}`)

    return NextResponse.json({
      success: true,
      permissions,
      user: {
        id: user.id,
        email: user.email,
        role: userData?.user_role || 'member',
      }
    })

  } catch (error: any) {
    logIfEnabled(`❌ Error in user permissions API: ${error.message}`, 'error')
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

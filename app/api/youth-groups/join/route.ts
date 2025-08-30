import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logIfEnabled, logPerformanceIfEnabled } from '@/lib/performance-monitor'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    logIfEnabled('🚀 POST /api/youth-groups/join - Starting request')
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create Supabase client with optimized settings
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { 
        auth: { autoRefreshToken: false, persistSession: false },
        db: { schema: 'public' }
      }
    )

    // Verify user token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get request body
    const body = await request.json()
    const { groupId, action } = body // action: 'join' or 'leave'

    if (!groupId || !action) {
      return NextResponse.json({ error: 'Group ID and action are required' }, { status: 400 })
    }

    if (!['join', 'leave'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be "join" or "leave"' }, { status: 400 })
    }

    // 🚀 OPTIMIZED: Single query to get group and check membership
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('id, name, is_public, max_members')
      .eq('id', groupId)
      .eq('is_active', true)
      .single()

    if (groupError || !group) {
      logIfEnabled(`❌ Group not found: ${groupError?.message || 'Group not found'}`, 'error')
      return NextResponse.json({ error: 'Group not found or inactive' }, { status: 404 })
    }

    if (action === 'join') {
      // Check if group is public
      if (!group.is_public) {
        return NextResponse.json({ error: 'This group is private. Contact the group owner to join.' }, { status: 403 })
      }

      // 🚀 OPTIMIZED: Check membership and capacity in parallel
      const [membershipCheck, capacityCheck] = await Promise.all([
        supabase
          .from('group_members')
          .select('id, status')
          .eq('group_id', groupId)
          .eq('user_id', user.id)
          .single(),
        supabase
          .from('group_members')
          .select('*', { count: 'exact', head: true })
          .eq('group_id', groupId)
          .eq('status', 'active')
      ])

      const existingMembership = membershipCheck.data
      const memberCount = capacityCheck.count || 0

      if (existingMembership) {
        if (existingMembership.status === 'active') {
          return NextResponse.json({ error: 'You are already a member of this group' }, { status: 400 })
        } else if (existingMembership.status === 'pending') {
          return NextResponse.json({ error: 'Your membership request is pending approval' }, { status: 400 })
        }
      }

      // Check if group is full
      if (memberCount >= group.max_members) {
        return NextResponse.json({ error: 'This group has reached maximum capacity' }, { status: 400 })
      }

      // 🚀 OPTIMIZED: Use upsert for atomic join operation
      const { data: membership, error: joinError } = await supabase
        .from('group_members')
        .upsert({
          group_id: groupId,
          user_id: user.id,
          role: 'member',
          status: 'active'
        }, {
          onConflict: 'group_id,user_id'
        })
        .select()
        .single()

      if (joinError) {
        logIfEnabled(`❌ Error joining group: ${joinError.message}`, 'error')
        return NextResponse.json({ error: 'Failed to join group' }, { status: 500 })
      }

      const endTime = Date.now()
      const totalDuration = endTime - startTime
      logPerformanceIfEnabled('Youth Groups Join API - POST', totalDuration)
      
      logIfEnabled('✅ User joined group successfully')
      return NextResponse.json({ 
        message: 'Successfully joined group',
        membership,
        group: { id: group.id, name: group.name }
      })

    } else if (action === 'leave') {
      // Check if user is a member
      const { data: membership } = await supabase
        .from('group_members')
        .select('id, role')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .single()

      if (!membership) {
        return NextResponse.json({ error: 'You are not a member of this group' }, { status: 400 })
      }

      // Group owners cannot leave (they must delete the group instead)
      if (membership.role === 'owner') {
        return NextResponse.json({ error: 'Group owners cannot leave. You must delete the group instead.' }, { status: 400 })
      }

      // Leave the group
      const { error: leaveError } = await supabase
        .from('group_members')
        .delete()
        .eq('id', membership.id)

      if (leaveError) {
        logIfEnabled(`❌ Error leaving group: ${leaveError.message}`, 'error')
        return NextResponse.json({ error: 'Failed to leave group' }, { status: 500 })
      }

      const endTime = Date.now()
      const totalDuration = endTime - startTime
      logPerformanceIfEnabled('Youth Groups Leave API - POST', totalDuration)
      
      logIfEnabled('✅ User left group successfully')
      return NextResponse.json({ 
        message: 'Successfully left group',
        group: { id: group.id, name: group.name }
      })
    }

  } catch (error: any) {
    const endTime = Date.now()
    const totalDuration = endTime - startTime
    
    logIfEnabled(`❌ Error in Youth Groups Join/Leave API after ${totalDuration}ms: ${error.message || 'Unknown error'}`, 'error')
    logPerformanceIfEnabled('Youth Groups Join/Leave API - Error', totalDuration)
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

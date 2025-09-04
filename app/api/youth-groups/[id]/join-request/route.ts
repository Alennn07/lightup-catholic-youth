import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logIfEnabled } from '@/lib/performance-monitor'

export const dynamic = 'force-dynamic'

export async function POST(
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

    const body = await request.json()
    const { message } = body

    // Get group information
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('id, name, owner_id, is_public, requires_approval, is_active, max_members')
      .eq('id', groupId)
      .single()

    if (groupError || !group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    if (!group.is_active) {
      return NextResponse.json({ error: 'Group is not active' }, { status: 400 })
    }

    // Private groups are allowed - they just require approval
    // if (!group.is_public) {
    //   return NextResponse.json({ error: 'Group is private' }, { status: 403 })
    // }

    // Check if user is already a member
    const { data: existingMembership } = await supabase
      .from('youth_group_members')
      .select('id, status')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single()

    if (existingMembership) {
      if (existingMembership.status === 'active') {
        return NextResponse.json({ error: 'You are already a member of this group' }, { status: 400 })
      } else if (existingMembership.status === 'pending') {
        return NextResponse.json({ error: 'Your membership request is already pending' }, { status: 400 })
      }
    }

    // Check if there's already a pending join request
    const { data: existingRequest } = await supabase
      .from('group_join_requests')
      .select('id, status')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single()

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        return NextResponse.json({ error: 'You already have a pending request to join this group' }, { status: 400 })
      } else if (existingRequest.status === 'approved') {
        return NextResponse.json({ error: 'Your request has already been approved' }, { status: 400 })
      }
    }

    // Check if group has space
    const { count: memberCount } = await supabase
      .from('youth_group_members')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', groupId)
      .eq('status', 'active')

    if (memberCount && memberCount >= group.max_members) {
      return NextResponse.json({ error: 'Group has reached maximum capacity' }, { status: 400 })
    }

    // If group doesn't require approval, add user directly
    if (!group.requires_approval) {
      const { data: newMember, error: joinError } = await supabase
        .from('youth_group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member',
          status: 'active',
          joined_at: new Date().toISOString()
        })
        .select()
        .single()

      if (joinError) {
        logIfEnabled(`❌ Error joining group: ${joinError.message}`, 'error')
        return NextResponse.json({ error: 'Failed to join group' }, { status: 500 })
      }

      // Create notification for group owner
      await supabase
        .from('group_notifications')
        .insert({
          group_id: groupId,
          user_id: group.owner_id,
          type: 'member_joined',
          title: 'New Member Joined',
          message: `A new member has joined ${group.name}.`
        })

      logIfEnabled(`✅ User ${user.id} joined group ${groupId} directly`)

      return NextResponse.json({
        success: true,
        message: 'Successfully joined group',
        membership: newMember
      })
    }

    // Create join request
    const { data: joinRequest, error: requestError } = await supabase
      .from('group_join_requests')
      .insert({
        group_id: groupId,
        user_id: user.id,
        message: message || '',
        status: 'pending'
      })
      .select()
      .single()

    if (requestError) {
      logIfEnabled(`❌ Error creating join request: ${requestError.message}`, 'error')
      return NextResponse.json({ error: 'Failed to create join request' }, { status: 500 })
    }

    // Create notification for group owner
    await supabase
      .from('group_notifications')
      .insert({
        group_id: groupId,
        user_id: group.owner_id,
        type: 'join_request',
        title: 'New Join Request',
        message: `A new member has requested to join ${group.name}.`,
        data: {
          request_id: joinRequest.id,
          requester_id: user.id
        }
      })

    logIfEnabled(`✅ Join request created for user ${user.id} to group ${groupId}`)

    return NextResponse.json({
      success: true,
      message: 'Join request submitted successfully',
      request: joinRequest
    })

  } catch (error: any) {
    logIfEnabled(`❌ Error in join request API: ${error.message}`, 'error')
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

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
      .select('owner_id')
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
        requested_at,
        users!inner(
          id,
          email,
          user_metadata
        )
      `)
      .eq('group_id', groupId)
      .eq('status', 'pending')
      .order('requested_at', { ascending: false })

    if (requestsError) {
      logIfEnabled(`❌ Error fetching join requests: ${requestsError.message}`, 'error')
      return NextResponse.json({ error: 'Failed to fetch join requests' }, { status: 500 })
    }

    logIfEnabled(`✅ Join requests fetched for group ${groupId}`)

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

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logIfEnabled } from '@/lib/performance-monitor'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; requestId: string } }
) {
  try {
    const { id: groupId, requestId } = params
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
    const { action, reviewMessage } = body // action: 'approve' or 'reject'

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be "approve" or "reject"' }, { status: 400 })
    }

    // Check if user is group owner
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('id, name, owner_id, max_members')
      .eq('id', groupId)
      .single()

    if (groupError || !group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    if (group.owner_id !== user.id) {
      return NextResponse.json({ error: 'Only group owners can manage join requests' }, { status: 403 })
    }

    // Get the join request
    const { data: joinRequest, error: requestError } = await supabase
      .from('group_join_requests')
      .select('id, user_id, status, message')
      .eq('id', requestId)
      .eq('group_id', groupId)
      .single()

    if (requestError || !joinRequest) {
      return NextResponse.json({ error: 'Join request not found' }, { status: 404 })
    }

    if (joinRequest.status !== 'pending') {
      return NextResponse.json({ error: 'Request has already been processed' }, { status: 400 })
    }

    // Update the request status
    const { data: updatedRequest, error: updateError } = await supabase
      .from('group_join_requests')
      .update({
        status: action === 'approve' ? 'approved' : 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
        review_message: reviewMessage || ''
      })
      .eq('id', requestId)
      .select()
      .single()

    if (updateError) {
      logIfEnabled(`❌ Error updating join request: ${updateError.message}`, 'error')
      return NextResponse.json({ error: 'Failed to update request' }, { status: 500 })
    }

    if (action === 'approve') {
      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('youth_group_members')
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', joinRequest.user_id)
        .single()

      let newMember = null

      if (!existingMember) {
        // Check if group has space
        const { count: memberCount } = await supabase
          .from('youth_group_members')
          .select('*', { count: 'exact', head: true })
          .eq('group_id', groupId)
          .eq('status', 'active')

        if (memberCount && memberCount >= group.max_members) {
          // Revert the request status
          await supabase
            .from('group_join_requests')
            .update({ status: 'pending' })
            .eq('id', requestId)

          return NextResponse.json({ error: 'Group has reached maximum capacity' }, { status: 400 })
        }

        // Add user to group
        const { data: memberData, error: joinError } = await supabase
          .from('youth_group_members')
          .insert({
            group_id: groupId,
            user_id: joinRequest.user_id,
            role: 'member',
            status: 'active',
            joined_at: new Date().toISOString()
          })
          .select()
          .single()

        if (joinError) {
          logIfEnabled(`❌ Error adding member to group: ${joinError.message}`, 'error')
          return NextResponse.json({ error: 'Failed to add member to group' }, { status: 500 })
        }

        newMember = memberData
      } else {
        // User is already a member, just update their status if needed
        const { data: memberData } = await supabase
          .from('youth_group_members')
          .update({ status: 'active' })
          .eq('group_id', groupId)
          .eq('user_id', joinRequest.user_id)
          .select()
          .single()

        newMember = memberData
      }

      // Create notification for the approved user
      await supabase
        .from('group_notifications')
        .insert({
          group_id: groupId,
          user_id: joinRequest.user_id,
          type: 'request_approved',
          title: 'Join Request Approved',
          message: `Your request to join ${group.name} has been approved!`,
          data: {
            group_name: group.name
          }
        })

      logIfEnabled(`✅ Join request approved for user ${joinRequest.user_id} to group ${groupId}`)

      return NextResponse.json({
        success: true,
        message: 'Join request approved successfully',
        membership: newMember
      })

    } else {
      // Create notification for the rejected user
      await supabase
        .from('group_notifications')
        .insert({
          group_id: groupId,
          user_id: joinRequest.user_id,
          type: 'request_rejected',
          title: 'Join Request Rejected',
          message: `Your request to join ${group.name} has been rejected.`,
          data: {
            group_name: group.name,
            review_message: reviewMessage
          }
        })

      logIfEnabled(`✅ Join request rejected for user ${joinRequest.user_id} to group ${groupId}`)

      return NextResponse.json({
        success: true,
        message: 'Join request rejected successfully'
      })
    }

  } catch (error: any) {
    logIfEnabled(`❌ Error in join request management API: ${error.message}`, 'error')
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

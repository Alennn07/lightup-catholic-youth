import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const { id: groupId, memberId } = params
    
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Verify the current user
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !currentUser) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if the current user is the group owner
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('owner_id')
      .eq('id', groupId)
      .single()

    if (groupError || !group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    if (group.owner_id !== currentUser.id) {
      return NextResponse.json({ error: 'Only group owners can remove members' }, { status: 403 })
    }

    // Check if the member exists and get their details
    const { data: member, error: memberError } = await supabase
      .from('group_members')
      .select('id, user_id, role')
      .eq('id', memberId)
      .eq('group_id', groupId)
      .single()

    if (memberError || !member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // Prevent removing the owner
    if (member.role === 'owner') {
      return NextResponse.json({ error: 'Cannot remove the group owner' }, { status: 400 })
    }

    // Remove the member
    const { error: deleteError } = await supabase
      .from('group_members')
      .delete()
      .eq('id', memberId)

    if (deleteError) {
      console.error('Error removing member:', deleteError)
      return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Member removed successfully'
    })

  } catch (error: any) {
    console.error('Error in DELETE /api/youth-groups/[id]/members/[memberId]:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

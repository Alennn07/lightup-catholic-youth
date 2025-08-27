import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🚀 POST /api/youth-groups/[id]/members - Starting request for group:', params.id)
    
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      console.log('❌ No authorization token provided')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    let user: any
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !authUser) {
        console.log('❌ Auth error:', authError)
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }
      user = authUser
      console.log('✅ User authenticated:', user.id)
    } catch (authError: any) {
      console.error('❌ Error verifying user:', authError)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }

    // Check if user is the owner of this group
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('owner_id, is_public, max_members')
      .eq('id', params.id)
      .single()

    if (groupError || !group) {
      console.error('❌ Group not found:', groupError)
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    if (group.owner_id !== user.id) {
      console.log('❌ User is not the owner of this group')
      return NextResponse.json({ error: 'Only group owners can add members' }, { status: 403 })
    }

    const body = await request.json()
    console.log('📝 Request body:', body)

    if (!body.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Find user by email
    const { data: targetUser, error: userError } = await supabase.auth.admin.listUsers()
    
    if (userError) {
      console.error('❌ Error listing users:', userError)
      return NextResponse.json({ error: 'Failed to find user' }, { status: 500 })
    }

    const targetUserData = targetUser.users.find(u => u.email === body.email)
    if (!targetUserData) {
      return NextResponse.json({ error: 'User with this email not found' }, { status: 404 })
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('group_members')
      .select('id, status')
      .eq('group_id', params.id)
      .eq('user_id', targetUserData.id)
      .single()

    if (existingMember) {
      if (existingMember.status === 'active') {
        return NextResponse.json({ error: 'User is already a member of this group' }, { status: 400 })
      } else if (existingMember.status === 'pending') {
        return NextResponse.json({ error: 'User already has a pending invitation' }, { status: 400 })
      }
    }

    // Check group capacity
    const { count: memberCount, error: countError } = await supabase
      .from('group_members')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', params.id)
      .eq('status', 'active')

    if (countError) {
      console.error('❌ Error counting members:', countError)
      return NextResponse.json({ error: 'Failed to check group capacity' }, { status: 500 })
    }

    if (memberCount && memberCount >= group.max_members) {
      return NextResponse.json({ error: 'Group is at maximum capacity' }, { status: 400 })
    }

    // Add user as member
    const { data: member, error: addError } = await supabase
      .from('group_members')
      .insert([{
        group_id: params.id,
        user_id: targetUserData.id,
        role: 'member',
        status: 'active'
      }])
      .select()
      .single()

    if (addError) {
      console.error('❌ Error adding member:', addError)
      return NextResponse.json({ 
        error: 'Failed to add member',
        details: addError.message 
      }, { status: 500 })
    }

    console.log('✅ Member added successfully:', member.id)
    return NextResponse.json({ 
      member,
      message: 'Member added successfully' 
    }, { status: 201 })

  } catch (error: any) {
    console.error('❌ Unexpected error in POST /api/youth-groups/[id]/members:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

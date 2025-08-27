import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now()
  try {
    const { id: groupId } = params
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

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

    // FAST AUTH: Quick user verification
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !currentUser) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // FAST OWNER CHECK: Quick group ownership verification
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('owner_id')
      .eq('id', groupId)
      .single()

    if (groupError || !group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    if (group.owner_id !== currentUser.id) {
      return NextResponse.json({ error: 'Only group owners can add members' }, { status: 403 })
    }

    // ULTRA-FAST USER LOOKUP: Use proper Supabase auth method
    const { data: targetUser, error: userError } = await supabase.auth.admin.listUsers()
    if (userError) {
      return NextResponse.json({ error: 'Failed to find user' }, { status: 500 })
    }

    const userToAdd = targetUser.users.find(u => u.email === email)
    if (!userToAdd) {
      return NextResponse.json({ error: 'User with this email not found' }, { status: 404 })
    }

    // FAST DUPLICATE CHECK: Quick membership check
    const { data: existingMember } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('user_id', userToAdd.id)
      .maybeSingle()

    if (existingMember) {
      return NextResponse.json({ error: 'User is already a member of this group' }, { status: 400 })
    }

    // FAST INSERT: Add member with minimal data
    const { data: newMember, error: insertError } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        user_id: userToAdd.id,
        role: 'member',
        status: 'active',
        joined_at: new Date().toISOString()
      })
      .select('id, user_id, role, status, joined_at')
      .single()

    if (insertError) {
      console.error('Error adding member:', insertError)
      return NextResponse.json({ error: 'Failed to add member' }, { status: 500 })
    }

    const totalTime = Date.now() - startTime
    console.log(`✅ Member added in ${totalTime}ms`)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Member added successfully',
      member: newMember,
      loadTime: `${totalTime}ms`
    })

  } catch (error: any) {
    console.error('Error in POST /api/youth-groups/[id]/members:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

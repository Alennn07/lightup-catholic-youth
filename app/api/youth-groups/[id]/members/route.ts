import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logIfEnabled } from '@/lib/performance-monitor'
import { enrichMembersWithProfiles } from '@/lib/user-helpers'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: groupId } = params
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    logIfEnabled(`🔍 GET /api/youth-groups/${groupId}/members - Token: ${token ? 'Present' : 'None'}`)

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { 
        auth: { autoRefreshToken: false, persistSession: false },
        db: { schema: 'public' }
      }
    )

    // Try to get user if token exists, but don't require it
    let user = null
    if (token) {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)
      if (!authError && authUser) {
        user = authUser
      }
    }

    // Check if user is group owner or member (only if user is authenticated)
    let membership = null
    let isOwner = false
    let isMember = false
    
    if (user) {
      const { data: membershipData, error: membershipError } = await supabase
        .from('group_members')
        .select('role, status')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .single()

      // Also check if user is group owner
      const { data: group, error: groupError } = await supabase
        .from('youth_groups')
        .select('owner_id')
        .eq('id', groupId)
        .single()

      if (groupError) {
        return NextResponse.json({ error: 'Group not found' }, { status: 404 })
      }

      membership = membershipData
      isOwner = group && group.owner_id === user.id
      isMember = Boolean(membership && membership.status === 'active')

      if (!isOwner && !isMember) {
        console.log('❌ Access denied - User is neither owner nor member:', {
          userId: user.id,
          groupId,
          isOwner,
        isMember,
        membershipError: membershipError?.message,
        groupError: groupError?.message
      })
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    // Get all group members
    const { data: members, error: membersError } = await supabase
      .from('group_members')
      .select(`
        id,
        user_id,
        role,
        status,
        joined_at
      `)
      .eq('group_id', groupId)
      .eq('status', 'active')
      .order('joined_at', { ascending: false })

    if (membersError) {
      logIfEnabled(`❌ Error fetching members: ${membersError.message}`, 'error')
      return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
    }

    // Enrich members with user profile information
    const enrichedMembers = await enrichMembersWithProfiles(members || [])

    logIfEnabled(`✅ Members fetched for group ${groupId}: ${enrichedMembers?.length || 0} members`)
    
    return NextResponse.json({
      success: true,
      members: enrichedMembers
    })

  } catch (error: any) {
    logIfEnabled(`❌ Error in members API: ${error.message}`, 'error')
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

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
      return NextResponse.json({ error: 'Only group owners can add members' }, { status: 403 })
    }

    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Find user by email using the auth system
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers()
    
    if (userError) {
      console.error('Error fetching users:', userError)
      return NextResponse.json({ error: 'Failed to lookup user' }, { status: 500 })
    }

    const targetUser = users.find(u => u.email === email)
    
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Add member to group
    const { data: member, error: addError } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        user_id: targetUser.id,
        role: 'member',
        status: 'active',
        joined_at: new Date().toISOString()
      })
      .select()
      .single()

    if (addError) {
      logIfEnabled(`❌ Error adding member: ${addError.message}`, 'error')
      return NextResponse.json({ error: 'Failed to add member' }, { status: 500 })
    }

    logIfEnabled(`✅ Member added to group ${groupId}: ${email}`)
    
    return NextResponse.json({
      success: true,
      message: 'Member added successfully',
      member
    })

  } catch (error: any) {
    logIfEnabled(`❌ Error in add member API: ${error.message}`, 'error')
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}
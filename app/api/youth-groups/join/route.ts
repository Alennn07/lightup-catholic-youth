import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/youth-groups/join - Starting request')
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      console.log('❌ No authorization token provided')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create Supabase client with service role key
    let supabase: any
    try {
      supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )
      console.log('✅ Supabase client created successfully')
    } catch (clientError: any) {
      console.error('❌ Error creating Supabase client:', clientError)
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    // Verify user token
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

    // Get request body
    const body = await request.json()
    const { groupId, action } = body // action: 'join' or 'leave'

    if (!groupId || !action) {
      return NextResponse.json({ error: 'Group ID and action are required' }, { status: 400 })
    }

    if (!['join', 'leave'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be "join" or "leave"' }, { status: 400 })
    }

    // Check if group exists and is active
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('id, name, is_public, max_members')
      .eq('id', groupId)
      .eq('is_active', true)
      .single()

    if (groupError || !group) {
      console.error('❌ Group not found:', groupError)
      return NextResponse.json({ error: 'Group not found or inactive' }, { status: 404 })
    }

    if (action === 'join') {
      // Check if group is public
      if (!group.is_public) {
        return NextResponse.json({ error: 'This group is private. Contact the group owner to join.' }, { status: 403 })
      }

      // Check if user is already a member
      const { data: existingMembership } = await supabase
        .from('group_members')
        .select('id, status')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .single()

      if (existingMembership) {
        if (existingMembership.status === 'active') {
          return NextResponse.json({ error: 'You are already a member of this group' }, { status: 400 })
        } else if (existingMembership.status === 'pending') {
          return NextResponse.json({ error: 'Your membership request is pending approval' }, { status: 400 })
        }
      }

      // Check if group is full
      const { count: memberCount } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', groupId)
        .eq('status', 'active')

      if (memberCount >= group.max_members) {
        return NextResponse.json({ error: 'This group has reached maximum capacity' }, { status: 400 })
      }

      // Join the group
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
        console.error('❌ Error joining group:', joinError)
        return NextResponse.json({ error: 'Failed to join group' }, { status: 500 })
      }

      console.log('✅ User joined group successfully')
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
        console.error('❌ Error leaving group:', leaveError)
        return NextResponse.json({ error: 'Failed to leave group' }, { status: 500 })
      }

      console.log('✅ User left group successfully')
      return NextResponse.json({ 
        message: 'Successfully left group',
        group: { id: group.id, name: group.name }
      })
    }

  } catch (error: any) {
    console.error('❌ Unexpected error in POST /api/youth-groups/join:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

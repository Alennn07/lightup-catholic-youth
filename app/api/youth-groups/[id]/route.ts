import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🚀 GET /api/youth-groups/[id] - Starting request for group:', params.id)
    
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

    // Get the group with owner and member count
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select(`
        *,
        owner:owner_id(id, email, user_metadata),
        member_count:group_members(count)
      `)
      .eq('id', params.id)
      .eq('is_active', true)
      .single()

    if (groupError) {
      console.error('❌ Error fetching group:', groupError)
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    // Check if user can view this group (public or member)
    const { data: membership } = await supabase
      .from('group_members')
      .select('role, status')
      .eq('group_id', params.id)
      .eq('user_id', user.id)
      .single()

    const canView = group.is_public || membership?.status === 'active'
    if (!canView) {
      console.log('❌ User cannot view this group')
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get group members
    const { data: members, error: membersError } = await supabase
      .from('group_members')
      .select(`
        *,
        user:user_id(id, email, user_metadata)
      `)
      .eq('group_id', params.id)
      .eq('status', 'active')
      .order('joined_at', { ascending: true })

    if (membersError) {
      console.error('❌ Error fetching members:', membersError)
      return NextResponse.json({ error: 'Failed to fetch group members' }, { status: 500 })
    }

    // Get group events
    const { data: events, error: eventsError } = await supabase
      .from('group_events')
      .select('*')
      .eq('group_id', params.id)
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true })
      .limit(5)

    if (eventsError) {
      console.error('❌ Error fetching events:', eventsError)
      return NextResponse.json({ error: 'Failed to fetch group events' }, { status: 500 })
    }

    // Get group posts
    const { data: posts, error: postsError } = await supabase
      .from('group_posts')
      .select(`
        *,
        user:user_id(id, email, user_metadata)
      `)
      .eq('group_id', params.id)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(10)

    if (postsError) {
      console.error('❌ Error fetching posts:', postsError)
      return NextResponse.json({ error: 'Failed to fetch group posts' }, { status: 500 })
    }

    const groupData = {
      ...group,
      user_role: membership?.role || null,
      user_status: membership?.status || null,
      is_member: !!membership,
      members,
      events,
      posts
    }

    console.log('✅ Successfully fetched group data')
    return NextResponse.json({ group: groupData })

  } catch (error: any) {
    console.error('❌ Unexpected error in GET /api/youth-groups/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🚀 PUT /api/youth-groups/[id] - Starting request for group:', params.id)
    
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

    // Check if user is the owner of the group
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('owner_id')
      .eq('id', params.id)
      .single()

    if (groupError || !group) {
      console.error('❌ Group not found:', groupError)
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    if (group.owner_id !== user.id) {
      console.log('❌ User is not the owner of this group')
      return NextResponse.json({ error: 'Only group owners can update groups' }, { status: 403 })
    }

    // Get request body
    const body = await request.json()
    const { name, description, mission_statement, parish, diocese, city, state, country, meeting_location, meeting_time, meeting_frequency, age_range, max_members, is_public } = body

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required' }, { status: 400 })
    }

    // Update the group
    const { data: updatedGroup, error: updateError } = await supabase
      .from('youth_groups')
      .update({
        name,
        description,
        mission_statement,
        parish,
        diocese,
        city,
        state,
        country,
        meeting_location,
        meeting_time,
        meeting_frequency,
        age_range,
        max_members: max_members || 50,
        is_public: is_public !== undefined ? is_public : true
      })
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Error updating group:', updateError)
      return NextResponse.json({ error: 'Failed to update group' }, { status: 500 })
    }

    console.log('✅ Group updated successfully')
    return NextResponse.json({ group: updatedGroup, message: 'Group updated successfully' })

  } catch (error: any) {
    console.error('❌ Unexpected error in PUT /api/youth-groups/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🚀 DELETE /api/youth-groups/[id] - Starting request for group:', params.id)
    
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

    // Check if user is the owner of the group
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('owner_id')
      .eq('id', params.id)
      .single()

    if (groupError || !group) {
      console.error('❌ Group not found:', groupError)
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    if (group.owner_id !== user.id) {
      console.log('❌ User is not the owner of this group')
      return NextResponse.json({ error: 'Only group owners can delete groups' }, { status: 403 })
    }

    // Delete the group (cascade will handle related records)
    const { error: deleteError } = await supabase
      .from('youth_groups')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('❌ Error deleting group:', deleteError)
      return NextResponse.json({ error: 'Failed to delete group' }, { status: 500 })
    }

    console.log('✅ Group deleted successfully')
    return NextResponse.json({ message: 'Group deleted successfully' })

  } catch (error: any) {
    console.error('❌ Unexpected error in DELETE /api/youth-groups/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

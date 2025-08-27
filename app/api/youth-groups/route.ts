import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GET /api/youth-groups - Starting request')
    
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

    // First, check if the youth_groups table exists
    try {
      const { data: tableCheck, error: tableError } = await supabase
        .from('youth_groups')
        .select('id')
        .limit(1)
      
      if (tableError) {
        console.error('❌ Table check failed:', tableError)
        if (tableError.code === '42P01') { // Table doesn't exist
          return NextResponse.json({ 
            error: 'Youth groups table not found. Please run the database setup script first.',
            details: 'The youth_groups table does not exist in your database.'
          }, { status: 500 })
        }
        return NextResponse.json({ error: 'Database table error', details: tableError.message }, { status: 500 })
      }
      
      console.log('✅ Table check passed')
    } catch (tableCheckError: any) {
      console.error('❌ Table check exception:', tableCheckError)
      return NextResponse.json({ 
        error: 'Database connection error',
        details: tableCheckError.message 
      }, { status: 500 })
    }

    // Get all public groups and groups user is member of
    let { data: groups, error: groupsError } = await supabase
      .from('youth_groups')
      .select(`
        *,
        owner:owner_id(id, email, user_metadata)
      `)
      .or(`is_public.eq.true,id.in.(select group_id from group_members where user_id.eq.${user.id} and status.eq.'active')`)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (groupsError) {
      console.error('❌ Error fetching groups:', groupsError)
      return NextResponse.json({ 
        error: 'Failed to fetch groups',
        details: groupsError.message 
      }, { status: 500 })
    }

    // Get member count for each group
    const groupsWithCounts = await Promise.all(
      groups.map(async (group: any) => {
        try {
          const { count, error: countError } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id)
            .eq('status', 'active')
          
          if (countError) {
            console.error(`❌ Error counting members for group ${group.id}:`, countError)
            return { ...group, member_count: 0 }
          }
          
          return { ...group, member_count: count || 0 }
        } catch (countError: any) {
          console.error(`❌ Exception counting members for group ${group.id}:`, countError)
          return { ...group, member_count: 0 }
        }
      })
    )

    // Get user's membership status for each group
    const groupsWithMembership = await Promise.all(
      groupsWithCounts.map(async (group: any) => {
        try {
          const { data: membership } = await supabase
            .from('group_members')
            .select('role, status')
            .eq('group_id', group.id)
            .eq('user_id', user.id)
            .single()

          return {
            ...group,
            user_role: membership?.role || null,
            user_status: membership?.status || null,
            is_member: !!membership
          }
        } catch (membershipError: any) {
          console.error(`❌ Error getting membership for group ${group.id}:`, membershipError)
          return {
            ...group,
            user_role: null,
            user_status: null,
            is_member: false
          }
        }
      })
    )

    console.log(`✅ Successfully fetched ${groupsWithMembership.length} groups`)
    return NextResponse.json({ groups: groupsWithMembership })

  } catch (error: any) {
    console.error('❌ Unexpected error in GET /api/youth-groups:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message || 'Unknown error occurred'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/youth-groups - Starting request')
    
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

    // Check if youth_groups table exists
    try {
      const { error: tableError } = await supabase
        .from('youth_groups')
        .select('id')
        .limit(1)
      
      if (tableError) {
        console.error('❌ Table check failed:', tableError)
        if (tableError.code === '42P01') {
          return NextResponse.json({ 
            error: 'Youth groups table not found. Please run the database setup script first.',
            details: 'The youth_groups table does not exist in your database.'
          }, { status: 500 })
        }
        return NextResponse.json({ error: 'Database table error', details: tableError.message }, { status: 500 })
      }
    } catch (tableCheckError: any) {
      console.error('❌ Table check exception:', tableCheckError)
      return NextResponse.json({ 
        error: 'Database connection error',
        details: tableCheckError.message 
      }, { status: 500 })
    }

    // Get request body
    const body = await request.json()
    const { name, description, mission_statement, parish, diocese, city, state, country, meeting_location, meeting_time, meeting_frequency, age_range, max_members, is_public } = body

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required' }, { status: 400 })
    }

    // Create the group
    const { data: group, error: createError } = await supabase
      .from('youth_groups')
      .insert({
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
        is_public: is_public !== undefined ? is_public : true,
        owner_id: user.id
      })
      .select()
      .single()

    if (createError) {
      console.error('❌ Error creating group:', createError)
      return NextResponse.json({ 
        error: 'Failed to create group',
        details: createError.message 
      }, { status: 500 })
    }

    // Add user as owner
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: user.id,
        role: 'owner',
        status: 'active'
      })

    if (memberError) {
      console.error('❌ Error adding user as member:', memberError)
      // Try to delete the group if adding member fails
      await supabase.from('youth_groups').delete().eq('id', group.id)
      return NextResponse.json({ 
        error: 'Failed to create group',
        details: memberError.message 
      }, { status: 500 })
    }

    console.log('✅ Group created successfully:', group.id)
    return NextResponse.json({ group, message: 'Group created successfully' }, { status: 201 })

  } catch (error: any) {
    console.error('❌ Unexpected error in POST /api/youth-groups:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message || 'Unknown error occurred'
    }, { status: 500 })
  }
}

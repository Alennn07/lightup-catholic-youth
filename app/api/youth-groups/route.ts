import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GET /api/youth-groups - Starting request')
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token) {
      console.log('❌ No authorization token provided')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let supabase: any
    try {
      supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      )
      console.log('✅ Supabase client created successfully')
    } catch (clientError: any) {
      console.error('❌ Error creating Supabase client:', clientError)
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

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

    // First, check if the youth_groups table exists and get basic info
    try {
      console.log('🔍 Checking if youth_groups table exists...')
      const { data: tableCheck, error: tableError } = await supabase
        .from('youth_groups')
        .select('id, name')
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
      console.log('✅ Table check passed, found rows:', tableCheck?.length || 0)
    } catch (tableCheckError: any) {
      console.error('❌ Table check exception:', tableCheckError)
      return NextResponse.json({ 
        error: 'Database connection error',
        details: tableCheckError.message 
      }, { status: 500 })
    }

    // Try a simple query first without complex joins
    console.log('🔍 Attempting simple query without joins...')
    let { data: groups, error: groupsError } = await supabase
      .from('youth_groups')
      .select('*')
      .or(`is_public.eq.true,id.in.(select group_id from group_members where user_id.eq.${user.id} and status.eq.'active')`)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (groupsError) {
      console.error('❌ Error with simple query:', groupsError)
      
      // If simple query fails, try even simpler
      console.log('🔍 Trying even simpler query...')
      const { data: simpleGroups, error: simpleError } = await supabase
        .from('youth_groups')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (simpleError) {
        console.error('❌ Even simple query failed:', simpleError)
        return NextResponse.json({ 
          error: 'Failed to fetch groups',
          details: simpleError.message 
        }, { status: 500 })
      }
      
      console.log('✅ Simple query succeeded, filtering in code...')
      // Filter in code instead of database
      groups = simpleGroups.filter((group: any) => 
        group.is_public || 
        (group.owner_id === user.id) // Simple owner check
      )
    } else {
      console.log('✅ Complex query succeeded')
    }

    if (!groups || groups.length === 0) {
      console.log('ℹ️ No groups found, returning empty array')
      return NextResponse.json({ groups: [] })
    }

    console.log(`✅ Found ${groups.length} groups, processing...`)

    // Get member count for each group (simplified)
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
            is_member: !!membership,
            // Add owner info without complex join
            is_owner: group.owner_id === user.id
          }
        } catch (membershipError: any) {
          console.error(`❌ Error getting membership for group ${group.id}:`, membershipError)
          return {
            ...group,
            user_role: null,
            user_status: null,
            is_member: false,
            is_owner: group.owner_id === user.id
          }
        }
      })
    )

    console.log(`✅ Successfully processed ${groupsWithMembership.length} groups`)
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

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      console.log('❌ Auth error:', authError)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    console.log('📝 Request body:', body)

    // Create the group
    const { data: group, error: createError } = await supabase
      .from('youth_groups')
      .insert([{
        name: body.name,
        description: body.description,
        mission_statement: body.mission_statement,
        parish: body.parish,
        diocese: body.diocese,
        city: body.city,
        state: body.state,
        country: body.country,
        meeting_location: body.meeting_location,
        meeting_time: body.meeting_time,
        meeting_frequency: body.meeting_frequency,
        age_range: body.age_range,
        max_members: body.max_members || 50,
        is_public: body.is_public !== undefined ? body.is_public : true,
        owner_id: user.id
      }])
      .select()
      .single()

    if (createError) {
      console.error('❌ Error creating group:', createError)
      return NextResponse.json({ 
        error: 'Failed to create group',
        details: createError.message 
      }, { status: 500 })
    }

    // Add the creator as an owner member
    const { error: memberError } = await supabase
      .from('group_members')
      .insert([{
        group_id: group.id,
        user_id: user.id,
        role: 'owner',
        status: 'active'
      }])

    if (memberError) {
      console.error('❌ Error adding owner as member:', memberError)
      // Don't fail the whole request, just log the error
    }

    console.log('✅ Group created successfully:', group.id)
    return NextResponse.json({ group })

  } catch (error: any) {
    console.error('❌ Unexpected error in POST /api/youth-groups:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message || 'Unknown error occurred'
    }, { status: 500 })
  }
}

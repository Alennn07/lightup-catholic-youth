import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
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

    // ULTRA-FAST LOADING: Get only essential data, no member counts initially
    console.log('🚀 ULTRA-FAST LOADING: Fetching minimal data...')
    let { data: groups, error: groupsError } = await supabase
      .from('youth_groups')
      .select('id, name, description, parish, city, state, country, meeting_time, age_range, max_members, is_public, is_active, owner_id, created_at')
      .or(`is_public.eq.true,id.in.(select group_id from group_members where user_id.eq.${user.id} and status.eq.'active')`)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(10) // Limit to 10 groups for faster loading

    if (groupsError) {
      console.error('❌ Error with ultra-fast loading query:', groupsError)
      
      // Fallback to simple query
      console.log('🔍 Trying simple query...')
      const { data: simpleGroups, error: simpleError } = await supabase
        .from('youth_groups')
        .select('id, name, description, parish, city, state, country, meeting_time, age_range, max_members, is_public, is_active, owner_id, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10)
      
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
      console.log('✅ Ultra-fast loading query succeeded')
    }

    if (!groups || groups.length === 0) {
      console.log('ℹ️ No groups found, returning empty array')
      return NextResponse.json({ groups: [] })
    }

    console.log(`✅ Found ${groups.length} groups, processing...`)

    // FAST PROCESSING: Add basic info without expensive member counts
    const groupsWithBasicInfo = groups.map((group: any) => ({
      ...group,
      member_count: 0, // Will be loaded on demand if needed
      user_role: null, // Will be loaded on demand if needed
      user_status: null, // Will be loaded on demand if needed
      is_member: group.owner_id === user.id, // Quick check
      is_owner: group.owner_id === user.id
    }))

    const loadTime = Date.now() - startTime
    console.log(`✅ Ultra-fast loading completed in ${loadTime}ms: ${groupsWithBasicInfo.length} groups`)
    return NextResponse.json({ 
      groups: groupsWithBasicInfo,
      loadTime: `${loadTime}ms`
    })

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

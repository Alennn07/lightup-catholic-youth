import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GET /api/youth-groups - Starting request')
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Simple query without user-specific data
    const { data: groups, error: groupsError } = await supabase
      .from('youth_groups')
      .select(`
        id, 
        name, 
        description, 
        parish, 
        city, 
        state, 
        country, 
        meeting_time, 
        age_range, 
        max_members, 
        is_public, 
        is_active, 
        owner_id, 
        requires_approval,
        created_at
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(50)

    if (groupsError) {
      console.error(`❌ Error fetching groups: ${groupsError.message}`, groupsError)
      return NextResponse.json({ 
        error: 'Failed to fetch groups',
        details: groupsError.message 
      }, { status: 500 })
    }

    console.log(`✅ Found ${groups?.length || 0} groups`)

    // Add basic user info (no complex queries)
    const groupsWithUserInfo = (groups || []).map(group => ({
      ...group,
      is_owner: false,
      is_member: false,
      is_pending: false,
      user_role: 'none'
    }))

    return NextResponse.json({ 
      groups: groupsWithUserInfo,
      total: groupsWithUserInfo.length
    })

  } catch (error: any) {
    console.error(`❌ Error in Youth Groups API:`, error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message || 'Unknown error occurred'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/youth-groups - Starting request')
    
    const body = await request.json()
    const { name, description, parish, city, state, country, meeting_time, age_range, max_members, is_public, requires_approval } = body

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get user from token
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Create group
    const { data: group, error: createError } = await supabase
      .from('youth_groups')
      .insert([{
        name,
        description,
        parish,
        city,
        state,
        country,
        meeting_time,
        age_range,
        max_members: max_members || 50,
        is_public: is_public !== false,
        is_active: true,
        owner_id: user.id,
        requires_approval: requires_approval !== false
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
      .from('youth_group_members')
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
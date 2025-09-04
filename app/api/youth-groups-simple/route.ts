import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GET /api/youth-groups-simple - Starting request')
    
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
    console.error(`❌ Error in Youth Groups Simple API:`, error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message || 'Unknown error occurred'
    }, { status: 500 })
  }
}

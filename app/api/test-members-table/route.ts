import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // First, get the actual group ID for LYGGG
    const { data: groups, error: groupsError } = await supabase
      .from('youth_groups')
      .select('id, name')
      .eq('name', 'LYGGG')
      .limit(1)

    if (groupsError || !groups || groups.length === 0) {
      return NextResponse.json({ 
        error: 'LYGGG group not found', 
        details: groupsError?.message 
      }, { status: 404 })
    }

    const testGroupId = groups[0].id
    const testUserId = 'd2adf254-832d-4178-8fe6-bea77a02a57f' // The user from the request

    const { data, error } = await supabase
      .from('youth_group_members')
      .insert({
        group_id: testGroupId,
        user_id: testUserId,
        role: 'member',
        status: 'active',
        joined_at: new Date().toISOString()
      })
      .select()

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to insert member', 
        details: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Member added successfully',
      data: data
    })

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

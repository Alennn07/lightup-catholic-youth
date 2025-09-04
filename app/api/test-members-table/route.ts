import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Step 1: Check if youth_group_members table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('youth_group_members')
      .select('*')
      .limit(1)

    if (tableError) {
      return NextResponse.json({ 
        error: 'Table check failed', 
        details: tableError.message,
        code: tableError.code
      }, { status: 500 })
    }

    // Step 2: Get all groups to see what we have
    const { data: allGroups, error: groupsError } = await supabase
      .from('youth_groups')
      .select('id, name, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    if (groupsError) {
      return NextResponse.json({ 
        error: 'Failed to fetch groups', 
        details: groupsError.message 
      }, { status: 500 })
    }

    // Step 3: Try to find LYGGG group
    const lygggGroup = allGroups?.find(group => group.name === 'LYGGG')

    if (!lygggGroup) {
      return NextResponse.json({ 
        error: 'LYGGG group not found', 
        availableGroups: allGroups?.map(g => ({ id: g.id, name: g.name }))
      }, { status: 404 })
    }

    // Step 4: Check if user is already a member
    const testUserId = 'd2adf254-832d-4178-8fe6-bea77a02a57f'
    
    const { data: existingMember, error: checkError } = await supabase
      .from('youth_group_members')
      .select('*')
      .eq('group_id', lygggGroup.id)
      .eq('user_id', testUserId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      return NextResponse.json({ 
        error: 'Failed to check existing membership', 
        details: checkError.message 
      }, { status: 500 })
    }

    if (existingMember) {
      return NextResponse.json({ 
        success: true, 
        message: 'User is already a member (this is expected)',
        groupId: lygggGroup.id,
        existingMember: existingMember,
        note: 'The table is working correctly! Now try the real approve/reject feature.'
      })
    }

    // If not a member, try to insert
    const { data, error } = await supabase
      .from('youth_group_members')
      .insert({
        group_id: lygggGroup.id,
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
        hint: error.hint,
        groupId: lygggGroup.id,
        groupIdType: typeof lygggGroup.id
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Member added successfully',
      groupId: lygggGroup.id,
      data: data
    })

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

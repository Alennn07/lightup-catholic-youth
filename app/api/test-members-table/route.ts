import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Try to insert a test member
    const testGroupId = 1 // Use the first group ID
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

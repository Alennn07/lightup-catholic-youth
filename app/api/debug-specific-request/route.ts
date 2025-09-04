import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get('requestId')
    
    if (!requestId) {
      return NextResponse.json({ error: 'requestId is required' }, { status: 400 })
    }

    console.log(`🔍 Debugging request: ${requestId}`)

    // Get the specific request
    const { data: request, error: requestError } = await supabase
      .from('group_join_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (requestError) {
      console.error('❌ Error fetching request:', requestError)
      return NextResponse.json({ error: requestError.message }, { status: 500 })
    }

    console.log('📋 Request details:', request)

    // Check if user is already a member
    const { data: member, error: memberError } = await supabase
      .from('youth_group_members')
      .select('*')
      .eq('group_id', request.group_id)
      .eq('user_id', request.user_id)
      .single()

    console.log('👤 Member status:', member)
    console.log('❌ Member error:', memberError)

    return NextResponse.json({
      success: true,
      request,
      member,
      memberError: memberError?.message
    })

  } catch (error) {
    console.error('❌ Debug error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

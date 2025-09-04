import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Listing all join requests...')

    // Get all join requests
    const { data: requests, error: requestsError } = await supabase
      .from('group_join_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (requestsError) {
      console.error('❌ Error fetching requests:', requestsError)
      return NextResponse.json({ error: requestsError.message }, { status: 500 })
    }

    console.log('📋 All requests:', requests)

    return NextResponse.json({
      success: true,
      requests: requests,
      count: requests?.length || 0
    })

  } catch (error) {
    console.error('❌ List error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

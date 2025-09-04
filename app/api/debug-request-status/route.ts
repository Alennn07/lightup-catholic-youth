import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId')
    const requestId = searchParams.get('requestId')

    if (!groupId || !requestId) {
      return NextResponse.json({ error: 'Missing groupId or requestId' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get the specific request
    const { data: request, error: requestError } = await supabase
      .from('group_join_requests')
      .select('*')
      .eq('id', requestId)
      .eq('group_id', groupId)
      .single()

    if (requestError) {
      return NextResponse.json({ 
        error: 'Failed to fetch request', 
        details: requestError.message 
      }, { status: 500 })
    }

    // Get all requests for this group
    const { data: allRequests, error: allRequestsError } = await supabase
      .from('group_join_requests')
      .select('id, status, user_id, requested_at')
      .eq('group_id', groupId)
      .order('requested_at', { ascending: false })

    if (allRequestsError) {
      return NextResponse.json({ 
        error: 'Failed to fetch all requests', 
        details: allRequestsError.message 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      specificRequest: request,
      allRequests: allRequests,
      groupId,
      requestId
    })

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

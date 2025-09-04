import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId')

    if (!groupId) {
      return NextResponse.json({ error: 'Missing groupId' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get all requests for this group
    const { data: allRequests, error: allRequestsError } = await supabase
      .from('group_join_requests')
      .select('id, status, user_id, requested_at, reviewed_at')
      .eq('group_id', groupId)
      .order('requested_at', { ascending: false })

    if (allRequestsError) {
      return NextResponse.json({ 
        error: 'Failed to fetch requests', 
        details: allRequestsError.message 
      }, { status: 500 })
    }

    // Get only pending requests
    const pendingRequests = allRequests?.filter(req => req.status === 'pending') || []
    const approvedRequests = allRequests?.filter(req => req.status === 'approved') || []
    const rejectedRequests = allRequests?.filter(req => req.status === 'rejected') || []

    return NextResponse.json({
      success: true,
      groupId,
      totalRequests: allRequests?.length || 0,
      pendingRequests: pendingRequests.length,
      approvedRequests: approvedRequests.length,
      rejectedRequests: rejectedRequests.length,
      allRequests: allRequests,
      pendingDetails: pendingRequests,
      approvedDetails: approvedRequests
    })

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

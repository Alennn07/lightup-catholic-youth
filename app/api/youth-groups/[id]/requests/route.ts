import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logIfEnabled } from '@/lib/performance-monitor'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: groupId } = params
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Force a fresh connection to avoid read replica lag
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { 
        auth: { autoRefreshToken: false, persistSession: false },
        db: { schema: 'public' },
        global: {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      }
    )

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if user is group owner
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('owner_id, name')
      .eq('id', groupId)
      .single()

    if (groupError || !group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    if (group.owner_id !== user.id) {
      return NextResponse.json({ error: 'Only group owners can view join requests' }, { status: 403 })
    }

    // Force refresh by adding a timestamp to bypass any caching
    const timestamp = Date.now()
    logIfEnabled(`🔄 Force refreshing requests at timestamp: ${timestamp}`)
    
    // Add a small delay to ensure database consistency
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Retry mechanism to handle database consistency issues
    let allRequests = null
    let allRequestsError = null
    let retryCount = 0
    const maxRetries = 3
    
    while (retryCount < maxRetries) {
      logIfEnabled(`🔄 Attempt ${retryCount + 1}/${maxRetries} to fetch requests`)
      
      const result = await supabase
        .from('group_join_requests')
        .select(`
          id,
          user_id,
          message,
          status,
          requested_at,
          reviewed_at
        `)
        .eq('group_id', groupId)
        .order('requested_at', { ascending: false })
        .limit(100) // Force fresh query
      
      allRequests = result.data
      allRequestsError = result.error
      
      if (!allRequestsError && allRequests) {
        logIfEnabled(`✅ Successfully fetched requests on attempt ${retryCount + 1}`)
        break
      }
      
      retryCount++
      if (retryCount < maxRetries) {
        logIfEnabled(`⚠️ Retry ${retryCount} after 500ms delay`)
        await new Promise(resolve => setTimeout(resolve, 500 * retryCount)) // Exponential backoff
      }
    }

    if (allRequestsError) {
      logIfEnabled(`❌ Error fetching all requests: ${allRequestsError.message}`, 'error')
      return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 })
    }

    logIfEnabled(`🔍 ALL REQUESTS for group ${groupId}:`, allRequests?.map(r => ({ 
      id: r.id, 
      status: r.status, 
      user_id: r.user_id,
      reviewed_at: r.reviewed_at 
    })))

    // Filter for pending requests
    const requests = (allRequests || []).filter(req => req.status === 'pending')
    logIfEnabled(`🔍 FILTERED PENDING requests:`, requests.map(r => ({ 
      id: r.id, 
      status: r.status, 
      user_id: r.user_id 
    })))
    
    // Check for potential database inconsistency
    const approvedRequests = (allRequests || []).filter(req => req.status === 'approved')
    if (approvedRequests.length > 0) {
      logIfEnabled(`⚠️ WARNING: Found ${approvedRequests.length} approved requests that might be showing as pending due to database lag`)
      logIfEnabled(`🔍 Approved requests:`, approvedRequests.map(r => ({ 
        id: r.id, 
        status: r.status, 
        user_id: r.user_id,
        reviewed_at: r.reviewed_at 
      })))
    }

    logIfEnabled(`✅ Join requests fetched for group ${groupId}: ${requests?.length || 0} requests`)
    
    // Debug: Log the actual requests data
    if (requests && requests.length > 0) {
      logIfEnabled(`📋 Requests data:`, requests.map(r => ({ id: r.id, status: r.status, user_id: r.user_id })))
    }

    return NextResponse.json({
      success: true,
      requests: requests || []
    })

  } catch (error: any) {
    logIfEnabled(`❌ Error in join requests API: ${error.message}`, 'error')
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

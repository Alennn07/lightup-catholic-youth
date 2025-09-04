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

    console.log(`🔍 Testing request status for: ${requestId}`)

    // Get the specific request with all details
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

    // Try to manually update the status to 'approved'
    console.log('🔄 Attempting manual update to approved...')
    const { data: updateResult, error: updateError } = await supabase
      .from('group_join_requests')
      .update({ status: 'approved' })
      .eq('id', requestId)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Manual update failed:', updateError)
      return NextResponse.json({ 
        error: 'Manual update failed', 
        details: updateError.message,
        originalRequest: request
      }, { status: 500 })
    }

    console.log('✅ Manual update successful:', updateResult)

    return NextResponse.json({
      success: true,
      originalRequest: request,
      updateResult: updateResult,
      message: 'Status updated to approved'
    })

  } catch (error) {
    console.error('❌ Test error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

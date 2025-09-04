import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { requestId, status } = await request.json()

    if (!requestId || !status) {
      return NextResponse.json({ error: 'Missing requestId or status' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    console.log(`Manually updating request ${requestId} to status: ${status}`)

    const { data: updatedRequest, error: updateError } = await supabase
      .from('group_join_requests')
      .update({
        status: status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: '00000000-0000-0000-0000-000000000000', // Dummy user ID
        review_message: 'Manual update'
      })
      .eq('id', requestId)
      .select()
      .single()

    if (updateError) {
      console.error(`❌ Error updating request: ${updateError.message}`, updateError)
      return NextResponse.json({ 
        error: 'Failed to update request', 
        details: updateError.message,
        code: updateError.code
      }, { status: 500 })
    }

    console.log(`✅ Request updated successfully:`, updatedRequest)

    return NextResponse.json({
      success: true,
      message: 'Request updated successfully',
      data: updatedRequest
    })

  } catch (error: any) {
    console.error('Error in manual update:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

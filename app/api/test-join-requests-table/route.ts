import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if table exists by trying to select from it
    const { data: requests, error: requestsError } = await supabase
      .from('group_join_requests')
      .select('*')
      .limit(5)

    if (requestsError) {
      return NextResponse.json({ 
        error: 'Table check failed', 
        details: requestsError.message,
        code: requestsError.code
      }, { status: 500 })
    }

    // Get the specific request that's causing issues
    const { data: specificRequest, error: specificError } = await supabase
      .from('group_join_requests')
      .select('*')
      .eq('id', 'dc0b7078-3153-4f4f-a768-74de12c01afc')
      .single()

    return NextResponse.json({
      success: true,
      tableExists: true,
      allRequests: requests,
      specificRequest: specificRequest,
      specificRequestError: specificError?.message
    })

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

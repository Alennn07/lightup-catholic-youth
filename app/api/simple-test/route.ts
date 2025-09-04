import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Try to get the table structure
    const { data, error } = await supabase
      .from('prayer_requests')
      .select('*')
      .limit(0)

    if (error) {
      return NextResponse.json({ 
        error: 'Table access error',
        message: error.message,
        code: error.code,
        hint: error.hint,
        details: error.details
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Table is accessible',
      data: data
    })

  } catch (error: any) {
    console.error('Simple test error:', error)
    return NextResponse.json({ 
      error: 'Simple test failed',
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

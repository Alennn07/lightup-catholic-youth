import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Check if storage buckets exist
    const { data: buckets, error } = await supabase.storage.listBuckets()
    
    if (error) {
      return NextResponse.json({ 
        error: 'Failed to list buckets',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      buckets: buckets?.map(b => ({ name: b.name, public: b.public })),
      message: 'Storage buckets check complete'
    })

  } catch (error: any) {
    console.error('Storage test error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

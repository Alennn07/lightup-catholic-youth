import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { 
        auth: { autoRefreshToken: false, persistSession: false },
        db: { schema: 'public' }
      }
    )

    // Test if tables exist by trying to select from them
    const { data: eventsTest, error: eventsError } = await supabase
      .from('group_events')
      .select('id')
      .limit(1)

    const { data: postsTest, error: postsError } = await supabase
      .from('group_posts')
      .select('id')
      .limit(1)

    return NextResponse.json({
      success: true,
      message: 'Tables check completed',
      eventsTableExists: !eventsError,
      postsTableExists: !postsError,
      eventsError: eventsError?.message,
      postsError: postsError?.message
    })

  } catch (error: any) {
    console.error('Error checking tables:', error)
    return NextResponse.json({ 
      error: 'Failed to check tables',
      details: error.message 
    }, { status: 500 })
  }
}

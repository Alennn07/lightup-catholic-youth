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

    // Test prayer_requests table structure
    const { data: prayerRequests, error: prayerError } = await supabase
      .from('prayer_requests')
      .select('*')
      .limit(1)

    if (prayerError) {
      return NextResponse.json({ 
        error: 'Prayer requests table error',
        details: prayerError.message,
        code: prayerError.code
      }, { status: 500 })
    }

    // Test journal_entries table structure
    const { data: journalEntries, error: journalError } = await supabase
      .from('journal_entries')
      .select('*')
      .limit(1)

    if (journalError) {
      return NextResponse.json({ 
        error: 'Journal entries table error',
        details: journalError.message,
        code: journalError.code
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      prayerRequests: prayerRequests?.length || 0,
      journalEntries: journalEntries?.length || 0,
      message: 'Database tables are accessible'
    })

  } catch (error: any) {
    console.error('Database test error:', error)
    return NextResponse.json({ 
      error: 'Database test failed',
      details: error.message 
    }, { status: 500 })
  }
}

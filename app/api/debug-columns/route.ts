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

    // Check prayer_requests table columns
    const { data: prayerColumns, error: prayerError } = await supabase
      .rpc('get_table_columns', { table_name: 'prayer_requests' })
      .catch(async () => {
        // Fallback: try to describe the table structure
        const { data, error } = await supabase
          .from('prayer_requests')
          .select('*')
          .limit(0)
        return { data: null, error }
      })

    // Check journal_entries table columns
    const { data: journalColumns, error: journalError } = await supabase
      .rpc('get_table_columns', { table_name: 'journal_entries' })
      .catch(async () => {
        // Fallback: try to describe the table structure
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .limit(0)
        return { data: null, error }
      })

    // Try a simple insert to see what happens
    let insertTest = null
    try {
      const { data, error } = await supabase
        .from('prayer_requests')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000',
          title: 'Test',
          content: 'Test',
          category: 'Other',
          is_anonymous: false,
          prayer_count: 0
        })
        .select()
      
      insertTest = { success: true, data, error }
    } catch (insertErr: any) {
      insertTest = { success: false, error: insertErr.message }
    }

    return NextResponse.json({
      prayerRequests: {
        error: prayerError?.message,
        code: prayerError?.code,
        hint: prayerError?.hint
      },
      journalEntries: {
        error: journalError?.message,
        code: journalError?.code,
        hint: journalError?.hint
      },
      insertTest
    })

  } catch (error: any) {
    console.error('Debug columns error:', error)
    return NextResponse.json({ 
      error: 'Debug failed',
      details: error.message 
    }, { status: 500 })
  }
}

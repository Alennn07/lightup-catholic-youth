import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force this route to be dynamic
export const dynamic = 'force-dynamic'

// Create Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing search functionality...')

    // Test 1: Check if prayer_requests table exists and has data
    const { data: prayers, error: prayersError } = await supabase
      .from('prayer_requests')
      .select('id, name, request, is_anonymous, created_at')
      .limit(10)

    console.log('Prayer requests:', { count: prayers?.length, error: prayersError, data: prayers })

    // Test 2: Check if journal_entries table exists and has data
    const { data: journal, error: journalError } = await supabase
      .from('journal_entries')
      .select('id, title, content, created_at')
      .limit(10)

    console.log('Journal entries:', { count: journal?.length, error: journalError, data: journal })

    // Test 3: Check if youth_groups table exists and has data
    const { data: groups, error: groupsError } = await supabase
      .from('youth_groups')
      .select('id, name, description, created_at')
      .limit(10)

    console.log('Youth groups:', { count: groups?.length, error: groupsError, data: groups })

    // Test 4: Check if events table exists and has data
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title, description, created_at')
      .limit(10)

    console.log('Events:', { count: events?.length, error: eventsError, data: events })

    // Test 5: Try a simple search
    const { data: searchTest, error: searchError } = await supabase
      .from('prayer_requests')
      .select('id, name, request')
      .ilike('request', '%pray%')
      .limit(5)

    console.log('Search test (ILIKE):', { count: searchTest?.length, error: searchError, data: searchTest })

    return NextResponse.json({
      success: true,
      results: {
        prayers: {
          count: prayers?.length || 0,
          error: prayersError?.message,
          sample: prayers?.slice(0, 2)
        },
        journal: {
          count: journal?.length || 0,
          error: journalError?.message,
          sample: journal?.slice(0, 2)
        },
        groups: {
          count: groups?.length || 0,
          error: groupsError?.message,
          sample: groups?.slice(0, 2)
        },
        events: {
          count: events?.length || 0,
          error: eventsError?.message,
          sample: events?.slice(0, 2)
        },
        searchTest: {
          count: searchTest?.length || 0,
          error: searchError?.message,
          sample: searchTest?.slice(0, 2)
        }
      }
    })

  } catch (error: any) {
    console.error('❌ Test search error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error occurred'
    }, { status: 500 })
  }
}

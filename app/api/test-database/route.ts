import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing database connection...')
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Test 1: Basic connection
    console.log('🔍 Test 1: Basic connection')
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Service Key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

    // Test 2: Table access
    console.log('🔍 Test 2: Table access')
    const { data: tableTest, error: tableError } = await supabase
      .from('user_verse_progress')
      .select('count')
      .limit(1)
    
    console.log('Table test result:', { data: tableTest, error: tableError })

    // Test 3: Count completed verses
    console.log('🔍 Test 3: Count completed verses')
    const { count: completedCount, error: countError } = await supabase
      .from('user_verse_progress')
      .select('*', { count: 'exact', head: true })
      .eq('is_completed', true)
    
    console.log('Count test result:', { count: completedCount, error: countError })

    // Test 4: Check table structure
    console.log('🔍 Test 4: Table structure')
    const { data: structure, error: structureError } = await supabase
      .from('user_verse_progress')
      .select('*')
      .limit(1)
    
    console.log('Structure test result:', { data: structure, error: structureError })

    return NextResponse.json({
      success: true,
      tests: {
        connection: { url: !!process.env.NEXT_PUBLIC_SUPABASE_URL, key: !!process.env.SUPABASE_SERVICE_ROLE_KEY },
        table_access: { success: !tableError, error: tableError?.message },
        count_test: { success: !countError, count: completedCount, error: countError?.message },
        structure: { success: !structureError, columns: structure ? Object.keys(structure[0] || {}) : [], error: structureError?.message }
      }
    })

  } catch (error: any) {
    console.error('❌ Test failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

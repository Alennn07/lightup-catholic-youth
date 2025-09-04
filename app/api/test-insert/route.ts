import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Test insert into prayer_requests
    const { data: insertData, error: insertError } = await supabase
      .from('prayer_requests')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // dummy UUID
        name: 'Test Prayer',
        request: 'Test content',
        category: 'Other',
        is_anonymous: false,
        prayer_count: 0,
        image_url: null
      })
      .select()

    if (insertError) {
      return NextResponse.json({ 
        error: 'Insert failed',
        details: insertError.message,
        code: insertError.code,
        hint: insertError.hint
      }, { status: 500 })
    }

    // Clean up test record
    await supabase
      .from('prayer_requests')
      .delete()
      .eq('id', insertData[0].id)

    return NextResponse.json({
      success: true,
      message: 'Insert test successful',
      insertedData: insertData[0]
    })

  } catch (error: any) {
    console.error('Insert test error:', error)
    return NextResponse.json({ 
      error: 'Insert test failed',
      details: error.message 
    }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing simple API...')
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Test basic connection
    const { data, error } = await supabase
      .from('youth_groups')
      .select('id, name')
      .limit(1)

    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('✅ Supabase connection works:', data)
    return NextResponse.json({ success: true, data })

  } catch (error: any) {
    console.error('❌ Test error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

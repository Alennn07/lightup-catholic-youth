import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            // Don't set cookies in this test endpoint
          },
          remove(name: string, options: any) {
            // Don't remove cookies in this test endpoint
          },
        },
      }
    )
    
    // Try to get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    // Try to get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    return NextResponse.json({
      session: {
        exists: !!session,
        userId: session?.user?.id,
        error: sessionError?.message
      },
      user: {
        exists: !!user,
        userId: user?.id,
        error: userError?.message
      },
      cookies: request.cookies.getAll().map(c => ({ name: c.name, value: c.value.substring(0, 50) + '...' }))
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('🚀 Prayer Pray API called for ID:', params.id)
    
    // Check environment variables first
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    
    console.log('✅ Environment variables are set')
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    console.log('🔑 Auth header:', authHeader ? 'Present' : 'Missing')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ No authorization header found')
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('✅ Token received:', token ? 'Yes' : 'No')

    // Create Supabase client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get current user using token
    console.log('🔍 Authenticating user with token...')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    console.log('👤 Auth check - User ID:', user?.id, 'Error:', authError)
    
    if (authError) {
      console.error('❌ Authentication error:', authError)
      return NextResponse.json({ error: `Authentication error: ${authError.message}` }, { status: 401 })
    }
    
    if (!user) {
      console.error('❌ No user found in session')
      return NextResponse.json({ error: 'No user found in session' }, { status: 401 })
    }

    // Remove the number parsing since ID is a UUID string
    const id = params.id
    console.log('📝 Updating prayer count for request ID:', id)

    // First get the current prayer count
    const { data: currentRequest, error: fetchError } = await supabase
      .from("prayer_requests")
      .select("prayer_count")
      .eq("id", id)
      .single()

    if (fetchError) {
      console.error("Error fetching current prayer count:", fetchError)
      throw fetchError
    }

    const newPrayerCount = (currentRequest.prayer_count || 0) + 1

    // Update prayer count
    const { data, error } = await supabase
      .from("prayer_requests")
      .update({
        prayer_count: newPrayerCount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("prayer_count")
      .single()

    if (error) {
      console.error("Error updating prayer count:", error)
      throw error
    }

    console.log('✅ Prayer count updated successfully:', data.prayer_count)

    return NextResponse.json({
      success: true,
      prayerCount: data.prayer_count,
    })
  } catch (error: any) {
    console.error("Error updating prayer count:", error)
    return NextResponse.json({ error: "Failed to update prayer count" }, { status: 500 })
  }
}

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { PrayerRequestSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Prayer Requests GET API called')
    
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

    // Fetch prayer requests with user information
    const { data: requests, error } = await supabase
      .from("prayer_requests")
      .select(`
        *,
        user:users(name, avatar_url)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching prayer requests:", error)
      throw error
    }

    console.log('✅ Prayer requests fetched successfully:', requests?.length || 0)
    return NextResponse.json(requests)
  } catch (error: any) {
    console.error("Error fetching prayer requests:", error)
    return NextResponse.json({ error: "Failed to fetch prayer requests" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Prayer Requests POST API called')
    
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

    // Validate request body
    const body = await request.json()
    console.log('📦 Request body received:', JSON.stringify(body, null, 2))
    
    const validatedData = PrayerRequestSchema.parse(body)

    const { data: newRequest, error } = await supabase
      .from("prayer_requests")
      .insert({
        user_id: user.id,
        title: validatedData.title,
        content: validatedData.content,
        category: validatedData.category,
        is_anonymous: validatedData.is_anonymous,
        prayer_count: 0
      })
      .select(`
        *,
        user:users(name, avatar_url)
      `)
      .single()

    if (error) {
      console.error("Error creating prayer request:", error)
      throw error
    }

    console.log('✅ Prayer request created successfully')
    return NextResponse.json(newRequest, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 })
    }
    
    console.error("Error creating prayer request:", error)
    return NextResponse.json({ error: "Failed to create prayer request" }, { status: 500 })
  }
}

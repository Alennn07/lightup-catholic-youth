import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { PrayerRequestSchema } from '@/lib/validations'
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limiter'

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

    // Check if user is authenticated
    const authHeader = request.headers.get('authorization')
    let currentUserId = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      
      if (!authError && user) {
        currentUserId = user.id
        console.log('👤 Authenticated user:', currentUserId)
      }
    }

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

    // If user is authenticated, check which prayers they've already prayed for
    if (currentUserId && requests) {
      try {
        const requestIds = requests.map(req => req.id)
        
        const { data: userPrayers, error: prayerError } = await supabase
          .from("prayer_participants")
          .select("prayer_request_id")
          .eq("user_id", currentUserId)
          .in("prayer_request_id", requestIds)

        if (!prayerError && userPrayers) {
          const prayedRequestIds = new Set(userPrayers.map(p => p.prayer_request_id))
          
          // Add has_user_prayed flag to each request
          requests.forEach(request => {
            request.has_user_prayed = prayedRequestIds.has(request.id)
          })
        } else if (prayerError && prayerError.code === '42P01') {
          // Table doesn't exist, set all to false
          console.log('⚠️ prayer_participants table does not exist, setting has_user_prayed to false')
          requests.forEach(request => {
            request.has_user_prayed = false
          })
        }
      } catch (error) {
        console.log('⚠️ Could not check prayer participations, setting has_user_prayed to false')
        requests.forEach(request => {
          request.has_user_prayed = false
        })
      }
    } else if (requests) {
      // No user authenticated, set all to false
      requests.forEach(request => {
        request.has_user_prayed = false
      })
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
    
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const rateLimit = await checkRateLimit(ip, 'PRAYER_POST', ip)
    
    if (!rateLimit.allowed) {
      console.log('❌ Rate limit exceeded for prayer post')
      return NextResponse.json(
        { error: 'Too many prayer requests. Please wait before posting again.' },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime)
        }
      )
    }
    
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

    const insertData: any = {
      user_id: user.id,
      name: validatedData.title,
      request: validatedData.content,
      category: validatedData.category,
      is_anonymous: validatedData.is_anonymous,
      prayer_count: 0
    }
    
    // Only add image_url if it exists
    if (validatedData.image_url) {
      insertData.image_url = validatedData.image_url
    }

    const { data: newRequest, error } = await supabase
      .from("prayer_requests")
      .insert(insertData)
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

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { logIfEnabled, logPerformanceIfEnabled } from '@/lib/performance-monitor'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    logIfEnabled('🚀 Profile GET API called')
    
    // Check environment variables first
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      logIfEnabled('❌ Missing environment variables', 'error')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')

    // Create Supabase client with optimized settings
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        db: { schema: 'public' }
      }
    )

    // Get current user using token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      logIfEnabled(`❌ Authentication failed: ${authError?.message || 'No user'}`, 'error')
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }

    // 🚀 OPTIMIZED: Fetch only essential profile fields
    const { data: profile, error } = await supabase
      .from("users")
      .select("id, name, username, email, age, parish, diocese, created_at, updated_at")
      .eq("id", user.id)
      .single()

    if (error) {
      logIfEnabled(`❌ Profile fetch error: ${error.message}`, 'error')
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    const endTime = Date.now()
    const totalDuration = endTime - startTime
    logPerformanceIfEnabled('Profile API - GET', totalDuration)
    
    logIfEnabled('✅ Profile fetched successfully')
    return NextResponse.json({ profile })
  } catch (error: any) {
    const endTime = Date.now()
    const totalDuration = endTime - startTime
    
    logIfEnabled(`❌ Profile API error after ${totalDuration}ms: ${error.message || 'Unknown error'}`, 'error')
    logPerformanceIfEnabled('Profile API - Error', totalDuration)
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    logIfEnabled('🚀 Profile PUT API called')
    
    // Check environment variables first
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      logIfEnabled('❌ Missing environment variables', 'error')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')

    // Create Supabase client with optimized settings
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        db: { schema: 'public' }
      }
    )

    // Get current user using token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      logIfEnabled(`❌ Authentication failed: ${authError?.message || 'No user'}`, 'error')
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }

    const body = await request.json()
    logIfEnabled(`📦 Updating profile for user: ${user.id}`)
    
    // 🚀 OPTIMIZED: Only update provided fields and add timestamp
    const updateData = {
      ...body,
      updated_at: new Date().toISOString(),
    }

    const { data: profile, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", user.id)
      .select("id, name, username, email, age, parish, diocese, created_at, updated_at")
      .single()

    if (error) {
      logIfEnabled(`❌ Profile update error: ${error.message}`, 'error')
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    const endTime = Date.now()
    const totalDuration = endTime - startTime
    logPerformanceIfEnabled('Profile API - PUT', totalDuration)
    
    logIfEnabled('✅ Profile updated successfully')
    return NextResponse.json({ profile })
  } catch (error: any) {
    const endTime = Date.now()
    const totalDuration = endTime - startTime
    
    logIfEnabled(`❌ Profile update API error after ${totalDuration}ms: ${error.message || 'Unknown error'}`, 'error')
    logPerformanceIfEnabled('Profile API - PUT Error', totalDuration)
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

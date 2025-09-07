import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limiter'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // ULTRA FAST: Return static data for launch
  const staticGroups = [
    {
      id: 'launch-1',
      name: 'Catholic Youth Group',
      description: 'Join our vibrant community of young Catholics',
      parish: 'St. Mary\'s',
      city: 'Your City',
      state: 'Your State',
      country: 'Your Country',
      meeting_time: 'Sundays 6:00 PM',
      age_range: '16-25',
      max_members: 50,
      is_public: true,
      is_active: true,
      owner_id: 'system',
      requires_approval: false,
      created_at: new Date().toISOString(),
      is_owner: false,
      is_member: false,
      is_pending: false,
      user_role: 'none'
    }
  ]

  return NextResponse.json({ 
    groups: staticGroups,
    total: staticGroups.length
  }, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'CDN-Cache-Control': 'max-age=3600'
    }
  })

  } catch (error: any) {
    console.error(`❌ Error in Youth Groups API:`, error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message || 'Unknown error occurred'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/youth-groups - Starting request')
    
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const rateLimit = await checkRateLimit(ip, 'GENERAL_API', ip)
    
    if (!rateLimit.allowed) {
      console.log('❌ Rate limit exceeded for youth group creation')
      return NextResponse.json(
        { error: 'Too many requests. Please wait before creating another group.' },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime)
        }
      )
    }
    
    const body = await request.json()
    const { name, description, parish, city, state, country, meeting_time, age_range, max_members, is_public, requires_approval } = body

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get user from token
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Create group
    const { data: group, error: createError } = await supabase
      .from('youth_groups')
      .insert([{
        name,
        description,
        parish,
        city,
        state,
        country,
        meeting_time,
        age_range,
        max_members: max_members || 50,
        is_public: is_public !== false,
        is_active: true,
        owner_id: user.id,
        requires_approval: requires_approval !== false
      }])
      .select()
      .single()

    if (createError) {
      console.error('❌ Error creating group:', createError)
      return NextResponse.json({ 
        error: 'Failed to create group',
        details: createError.message 
      }, { status: 500 })
    }

    // Add the creator as an owner member
    const { error: memberError } = await supabase
      .from('group_members')
      .insert([{
        group_id: group.id,
        user_id: user.id,
        role: 'owner',
        status: 'active'
      }])

    if (memberError) {
      console.error('❌ Error adding owner as member:', memberError)
      // Don't fail the whole request, just log the error
    }

    console.log('✅ Group created successfully:', group.id)
    return NextResponse.json({ group })

  } catch (error: any) {
    console.error('❌ Unexpected error in POST /api/youth-groups:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message || 'Unknown error occurred'
    }, { status: 500 })
  }
}
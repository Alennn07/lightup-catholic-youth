import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logIfEnabled, logPerformanceIfEnabled } from '@/lib/performance-monitor'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now()
  
  try {
    logIfEnabled(`🚀 GET /api/youth-groups/[id]/posts - Starting request for group: ${params.id}`)
    
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create Supabase client with optimized settings
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { 
        auth: { autoRefreshToken: false, persistSession: false },
        db: { schema: 'public' }
      }
    )

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // 🚀 OPTIMIZED: Check membership and fetch posts in parallel
    const [membershipResult, postsResult] = await Promise.all([
      supabase
        .from('group_members')
        .select('role, status')
        .eq('group_id', params.id)
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('group_posts')
        .select('id, title, content, post_type, is_public, is_pinned, user_id, created_at, updated_at')
        .eq('group_id', params.id)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(25) // Limit to prevent excessive data
    ])

    const membership = membershipResult.data
    if (!membership || membership.status !== 'active') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (postsResult.error) {
      logIfEnabled(`❌ Error fetching posts: ${postsResult.error.message}`, 'error')
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    const endTime = Date.now()
    const totalDuration = endTime - startTime
    logPerformanceIfEnabled('Youth Groups Posts API - GET', totalDuration)
    
    logIfEnabled(`✅ Successfully fetched ${postsResult.data?.length || 0} posts in ${totalDuration}ms`)
    
    // Add cache headers for better performance
    const response = NextResponse.json({ posts: postsResult.data || [] })
    response.headers.set('Cache-Control', 'private, max-age=60') // Cache for 1 minute
    
    return response

  } catch (error: any) {
    const endTime = Date.now()
    const totalDuration = endTime - startTime
    
    logIfEnabled(`❌ Error in Youth Groups Posts API after ${totalDuration}ms: ${error.message || 'Unknown error'}`, 'error')
    logPerformanceIfEnabled('Youth Groups Posts API - Error', totalDuration)
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🚀 POST /api/youth-groups/[id]/posts - Starting request for group:', params.id)
    
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      console.log('❌ No authorization token provided')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    let user: any
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !authUser) {
        console.log('❌ Auth error:', authError)
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }
      user = authUser
      console.log('✅ User authenticated:', user.id)
    } catch (authError: any) {
      console.error('❌ Error verifying user:', authError)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }

    // Check if user is a member of this group
    const { data: membership } = await supabase
      .from('group_members')
      .select('role, status')
      .eq('group_id', params.id)
      .eq('user_id', user.id)
      .single()

    if (!membership || membership.status !== 'active') {
      console.log('❌ User is not a member of this group')
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const body = await request.json()
    console.log('📝 Request body:', body)

    // Validate required fields
    if (!body.content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Create the post
    const { data: post, error: createError } = await supabase
      .from('group_posts')
      .insert([{
        group_id: params.id,
        title: body.title || null,
        content: body.content,
        post_type: body.post_type || 'general',
        is_public: body.is_public || false,
        user_id: user.id
      }])
      .select()
      .single()

    if (createError) {
      console.error('❌ Error creating post:', createError)
      return NextResponse.json({ 
        error: 'Failed to create post',
        details: createError.message 
      }, { status: 500 })
    }

    console.log('✅ Post created successfully:', post.id)
    return NextResponse.json({ 
      post,
      message: 'Post created successfully' 
    }, { status: 201 })

  } catch (error: any) {
    console.error('❌ Unexpected error in POST /api/youth-groups/[id]/posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

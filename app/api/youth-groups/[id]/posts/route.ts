import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🚀 GET /api/youth-groups/[id]/posts - Starting request for group:', params.id)
    
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

    // Get group posts
    const { data: posts, error: postsError } = await supabase
      .from('group_posts')
      .select('*')
      .eq('group_id', params.id)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })

    if (postsError) {
      console.error('❌ Error fetching posts:', postsError)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    console.log('✅ Successfully fetched posts')
    return NextResponse.json({ posts: posts || [] })

  } catch (error: any) {
    console.error('❌ Unexpected error in GET /api/youth-groups/[id]/posts:', error)
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

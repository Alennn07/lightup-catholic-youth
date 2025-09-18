import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logIfEnabled } from '@/lib/performance-monitor'
import { enrichPostsWithProfiles } from '@/lib/user-helpers'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: groupId } = params
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Check if user is group owner or member
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select('role, status')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single()

    // Also check if user is group owner
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('owner_id')
      .eq('id', groupId)
      .single()

    const isOwner = group && group.owner_id === user.id
    const isMember = membership && membership.status === 'active'

    if (!isOwner && !isMember) {
      console.log('❌ Access denied - User is neither owner nor member:', {
        userId: user.id,
        groupId,
        isOwner,
        isMember,
        membershipError: membershipError?.message,
        groupError: groupError?.message
      })
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get all group posts
    const { data: posts, error: postsError } = await supabase
      .from('group_posts')
      .select(`
        id,
        title,
        content,
        post_type,
        is_public,
        created_at,
        user_id
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })

    if (postsError) {
      logIfEnabled(`❌ Error fetching posts: ${postsError.message}`, 'error')
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    // Enrich posts with user profile information
    const enrichedPosts = await enrichPostsWithProfiles(posts || [])

    logIfEnabled(`✅ Posts fetched for group ${groupId}: ${enrichedPosts?.length || 0} posts`)
    
    return NextResponse.json({
      success: true,
      data: enrichedPosts
    })

  } catch (error: any) {
    logIfEnabled(`❌ Error in posts API: ${error.message}`, 'error')
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: groupId } = params
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Check if user is group owner or member
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select('role, status')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single()

    // Also check if user is group owner
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('owner_id')
      .eq('id', groupId)
      .single()

    const isOwner = group && group.owner_id === user.id
    const isMember = membership && membership.status === 'active'

    if (!isOwner && !isMember) {
      console.log('❌ Access denied - User is neither owner nor member:', {
        userId: user.id,
        groupId,
        isOwner,
        isMember,
        membershipError: membershipError?.message,
        groupError: groupError?.message
      })
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { title, content, post_type } = await request.json()
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Create post
    const { data: post, error: createError } = await supabase
      .from('group_posts')
      .insert({
        group_id: groupId,
        title,
        content,
        post_type: post_type || 'general',
        is_public: false,
        user_id: user.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (createError) {
      logIfEnabled(`❌ Error creating post: ${createError.message}`, 'error')
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
    }

    logIfEnabled(`✅ Post created for group ${groupId}: ${title}`)
    
    return NextResponse.json({
      success: true,
      message: 'Post created successfully',
      post
    })

  } catch (error: any) {
    logIfEnabled(`❌ Error in create post API: ${error.message}`, 'error')
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}
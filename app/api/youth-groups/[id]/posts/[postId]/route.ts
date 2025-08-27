import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; postId: string } }
) {
  try {
    console.log('🚀 PUT /api/youth-groups/[id]/posts/[postId] - Starting request for post:', params.postId)
    
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

    const body = await request.json()
    console.log('📝 Request body:', body)

    // Check if user can edit this post
    const { data: post, error: postError } = await supabase
      .from('group_posts')
      .select('user_id, group_id')
      .eq('id', params.postId)
      .single()

    if (postError || !post) {
      console.error('❌ Post not found:', postError)
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Check if user is the creator or group owner
    const { data: membership } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', post.group_id)
      .eq('user_id', user.id)
      .single()

    if (post.user_id !== user.id && membership?.role !== 'owner') {
      console.log('❌ User cannot edit this post')
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Update the post
    const { data: updatedPost, error: updateError } = await supabase
      .from('group_posts')
      .update({
        title: body.title || null,
        content: body.content,
        post_type: body.post_type || 'general',
        is_public: body.is_public || false
      })
      .eq('id', params.postId)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Error updating post:', updateError)
      return NextResponse.json({ 
        error: 'Failed to update post',
        details: updateError.message 
      }, { status: 500 })
    }

    console.log('✅ Post updated successfully')
    return NextResponse.json({ 
      post: updatedPost,
      message: 'Post updated successfully' 
    })

  } catch (error: any) {
    console.error('❌ Unexpected error in PUT /api/youth-groups/[id]/posts/[postId]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; postId: string } }
) {
  try {
    console.log('🚀 DELETE /api/youth-groups/[id]/posts/[postId] - Starting request for post:', params.postId)
    
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

    // Check if user can delete this post
    const { data: post, error: postError } = await supabase
      .from('group_posts')
      .select('user_id, group_id')
      .eq('id', params.postId)
      .single()

    if (postError || !post) {
      console.error('❌ Post not found:', postError)
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Check if user is the creator or group owner
    const { data: membership } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', post.group_id)
      .eq('user_id', user.id)
      .single()

    if (post.user_id !== user.id && membership?.role !== 'owner') {
      console.log('❌ User cannot delete this post')
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Delete the post
    const { error: deleteError } = await supabase
      .from('group_posts')
      .delete()
      .eq('id', params.postId)

    if (deleteError) {
      console.error('❌ Error deleting post:', deleteError)
      return NextResponse.json({ 
        error: 'Failed to delete post',
        details: deleteError.message 
      }, { status: 500 })
    }

    console.log('✅ Post deleted successfully')
    return NextResponse.json({ message: 'Post deleted successfully' })

  } catch (error: any) {
    console.error('❌ Unexpected error in DELETE /api/youth-groups/[id]/posts/[postId]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

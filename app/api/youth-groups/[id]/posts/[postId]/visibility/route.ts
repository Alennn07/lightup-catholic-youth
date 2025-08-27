import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; postId: string } }
) {
  try {
    console.log('🚀 PUT /api/youth-groups/[id]/posts/[postId]/visibility - Starting request for post:', params.postId)
    
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

    // Check if user can toggle this post's visibility
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
      console.log('❌ User cannot toggle this post visibility')
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Toggle the post visibility
    const { data: updatedPost, error: updateError } = await supabase
      .from('group_posts')
      .update({
        is_public: body.is_public
      })
      .eq('id', params.postId)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Error updating post visibility:', updateError)
      return NextResponse.json({ 
        error: 'Failed to update post visibility',
        details: updateError.message 
      }, { status: 500 })
    }

    console.log('✅ Post visibility updated successfully')
    return NextResponse.json({ 
      post: updatedPost,
      message: 'Post visibility updated successfully' 
    })

  } catch (error: any) {
    console.error('❌ Unexpected error in PUT /api/youth-groups/[id]/posts/[postId]/visibility:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🚀 POST /api/youth-groups/[id]/join-request - Starting request')
    
    const groupId = params.id
    const body = await request.json()
    const { message } = body

    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }

    console.log('👤 User authenticated:', user.id)

    // Create user in users table first to satisfy foreign key constraint
    console.log('👤 Ensuring user exists in users table:', user.id)
    console.log('👤 User email:', user.email)
    console.log('👤 User metadata:', user.user_metadata)
    
    const userData = {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      username: user.user_metadata?.username || `user_${user.id.slice(0, 8)}`,
      age: user.user_metadata?.age || 18,
      parish: user.user_metadata?.parish || '',
      diocese: user.user_metadata?.diocese || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('📝 User data to upsert:', userData)
    
    // Try to insert the user, ignore if already exists
    const { data: insertResult, error: insertUserError } = await supabase
      .from('users')
      .insert(userData)
      .select()

    if (insertUserError) {
      if (insertUserError.code === '23505') {
        // User already exists, that's fine
        console.log('✅ User already exists in users table')
      } else {
        console.error('❌ Error inserting user:', insertUserError)
        console.error('❌ Insert result:', insertResult)
        // Continue anyway - maybe the constraint will work
      }
    } else {
      console.log('✅ User created in users table:', insertResult)
    }

    // Check if user exists in public.users table
    const { data: verifyUser, error: verifyError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (verifyError || !verifyUser) {
      console.log('❌ User not in public.users table, trying to create...')
      
      // Try to create user with minimal data and unique username
      const { error: createError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || 'User',
          username: `${user.user_metadata?.username || 'user'}_${user.id.slice(0, 8)}`
        })

      if (createError) {
        console.error('❌ Failed to create user in public.users:', createError)
        return NextResponse.json({ 
          error: 'Failed to create user profile',
          details: createError.message 
        }, { status: 500 })
      }
      
      console.log('✅ User created in public.users table')
    } else {
      console.log('✅ User verified in public.users table:', verifyUser.id)
    }

    // Check if group exists
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('id, name, requires_approval, owner_id')
      .eq('id', groupId)
      .single()

    if (groupError || !group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    console.log('✅ Group found:', group.name)

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('group_members')
      .select('id, status')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single()

    if (existingMember) {
      return NextResponse.json({ 
        error: 'You are already a member of this group',
        status: existingMember.status
      }, { status: 400 })
    }

    // Check if user already has a pending request
    const { data: existingRequest } = await supabase
      .from('group_join_requests')
      .select('id, status')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single()

    if (existingRequest) {
      return NextResponse.json({ 
        error: 'You already have a pending request for this group'
      }, { status: 400 })
    }

    // Create join request - try with minimal data first
    const joinRequestData = {
      group_id: groupId,
      user_id: user.id,
      message: message || '',
      status: 'pending'
    }

    console.log('📝 Creating join request with data:', joinRequestData)

    const { data: joinRequest, error: joinError } = await supabase
      .from('group_join_requests')
      .insert([joinRequestData])
      .select()
      .single()

    if (joinError) {
      console.error('❌ Error creating join request:', joinError)
      return NextResponse.json({ 
        error: 'Failed to create join request',
        details: joinError.message 
      }, { status: 500 })
    }

    console.log('✅ Join request created successfully:', joinRequest.id)

    return NextResponse.json({ 
      success: true,
      message: group.requires_approval 
        ? 'Join request submitted successfully. The group leader will review your request.'
        : 'You have joined the group successfully!',
      joinRequest
    })

  } catch (error: any) {
    console.error('❌ Error in join request API:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message || 'Unknown error occurred'
    }, { status: 500 })
  }
}
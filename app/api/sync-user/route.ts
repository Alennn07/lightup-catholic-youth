import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Try to find user in auth.users using admin API
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('Error fetching auth users:', authError)
      return NextResponse.json({ error: 'Failed to access auth system' }, { status: 500 })
    }

    const authUser = users.find(u => u.email === email)
    
    if (!authUser) {
      return NextResponse.json({ error: 'User not found in auth system' }, { status: 404 })
    }

    // Check if user already exists in custom users table
    const { data: existingUser, error: existingError } = await supabase
      .from('users')
      .select('id')
      .eq('id', authUser.id)
      .single()

    if (existingUser) {
      return NextResponse.json({ 
        success: true, 
        message: 'User already exists in custom table',
        user: existingUser
      })
    }

    // Create user in custom users table
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.email.split('@')[0],
        username: authUser.user_metadata?.username || authUser.email.split('@')[0],
        created_at: authUser.created_at,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating user:', createError)
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'User synced successfully',
      user: newUser
    })

  } catch (error: any) {
    console.error('Error in sync user API:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

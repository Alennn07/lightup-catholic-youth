import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { GroupCategory } from '@/types/youth-groups'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active_only') !== 'false'
    
    // Build query
    let query = supabase
      .from('group_categories')
      .select('*')
      .order('sort_order', { ascending: true })
    
    if (activeOnly) {
      query = query.eq('is_active', true)
    }
    
    const { data: categories, error } = await query
    
    if (error) {
      console.error('Error fetching group categories:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch categories',
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: categories || []
    })
    
  } catch (error) {
    console.error('Unexpected error in group categories API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Check if user is verified (admin)
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('is_verified')
      .eq('id', user.id)
      .single()
    
    if (profileError || !userProfile?.is_verified) {
      return NextResponse.json(
        { success: false, error: 'Admin privileges required' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const { name, description, color, icon, sort_order } = body
    
    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      )
    }
    
    // Create category
    const { data: category, error } = await supabase
      .from('group_categories')
      .insert({
        name,
        description,
        color: color || '#3B82F6',
        icon,
        sort_order: sort_order || 0
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating group category:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to create category',
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: category
    })
    
  } catch (error) {
    console.error('Unexpected error in create category API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

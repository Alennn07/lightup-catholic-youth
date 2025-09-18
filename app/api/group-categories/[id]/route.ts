import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { id } = params
    
    const { data: category, error } = await supabase
      .from('group_categories')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 404 }
        )
      }
      
      console.error('Error fetching group category:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch category',
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
    console.error('Unexpected error in get category API:', error)
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { id } = params
    
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
    const { name, description, color, icon, sort_order, is_active } = body
    
    // Update category
    const { data: category, error } = await supabase
      .from('group_categories')
      .update({
        name,
        description,
        color,
        icon,
        sort_order,
        is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating group category:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to update category',
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
    console.error('Unexpected error in update category API:', error)
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { id } = params
    
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
    
    // Check if category is being used by any groups
    const { data: groupsUsingCategory, error: checkError } = await supabase
      .from('youth_groups')
      .select('id')
      .eq('category_id', id)
      .limit(1)
    
    if (checkError) {
      console.error('Error checking category usage:', checkError)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to check category usage',
          details: checkError.message 
        },
        { status: 500 }
      )
    }
    
    if (groupsUsingCategory && groupsUsingCategory.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete category that is being used by groups' 
        },
        { status: 400 }
      )
    }
    
    // Delete category
    const { error } = await supabase
      .from('group_categories')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting group category:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to delete category',
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    })
    
  } catch (error) {
    console.error('Unexpected error in delete category API:', error)
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

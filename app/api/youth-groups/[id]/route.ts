import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logIfEnabled } from '@/lib/performance-monitor'
import { createSuccessResponse, createErrorResponse, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/api-response'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: groupId } = params
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    logIfEnabled(`🔍 GET /api/youth-groups/${groupId} - Token: ${token ? 'Present' : 'None'}`)
    
    // Create supabase client (no auth required for public group viewing)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { 
        auth: { autoRefreshToken: false, persistSession: false },
        db: { schema: 'public' }
      }
    )

    // Try to get user if token exists, but don't require it
    let user = null
    if (token) {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)
      if (!authError && authUser) {
        user = authUser
      }
    }

    // Get group details
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select(`
        id,
        name,
        description,
        mission_statement,
        parish,
        diocese,
        city,
        state,
        country,
        meeting_location,
        meeting_time,
        meeting_frequency,
        age_range,
        max_members,
        is_public,
        is_active,
        owner_id,
        created_at,
        updated_at
      `)
      .eq('id', groupId)
      .single()

    logIfEnabled(`🔍 Group query result - Error: ${groupError?.message || 'None'}, Group: ${group ? 'Found' : 'Not found'}`)

    if (groupError || !group) {
      logIfEnabled(`❌ Group not found: ${groupError?.message}`)
      return NextResponse.json(createErrorResponse(ERROR_MESSAGES.GROUP_NOT_FOUND), { status: 404 })
    }

    // Check if user is a member of the group (only if user is authenticated)
    let membership = null
    let isOwner = false
    let isMember = false
    
    if (user) {
      const { data: membershipData, error: membershipError } = await supabase
        .from('group_members')
        .select('role, status')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .single()

      membership = membershipData
      isOwner = group.owner_id === user.id
      isMember = Boolean(membership && membership.status === 'active')
    }

    // Add membership info to group object
    const groupWithMembership = {
      ...group,
      is_member: isMember,
      is_owner: isOwner,
      user_role: membership?.role || null,
      user_status: membership?.status || null
    }

    logIfEnabled(`✅ Group details fetched for ${groupId}: ${group.name}`)
    
    return NextResponse.json(createSuccessResponse(
      groupWithMembership,
      'Group details fetched successfully'
    ))

  } catch (error: any) {
    logIfEnabled(`❌ Error in get group API: ${error.message}`, 'error')
    return NextResponse.json(createErrorResponse(
      ERROR_MESSAGES.INTERNAL_ERROR,
      error.message
    ), { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: groupId } = params
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED), { status: 401 })
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
      return NextResponse.json(createErrorResponse(ERROR_MESSAGES.INVALID_TOKEN), { status: 401 })
    }

    // Check if user is group owner
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('owner_id')
      .eq('id', groupId)
      .single()

    if (groupError || !group) {
      return NextResponse.json(createErrorResponse(ERROR_MESSAGES.GROUP_NOT_FOUND), { status: 404 })
    }

    if (group.owner_id !== user.id) {
      return NextResponse.json(createErrorResponse(ERROR_MESSAGES.FORBIDDEN, 'Only group owners can update group'), { status: 403 })
    }

    const updateData = await request.json()
    
    // Prepare update object with only allowed fields
    const allowedFields = [
      'name', 'description', 'mission_statement', 'meeting_time', 
      'meeting_location', 'age_range', 'max_members', 'is_public', 'requires_approval'
    ]
    
    const updateFields: any = {}
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updateFields[field] = updateData[field]
      }
    })

    // Convert max_members to number if provided
    if (updateFields.max_members) {
      updateFields.max_members = parseInt(updateFields.max_members)
    }

    // Update group
    const { data: updatedGroup, error: updateError } = await supabase
      .from('youth_groups')
      .update({
        ...updateFields,
        updated_at: new Date().toISOString()
      })
      .eq('id', groupId)
      .select()
      .single()

    if (updateError) {
      logIfEnabled(`❌ Error updating group: ${updateError.message}`, 'error')
      return NextResponse.json(createErrorResponse(
        'Failed to update group',
        updateError.message
      ), { status: 500 })
    }

    logIfEnabled(`✅ Group updated: ${groupId}`)
    
    return NextResponse.json(createSuccessResponse(
      updatedGroup,
      SUCCESS_MESSAGES.GROUP_UPDATED
    ))

  } catch (error: any) {
    logIfEnabled(`❌ Error in update group API: ${error.message}`, 'error')
    return NextResponse.json(createErrorResponse(
      ERROR_MESSAGES.INTERNAL_ERROR,
      error.message
    ), { status: 500 })
  }
}
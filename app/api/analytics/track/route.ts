// Analytics Tracking API
// Tracks user activities and engagement metrics

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSuccessResponse, createErrorResponse, ERROR_MESSAGES } from '@/lib/api-response'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED), { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(createErrorResponse(ERROR_MESSAGES.INVALID_TOKEN), { status: 401 })
    }

    const body = await request.json()
    const { userId, activity, groupId, eventId, postId, metadata, timestamp } = body

    // Validate required fields
    if (!userId || !activity || !timestamp) {
      return NextResponse.json(createErrorResponse(
        'Missing required fields: userId, activity, timestamp'
      ), { status: 400 })
    }

    // Create activity record
    const { data, error } = await supabase
      .from('user_activities')
      .insert([{
        user_id: userId,
        activity_type: activity,
        group_id: groupId,
        event_id: eventId,
        post_id: postId,
        metadata: metadata || {},
        activity_timestamp: timestamp,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating activity record:', error)
      return NextResponse.json(createErrorResponse(
        'Failed to track activity',
        error.message
      ), { status: 500 })
    }

    // Update user engagement metrics
    await updateUserEngagementMetrics(userId, activity)

    // Update group activity metrics if groupId is provided
    if (groupId) {
      await updateGroupActivityMetrics(groupId, activity)
    }

    return NextResponse.json(createSuccessResponse(
      data,
      'Activity tracked successfully'
    ))

  } catch (error: any) {
    console.error('Error in analytics tracking:', error)
    return NextResponse.json(createErrorResponse(
      ERROR_MESSAGES.INTERNAL_ERROR,
      error.message
    ), { status: 500 })
  }
}

// Update user engagement metrics
async function updateUserEngagementMetrics(userId: string, activity: string) {
  try {
    // Get current user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError || !userProfile) {
      console.error('Error fetching user profile:', profileError)
      return
    }

    // Update engagement metrics based on activity
    const updates: any = {
      last_active: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    switch (activity) {
      case 'group_joined':
        updates.groups_joined = (userProfile.groups_joined || 0) + 1
        break
      case 'group_created':
        updates.groups_created = (userProfile.groups_created || 0) + 1
        break
      case 'event_attended':
        updates.events_attended = (userProfile.events_attended || 0) + 1
        break
      case 'post_created':
        updates.posts_created = (userProfile.posts_created || 0) + 1
        break
    }

    // Update user profile
    await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)

  } catch (error) {
    console.error('Error updating user engagement metrics:', error)
  }
}

// Update group activity metrics
async function updateGroupActivityMetrics(groupId: string, activity: string) {
  try {
    // Get current group data
    const { data: group, error: groupError } = await supabase
      .from('youth_groups')
      .select('*')
      .eq('id', groupId)
      .single()

    if (groupError || !group) {
      console.error('Error fetching group:', groupError)
      return
    }

    // Update group activity metrics
    const updates: any = {
      updated_at: new Date().toISOString()
    }

    switch (activity) {
      case 'member_added':
        updates.member_count = (group.member_count || 0) + 1
        updates.last_activity = new Date().toISOString()
        break
      case 'event_created':
        updates.events_count = (group.events_count || 0) + 1
        updates.last_activity = new Date().toISOString()
        break
      case 'post_created':
        updates.posts_count = (group.posts_count || 0) + 1
        updates.last_activity = new Date().toISOString()
        break
    }

    // Update group
    await supabase
      .from('youth_groups')
      .update(updates)
      .eq('id', groupId)

  } catch (error) {
    console.error('Error updating group activity metrics:', error)
  }
}
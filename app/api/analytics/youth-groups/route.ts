// Youth Groups Analytics API
// Provides comprehensive analytics data for Youth Groups

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSuccessResponse, createErrorResponse, ERROR_MESSAGES } from '@/lib/api-response'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
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

    // Get analytics data
    const [
      userEngagement,
      groupActivity,
      trends,
      popularContent
    ] = await Promise.all([
      getUserEngagement(user.id),
      getGroupActivity(),
      getTrends(),
      getPopularContent()
    ])

    const analyticsData = {
      userEngagement,
      groupActivity,
      trends,
      popularContent,
      insights: await getInsights(user.id)
    }

    return NextResponse.json(createSuccessResponse(
      analyticsData,
      'Analytics data retrieved successfully'
    ))

  } catch (error: any) {
    console.error('Error in youth groups analytics:', error)
    return NextResponse.json(createErrorResponse(
      ERROR_MESSAGES.INTERNAL_ERROR,
      error.message
    ), { status: 500 })
  }
}

// Get user engagement metrics
async function getUserEngagement(userId: string) {
  const { data: userProfile } = await supabase
    .from('users')
    .select('groups_joined, groups_created, events_attended, posts_created, last_active')
    .eq('id', userId)
    .single()

  const { data: activities } = await supabase
    .from('user_activities')
    .select('activity_type, activity_timestamp')
    .eq('user_id', userId)
    .gte('activity_timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

  const totalActivity = activities?.length || 0

  return {
    groupsJoined: userProfile?.groups_joined || 0,
    groupsCreated: userProfile?.groups_created || 0,
    eventsAttended: userProfile?.events_attended || 0,
    postsCreated: userProfile?.posts_created || 0,
    totalActivity,
    lastActive: userProfile?.last_active || new Date().toISOString()
  }
}

// Get group activity metrics
async function getGroupActivity() {
  const { data: groups } = await supabase
    .from('youth_groups')
    .select('id, name, member_count, is_active, created_at')

  const { data: members } = await supabase
    .from('group_members')
    .select('group_id, status')
    .eq('status', 'active')

  const { data: events } = await supabase
    .from('group_events')
    .select('group_id, created_at')

  const { data: posts } = await supabase
    .from('group_posts')
    .select('group_id, created_at')

  const totalGroups = groups?.length || 0
  const activeGroups = groups?.filter(g => g.is_active).length || 0
  const totalMembers = members?.length || 0
  const totalEvents = events?.length || 0
  const totalPosts = posts?.length || 0
  const averageGroupSize = totalGroups > 0 ? totalMembers / totalGroups : 0

  // Find most active group
  const groupActivity = groups?.map(group => {
    const groupEvents = events?.filter(e => e.group_id === group.id).length || 0
    const groupPosts = posts?.filter(p => p.group_id === group.id).length || 0
    const activityScore = (group.member_count || 0) * 2 + groupEvents * 5 + groupPosts * 3
    return { ...group, activityScore }
  }) || []

  const mostActiveGroup = groupActivity.reduce((max, group) => 
    group.activityScore > max.activityScore ? group : max, groupActivity[0] || { name: 'None' })

  return {
    totalGroups,
    activeGroups,
    totalMembers,
    totalEvents,
    totalPosts,
    averageGroupSize: Math.round(averageGroupSize * 100) / 100,
    mostActiveGroup: mostActiveGroup.name
  }
}

// Get trends data
async function getTrends() {
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [groupsThisWeek, groupsThisMonth, membersThisWeek, membersThisMonth, eventsThisWeek, eventsThisMonth, postsThisWeek, postsThisMonth] = await Promise.all([
    supabase.from('youth_groups').select('id').gte('created_at', oneWeekAgo.toISOString()),
    supabase.from('youth_groups').select('id').gte('created_at', oneMonthAgo.toISOString()),
    supabase.from('group_members').select('id').gte('joined_at', oneWeekAgo.toISOString()),
    supabase.from('group_members').select('id').gte('joined_at', oneMonthAgo.toISOString()),
    supabase.from('group_events').select('id').gte('created_at', oneWeekAgo.toISOString()),
    supabase.from('group_events').select('id').gte('created_at', oneMonthAgo.toISOString()),
    supabase.from('group_posts').select('id').gte('created_at', oneWeekAgo.toISOString()),
    supabase.from('group_posts').select('id').gte('created_at', oneMonthAgo.toISOString())
  ])

  return {
    groupsCreatedThisWeek: groupsThisWeek.data?.length || 0,
    groupsCreatedThisMonth: groupsThisMonth.data?.length || 0,
    membersJoinedThisWeek: membersThisWeek.data?.length || 0,
    membersJoinedThisMonth: membersThisMonth.data?.length || 0,
    eventsCreatedThisWeek: eventsThisWeek.data?.length || 0,
    eventsCreatedThisMonth: eventsThisMonth.data?.length || 0,
    postsCreatedThisWeek: postsThisWeek.data?.length || 0,
    postsCreatedThisMonth: postsThisMonth.data?.length || 0
  }
}

// Get popular content
async function getPopularContent() {
  const { data: groups } = await supabase
    .from('youth_groups')
    .select('id, name, member_count, created_at')
    .eq('is_active', true)
    .order('member_count', { ascending: false })
    .limit(10)

  const { data: events } = await supabase
    .from('group_events')
    .select('id, title, group_id, created_at')
    .gte('event_date', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: posts } = await supabase
    .from('group_posts')
    .select('id, title, group_id, created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  // Get group names for events and posts
  const groupIds = [...new Set([
    ...(events?.map(e => e.group_id) || []),
    ...(posts?.map(p => p.group_id) || [])
  ])]

  const { data: groupNames } = await supabase
    .from('youth_groups')
    .select('id, name')
    .in('id', groupIds)

  const groupNameMap = groupNames?.reduce((acc, group) => {
    acc[group.id] = group.name
    return acc
  }, {} as Record<string, string>) || {}

  return {
    topGroups: groups?.map(group => ({
      id: group.id,
      name: group.name,
      memberCount: group.member_count || 0,
      activityScore: (group.member_count || 0) * 2
    })) || [],
    topEvents: events?.map(event => ({
      id: event.id,
      title: event.title,
      groupId: event.group_id,
      groupName: groupNameMap[event.group_id] || 'Unknown Group',
      attendees: 0 // This would need to be calculated from attendance records
    })) || [],
    topPosts: posts?.map(post => ({
      id: post.id,
      title: post.title || 'Untitled Post',
      groupId: post.group_id,
      groupName: groupNameMap[post.group_id] || 'Unknown Group',
      engagement: 0 // This would need to be calculated from engagement metrics
    })) || []
  }
}

// Get insights
async function getInsights(userId: string) {
  const { data: activities } = await supabase
    .from('user_activities')
    .select('created_at')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

  // Calculate peak activity hours
  const hourCounts = new Array(24).fill(0)
  activities?.forEach(activity => {
    const hour = new Date(activity.activity_timestamp).getHours()
    hourCounts[hour]++
  })
  const peakActivityHours = hourCounts
    .map((count, hour) => ({ hour, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(item => item.hour)

  // Calculate most active day
  const dayCounts = new Array(7).fill(0)
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  activities?.forEach(activity => {
    const day = new Date(activity.activity_timestamp).getDay()
    dayCounts[day]++
  })
  const mostActiveDay = dayNames[dayCounts.indexOf(Math.max(...dayCounts))]

  return {
    peakActivityHours,
    mostActiveDay,
    averageSessionDuration: 15, // This would need to be calculated from session data
    userRetentionRate: 85, // This would need to be calculated from user activity patterns
    groupGrowthRate: 12 // This would need to be calculated from group creation trends
  }
}

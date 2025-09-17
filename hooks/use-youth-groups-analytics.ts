// Youth Groups Analytics Hook
// Tracks user engagement and group activity

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { YouthGroup, GroupEvent, GroupPost, GroupMember } from '@/types/youth-groups'

export interface AnalyticsData {
  userEngagement: {
    groupsJoined: number
    groupsCreated: number
    eventsAttended: number
    postsCreated: number
    totalActivity: number
    lastActive: string
  }
  groupActivity: {
    totalGroups: number
    activeGroups: number
    totalMembers: number
    totalEvents: number
    totalPosts: number
    averageGroupSize: number
    mostActiveGroup: string
  }
  trends: {
    groupsCreatedThisWeek: number
    groupsCreatedThisMonth: number
    membersJoinedThisWeek: number
    membersJoinedThisMonth: number
    eventsCreatedThisWeek: number
    eventsCreatedThisMonth: number
    postsCreatedThisWeek: number
    postsCreatedThisMonth: number
  }
  popularContent: {
    topGroups: Array<{ id: string; name: string; memberCount: number; activityScore: number }>
    topEvents: Array<{ id: string; title: string; groupId: string; groupName: string; attendees: number }>
    topPosts: Array<{ id: string; title: string; groupId: string; groupName: string; engagement: number }>
  }
  insights: {
    peakActivityHours: number[]
    mostActiveDay: string
    averageSessionDuration: number
    userRetentionRate: number
    groupGrowthRate: number
  }
}

export function useYouthGroupsAnalytics() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Track user activity
  const trackActivity = useCallback(async (activity: {
    type: 'group_joined' | 'group_created' | 'event_attended' | 'post_created' | 'member_added' | 'event_created'
    groupId?: string
    eventId?: string
    postId?: string
    metadata?: any
  }) => {
    if (!user) return

    try {
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          activity: activity.type,
          groupId: activity.groupId,
          eventId: activity.eventId,
          postId: activity.postId,
          metadata: activity.metadata,
          timestamp: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to track activity')
      }
    } catch (error) {
      console.error('Error tracking activity:', error)
    }
  }, [user])

  // Get analytics data
  const fetchAnalytics = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/analytics/youth-groups')

      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const data = await response.json()
      setAnalytics(data.data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [user])

  // Calculate engagement score for a group
  const calculateGroupEngagement = useCallback((group: YouthGroup, events: GroupEvent[], posts: GroupPost[]): number => {
    const eventCount = events.filter(e => e.group_id === group.id).length
    const postCount = posts.filter(p => p.group_id === group.id).length
    const memberCount = group.member_count || 0
    
    // Simple engagement score calculation
    const baseScore = memberCount * 2
    const eventScore = eventCount * 5
    const postScore = postCount * 3
    
    return baseScore + eventScore + postScore
  }, [])

  // Get user's activity summary
  const getUserActivitySummary = useCallback(async (): Promise<{
    groupsJoined: number
    groupsCreated: number
    eventsAttended: number
    postsCreated: number
    lastActive: string
  }> => {
    if (!user) {
      return {
        groupsJoined: 0,
        groupsCreated: 0,
        eventsAttended: 0,
        postsCreated: 0,
        lastActive: new Date().toISOString()
      }
    }

    try {
      const response = await fetch(`/api/analytics/user-activity/${user.id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch user activity')
      }

      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('Error fetching user activity:', error)
      return {
        groupsJoined: 0,
        groupsCreated: 0,
        eventsAttended: 0,
        postsCreated: 0,
        lastActive: new Date().toISOString()
      }
    }
  }, [user])

  // Get group activity summary
  const getGroupActivitySummary = useCallback(async (groupId: string): Promise<{
    memberCount: number
    eventCount: number
    postCount: number
    activityScore: number
    lastActivity: string
  }> => {
    try {
      const response = await fetch(`/api/analytics/group-activity/${groupId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch group activity')
      }

      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('Error fetching group activity:', error)
      return {
        memberCount: 0,
        eventCount: 0,
        postCount: 0,
        activityScore: 0,
        lastActivity: new Date().toISOString()
      }
    }
  }, [])

  // Get trends data
  const getTrends = useCallback(async (period: 'week' | 'month' | 'year' = 'month'): Promise<{
    groupsCreated: number
    membersJoined: number
    eventsCreated: number
    postsCreated: number
    growthRate: number
  }> => {
    try {
      const response = await fetch(`/api/analytics/trends?period=${period}`)

      if (!response.ok) {
        throw new Error('Failed to fetch trends')
      }

      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('Error fetching trends:', error)
      return {
        groupsCreated: 0,
        membersJoined: 0,
        eventsCreated: 0,
        postsCreated: 0,
        growthRate: 0
      }
    }
  }, [])

  // Get popular content
  const getPopularContent = useCallback(async (): Promise<{
    topGroups: Array<{ id: string; name: string; memberCount: number; activityScore: number }>
    topEvents: Array<{ id: string; title: string; groupId: string; groupName: string; attendees: number }>
    topPosts: Array<{ id: string; title: string; groupId: string; groupName: string; engagement: number }>
  }> => {
    try {
      const response = await fetch('/api/analytics/popular-content')

      if (!response.ok) {
        throw new Error('Failed to fetch popular content')
      }

      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('Error fetching popular content:', error)
      return {
        topGroups: [],
        topEvents: [],
        topPosts: []
      }
    }
  }, [])

  // Refresh analytics data
  const refreshAnalytics = useCallback(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  // Load analytics on mount
  useEffect(() => {
    if (user) {
      fetchAnalytics()
    }
  }, [user, fetchAnalytics])

  return {
    analytics,
    loading,
    error,
    trackActivity,
    getUserActivitySummary,
    getGroupActivitySummary,
    getTrends,
    getPopularContent,
    refreshAnalytics,
    calculateGroupEngagement
  }
}

// Hook for tracking specific events
export function useActivityTracker() {
  const { trackActivity } = useYouthGroupsAnalytics()

  const trackGroupJoin = useCallback((groupId: string) => {
    trackActivity({
      type: 'group_joined',
      groupId
    })
  }, [trackActivity])

  const trackGroupCreate = useCallback((groupId: string) => {
    trackActivity({
      type: 'group_created',
      groupId
    })
  }, [trackActivity])

  const trackEventAttend = useCallback((eventId: string, groupId: string) => {
    trackActivity({
      type: 'event_attended',
      eventId,
      groupId
    })
  }, [trackActivity])

  const trackPostCreate = useCallback((postId: string, groupId: string) => {
    trackActivity({
      type: 'post_created',
      postId,
      groupId
    })
  }, [trackActivity])

  const trackEventCreate = useCallback((eventId: string, groupId: string) => {
    trackActivity({
      type: 'event_created',
      eventId,
      groupId
    })
  }, [trackActivity])

  const trackMemberAdd = useCallback((groupId: string, memberId: string) => {
    trackActivity({
      type: 'member_added',
      groupId,
      metadata: { memberId }
    })
  }, [trackActivity])

  return {
    trackGroupJoin,
    trackGroupCreate,
    trackEventAttend,
    trackPostCreate,
    trackEventCreate,
    trackMemberAdd
  }
}

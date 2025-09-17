// Real-time Youth Groups Hook
// Provides live updates for groups, members, events, and posts

import { useEffect, useCallback, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useAuth } from '@/contexts/auth-context'
import { YouthGroup, GroupMember, GroupEvent, GroupPost } from '@/types/youth-groups'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
)

interface RealtimeCallbacks {
  onGroupUpdate?: (group: YouthGroup) => void
  onGroupDelete?: (groupId: string) => void
  onMemberJoin?: (member: GroupMember) => void
  onMemberLeave?: (memberId: string, groupId: string) => void
  onEventCreate?: (event: GroupEvent) => void
  onEventUpdate?: (event: GroupEvent) => void
  onEventDelete?: (eventId: string, groupId: string) => void
  onPostCreate?: (post: GroupPost) => void
  onPostUpdate?: (post: GroupPost) => void
  onPostDelete?: (postId: string, groupId: string) => void
  onJoinRequest?: (request: any) => void
  onJoinRequestUpdate?: (request: any) => void
}

export function useRealtimeYouthGroups(callbacks: RealtimeCallbacks = {}) {
  const { user } = useAuth()
  const subscriptions = useRef<Array<{ unsubscribe: () => void }>>([])

  const cleanup = useCallback(() => {
    subscriptions.current.forEach(sub => sub.unsubscribe())
    subscriptions.current = []
  }, [])

  useEffect(() => {
    if (!user) {
      cleanup()
      return
    }

    console.log('🔌 Setting up real-time subscriptions for user:', user.id)

    // Subscribe to youth groups changes
    const groupsSubscription = supabase
      .channel('youth_groups_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'youth_groups'
        },
        (payload) => {
          console.log('📡 Youth Groups change:', payload)
          
          switch (payload.eventType) {
            case 'UPDATE':
              if (callbacks.onGroupUpdate) {
                callbacks.onGroupUpdate(payload.new as YouthGroup)
              }
              break
            case 'DELETE':
              if (callbacks.onGroupDelete) {
                callbacks.onGroupDelete(payload.old.id)
              }
              break
          }
        }
      )
      .subscribe()

    // Subscribe to group members changes
    const membersSubscription = supabase
      .channel('group_members_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_members'
        },
        (payload) => {
          console.log('📡 Group Members change:', payload)
          
          switch (payload.eventType) {
            case 'INSERT':
              if (callbacks.onMemberJoin) {
                callbacks.onMemberJoin(payload.new as GroupMember)
              }
              break
            case 'DELETE':
              if (callbacks.onMemberLeave) {
                callbacks.onMemberLeave(payload.old.id, payload.old.group_id)
              }
              break
          }
        }
      )
      .subscribe()

    // Subscribe to group events changes
    const eventsSubscription = supabase
      .channel('group_events_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_events'
        },
        (payload) => {
          console.log('📡 Group Events change:', payload)
          
          switch (payload.eventType) {
            case 'INSERT':
              if (callbacks.onEventCreate) {
                callbacks.onEventCreate(payload.new as GroupEvent)
              }
              break
            case 'UPDATE':
              if (callbacks.onEventUpdate) {
                callbacks.onEventUpdate(payload.new as GroupEvent)
              }
              break
            case 'DELETE':
              if (callbacks.onEventDelete) {
                callbacks.onEventDelete(payload.old.id, payload.old.group_id)
              }
              break
          }
        }
      )
      .subscribe()

    // Subscribe to group posts changes
    const postsSubscription = supabase
      .channel('group_posts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_posts'
        },
        (payload) => {
          console.log('📡 Group Posts change:', payload)
          
          switch (payload.eventType) {
            case 'INSERT':
              if (callbacks.onPostCreate) {
                callbacks.onPostCreate(payload.new as GroupPost)
              }
              break
            case 'UPDATE':
              if (callbacks.onPostUpdate) {
                callbacks.onPostUpdate(payload.new as GroupPost)
              }
              break
            case 'DELETE':
              if (callbacks.onPostDelete) {
                callbacks.onPostDelete(payload.old.id, payload.old.group_id)
              }
              break
          }
        }
      )
      .subscribe()

    // Subscribe to join requests changes
    const joinRequestsSubscription = supabase
      .channel('group_join_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_join_requests'
        },
        (payload) => {
          console.log('📡 Join Requests change:', payload)
          
          switch (payload.eventType) {
            case 'INSERT':
              if (callbacks.onJoinRequest) {
                callbacks.onJoinRequest(payload.new)
              }
              break
            case 'UPDATE':
              if (callbacks.onJoinRequestUpdate) {
                callbacks.onJoinRequestUpdate(payload.new)
              }
              break
          }
        }
      )
      .subscribe()

    // Store subscriptions for cleanup
    subscriptions.current = [
      groupsSubscription,
      membersSubscription,
      eventsSubscription,
      postsSubscription,
      joinRequestsSubscription
    ]

    return () => {
      console.log('🔌 Cleaning up real-time subscriptions')
      cleanup()
    }
  }, [user, callbacks, cleanup])

  return {
    cleanup
  }
}

// Hook for specific group real-time updates
export function useRealtimeGroup(groupId: string, callbacks: RealtimeCallbacks = {}) {
  const { user } = useAuth()
  const subscriptions = useRef<Array<{ unsubscribe: () => void }>>([])

  const cleanup = useCallback(() => {
    subscriptions.current.forEach(sub => sub.unsubscribe())
    subscriptions.current = []
  }, [])

  useEffect(() => {
    if (!user || !groupId) {
      cleanup()
      return
    }

    console.log('🔌 Setting up real-time subscriptions for group:', groupId)

    // Subscribe to group-specific changes
    const groupSubscription = supabase
      .channel(`group_${groupId}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_members',
          filter: `group_id=eq.${groupId}`
        },
        (payload) => {
          console.log('📡 Group member change:', payload)
          
          switch (payload.eventType) {
            case 'INSERT':
              if (callbacks.onMemberJoin) {
                callbacks.onMemberJoin(payload.new as GroupMember)
              }
              break
            case 'DELETE':
              if (callbacks.onMemberLeave) {
                callbacks.onMemberLeave(payload.old.id, groupId)
              }
              break
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_events',
          filter: `group_id=eq.${groupId}`
        },
        (payload) => {
          console.log('📡 Group event change:', payload)
          
          switch (payload.eventType) {
            case 'INSERT':
              if (callbacks.onEventCreate) {
                callbacks.onEventCreate(payload.new as GroupEvent)
              }
              break
            case 'UPDATE':
              if (callbacks.onEventUpdate) {
                callbacks.onEventUpdate(payload.new as GroupEvent)
              }
              break
            case 'DELETE':
              if (callbacks.onEventDelete) {
                callbacks.onEventDelete(payload.old.id, groupId)
              }
              break
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_posts',
          filter: `group_id=eq.${groupId}`
        },
        (payload) => {
          console.log('📡 Group post change:', payload)
          
          switch (payload.eventType) {
            case 'INSERT':
              if (callbacks.onPostCreate) {
                callbacks.onPostCreate(payload.new as GroupPost)
              }
              break
            case 'UPDATE':
              if (callbacks.onPostUpdate) {
                callbacks.onPostUpdate(payload.new as GroupPost)
              }
              break
            case 'DELETE':
              if (callbacks.onPostDelete) {
                callbacks.onPostDelete(payload.old.id, groupId)
              }
              break
          }
        }
      )
      .subscribe()

    subscriptions.current = [groupSubscription]

    return () => {
      console.log('🔌 Cleaning up group real-time subscriptions')
      cleanup()
    }
  }, [user, groupId, callbacks, cleanup])

  return {
    cleanup
  }
}

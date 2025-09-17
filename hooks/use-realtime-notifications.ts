// Real-time Notifications Hook
// Manages push notifications and real-time alerts for Youth Groups

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { useRealtimeYouthGroups } from './use-realtime-youth-groups'

export interface Notification {
  id: string
  type: 'group_update' | 'member_join' | 'member_leave' | 'event_created' | 'event_updated' | 'post_created' | 'join_request' | 'join_request_approved' | 'join_request_rejected'
  title: string
  message: string
  groupId: string
  groupName: string
  userId: string
  timestamp: string
  read: boolean
  data?: any
}

export function useRealtimeNotifications() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Generate notification from real-time events
  const generateNotification = useCallback((
    type: Notification['type'],
    title: string,
    message: string,
    groupId: string,
    groupName: string,
    data?: any
  ): Notification => {
    return {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      groupId,
      groupName,
      userId: user?.id || '',
      timestamp: new Date().toISOString(),
      read: false,
      data
    }
  }, [user?.id])

  // Add notification to state
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 50)) // Keep last 50 notifications
    setUnreadCount(prev => prev + 1)
    
    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type.includes('error') ? 'destructive' : 'default'
    })
  }, [toast])

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
    setUnreadCount(0)
  }, [])

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([])
    setUnreadCount(0)
  }, [])

  // Set up real-time subscriptions
  useRealtimeYouthGroups({
    onGroupUpdate: (group) => {
      const notification = generateNotification(
        'group_update',
        'Group Updated',
        `${group.name} has been updated`,
        group.id,
        group.name,
        group
      )
      addNotification(notification)
    },

    onMemberJoin: (member) => {
      const notification = generateNotification(
        'member_join',
        'New Member Joined',
        `${member.user?.name || 'Someone'} joined the group`,
        member.group_id,
        'Your Group', // We'll need to get group name
        member
      )
      addNotification(notification)
    },

    onMemberLeave: (memberId, groupId) => {
      const notification = generateNotification(
        'member_leave',
        'Member Left',
        'A member left the group',
        groupId,
        'Your Group',
        { memberId, groupId }
      )
      addNotification(notification)
    },

    onEventCreate: (event) => {
      const notification = generateNotification(
        'event_created',
        'New Event Created',
        `${event.title} has been scheduled`,
        event.group_id,
        'Your Group',
        event
      )
      addNotification(notification)
    },

    onEventUpdate: (event) => {
      const notification = generateNotification(
        'event_updated',
        'Event Updated',
        `${event.title} has been updated`,
        event.group_id,
        'Your Group',
        event
      )
      addNotification(notification)
    },

    onPostCreate: (post) => {
      const notification = generateNotification(
        'post_created',
        'New Post',
        `New post in the group`,
        post.group_id,
        'Your Group',
        post
      )
      addNotification(notification)
    },

    onJoinRequest: (request) => {
      const notification = generateNotification(
        'join_request',
        'Join Request',
        'Someone wants to join your group',
        request.group_id,
        'Your Group',
        request
      )
      addNotification(notification)
    },

    onJoinRequestUpdate: (request) => {
      const notification = generateNotification(
        request.status === 'approved' ? 'join_request_approved' : 'join_request_rejected',
        request.status === 'approved' ? 'Join Request Approved' : 'Join Request Rejected',
        `Your join request was ${request.status}`,
        request.group_id,
        'Your Group',
        request
      )
      addNotification(notification)
    }
  })

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    addNotification
  }
}

// Hook for browser push notifications
export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false

    const result = await Notification.requestPermission()
    setPermission(result)
    return result === 'granted'
  }, [isSupported])

  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission !== 'granted') return

    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    })

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close()
    }, 5000)

    return notification
  }, [permission])

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification
  }
}

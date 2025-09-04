"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'

export interface UserPermissions {
  canCreateGroups: boolean
  isGroupLeader: boolean
  userRole: 'admin' | 'group_leader' | 'member'
  canManageGroup: (groupId: string) => boolean
  canJoinGroup: (groupId: string) => boolean
  canCreateEvents: (groupId: string) => boolean
  canCreatePosts: (groupId: string) => boolean
  canManageMembers: (groupId: string) => boolean
}

export interface GroupPermissions {
  isOwner: boolean
  isMember: boolean
  isPending: boolean
  canManage: boolean
  canJoin: boolean
  canLeave: boolean
  canCreateEvents: boolean
  canCreatePosts: boolean
  canManageMembers: boolean
  userRole: string
}

export function usePermissions() {
  const { user } = useAuth()
  const [permissions, setPermissions] = useState<UserPermissions | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setPermissions(null)
      setLoading(false)
      return
    }

    // Fetch user permissions from the database
    fetchUserPermissions()
  }, [user])

  const fetchUserPermissions = async () => {
    try {
      // Get the access token from Supabase
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      
      if (!token) {
        console.log('No access token available, using fallback permissions')
        setPermissions({
          canCreateGroups: false,
          isGroupLeader: false,
          userRole: 'member',
          canManageGroup: () => false,
          canJoinGroup: () => true,
          canCreateEvents: () => false,
          canCreatePosts: () => false,
          canManageMembers: () => false,
        })
        setLoading(false)
        return
      }

      const response = await fetch('/api/users/permissions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPermissions(data.permissions)
      } else {
        console.log('Permissions API failed, using fallback permissions')
        // Fallback to basic permissions
        setPermissions({
          canCreateGroups: false,
          isGroupLeader: false,
          userRole: 'member',
          canManageGroup: () => false,
          canJoinGroup: () => true,
          canCreateEvents: () => false,
          canCreatePosts: () => false,
          canManageMembers: () => false,
        })
      }
    } catch (error) {
      console.error('Error fetching permissions:', error)
      // Fallback to basic permissions
      setPermissions({
        canCreateGroups: false,
        isGroupLeader: false,
        userRole: 'member',
        canManageGroup: () => false,
        canJoinGroup: () => true,
        canCreateEvents: () => false,
        canCreatePosts: () => false,
        canManageMembers: () => false,
      })
    } finally {
      setLoading(false)
    }
  }

  const getGroupPermissions = async (groupId: string): Promise<GroupPermissions> => {
    try {
      const response = await fetch(`/api/youth-groups/${groupId}/permissions`)
      if (response.ok) {
        const data = await response.json()
        return data.permissions
      }
    } catch (error) {
      console.error('Error fetching group permissions:', error)
    }

    // Fallback permissions
    return {
      isOwner: false,
      isMember: false,
      isPending: false,
      canManage: false,
      canJoin: true,
      canLeave: false,
      canCreateEvents: false,
      canCreatePosts: false,
      canManageMembers: false,
      userRole: 'non_member',
    }
  }

  const checkPermission = (permission: keyof UserPermissions): boolean => {
    if (!permissions) return false
    
    if (typeof permissions[permission] === 'function') {
      return (permissions[permission] as Function)()
    }
    
    return Boolean(permissions[permission])
  }

  const hasRole = (role: string): boolean => {
    return permissions?.userRole === role
  }

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.includes(permissions?.userRole || '')
  }

  return {
    permissions,
    loading,
    getGroupPermissions,
    checkPermission,
    hasRole,
    hasAnyRole,
    refreshPermissions: fetchUserPermissions,
  }
}

// Hook for checking specific group permissions
export function useGroupPermissions(groupId: string) {
  const [groupPermissions, setGroupPermissions] = useState<GroupPermissions | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user || !groupId) {
      setGroupPermissions(null)
      setLoading(false)
      return
    }

    fetchGroupPermissions()
  }, [user, groupId])

  const fetchGroupPermissions = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/youth-groups/${groupId}/permissions`)
      if (response.ok) {
        const data = await response.json()
        setGroupPermissions(data.permissions)
      }
    } catch (error) {
      console.error('Error fetching group permissions:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    groupPermissions,
    loading,
    refreshPermissions: fetchGroupPermissions,
  }
}

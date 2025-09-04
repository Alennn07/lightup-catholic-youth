"use client"

import { ReactNode } from 'react'
import { usePermissions } from '@/hooks/use-permissions'

interface RoleBasedWrapperProps {
  children: ReactNode
  requiredRole?: string | string[]
  requiredPermission?: string
  groupId?: string
  fallback?: ReactNode
  showIfNoPermission?: boolean
}

export function RoleBasedWrapper({
  children,
  requiredRole,
  requiredPermission,
  groupId,
  fallback = null,
  showIfNoPermission = false
}: RoleBasedWrapperProps) {
  const { permissions, loading } = usePermissions()

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
  }

  if (!permissions) {
    return showIfNoPermission ? <>{children}</> : <>{fallback}</>
  }

  // Check role-based access
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    const hasRequiredRole = roles.includes(permissions.userRole)
    
    if (!hasRequiredRole) {
      return showIfNoPermission ? <>{children}</> : <>{fallback}</>
    }
  }

  // Check permission-based access
  if (requiredPermission) {
    const hasPermission = checkPermission(permissions, requiredPermission, groupId)
    
    if (!hasPermission) {
      return showIfNoPermission ? <>{children}</> : <>{fallback}</>
    }
  }

  return <>{children}</>
}

function checkPermission(permissions: any, permission: string, groupId?: string): boolean {
  switch (permission) {
    case 'create_groups':
      return permissions.canCreateGroups
    case 'manage_group':
      return groupId ? permissions.canManageGroup(groupId) : false
    case 'join_group':
      return groupId ? permissions.canJoinGroup(groupId) : true
    case 'create_events':
      return groupId ? permissions.canCreateEvents(groupId) : false
    case 'create_posts':
      return groupId ? permissions.canCreatePosts(groupId) : false
    case 'manage_members':
      return groupId ? permissions.canManageMembers(groupId) : false
    default:
      return false
  }
}

// Specific role-based components for common use cases
export function AdminOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleBasedWrapper requiredRole="admin" fallback={fallback}>
      {children}
    </RoleBasedWrapper>
  )
}

export function GroupLeaderOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleBasedWrapper requiredRole={['admin', 'group_leader']} fallback={fallback}>
      {children}
    </RoleBasedWrapper>
  )
}

export function GroupOwnerOnly({ 
  children, 
  groupId, 
  fallback = null 
}: { 
  children: ReactNode
  groupId: string
  fallback?: ReactNode 
}) {
  return (
    <RoleBasedWrapper 
      requiredPermission="manage_group" 
      groupId={groupId} 
      fallback={fallback}
    >
      {children}
    </RoleBasedWrapper>
  )
}

export function GroupMemberOnly({ 
  children, 
  groupId, 
  fallback = null 
}: { 
  children: ReactNode
  groupId: string
  fallback?: ReactNode 
}) {
  return (
    <RoleBasedWrapper 
      requiredPermission="join_group" 
      groupId={groupId} 
      fallback={fallback}
    >
      {children}
    </RoleBasedWrapper>
  )
}

export function CanCreateGroups({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleBasedWrapper requiredPermission="create_groups" fallback={fallback}>
      {children}
    </RoleBasedWrapper>
  )
}

export function CanManageMembers({ 
  children, 
  groupId, 
  fallback = null 
}: { 
  children: ReactNode
  groupId: string
  fallback?: ReactNode 
}) {
  return (
    <RoleBasedWrapper 
      requiredPermission="manage_members" 
      groupId={groupId} 
      fallback={fallback}
    >
      {children}
    </RoleBasedWrapper>
  )
}

export function CanCreateEvents({ 
  children, 
  groupId, 
  fallback = null 
}: { 
  children: ReactNode
  groupId: string
  fallback?: ReactNode 
}) {
  return (
    <RoleBasedWrapper 
      requiredPermission="create_events" 
      groupId={groupId} 
      fallback={fallback}
    >
      {children}
    </RoleBasedWrapper>
  )
}

export function CanCreatePosts({ 
  children, 
  groupId, 
  fallback = null 
}: { 
  children: ReactNode
  groupId: string
  fallback?: ReactNode 
}) {
  return (
    <RoleBasedWrapper 
      requiredPermission="create_posts" 
      groupId={groupId} 
      fallback={fallback}
    >
      {children}
    </RoleBasedWrapper>
  )
}

"use client"

import { usePermissions } from '@/hooks/use-permissions'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Info, Lock, UserCheck } from 'lucide-react'

interface PermissionFeedbackProps {
  action: string
  children: React.ReactNode
  fallback?: React.ReactNode
  showExplanation?: boolean
}

export function PermissionFeedback({ 
  action, 
  children, 
  fallback = null, 
  showExplanation = true 
}: PermissionFeedbackProps) {
  const { permissions, loading } = usePermissions()

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
  }

  if (!permissions) {
    return <>{fallback}</>
  }

  // Check if user has permission for the action
  const hasPermission = checkActionPermission(permissions, action)

  if (hasPermission) {
    return <>{children}</>
  }

  if (!showExplanation) {
    return <>{fallback}</>
  }

  return (
    <div className="space-y-2">
      {fallback}
      <Alert className="border-amber-200 bg-amber-50">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          {getPermissionMessage(action, permissions.userRole)}
        </AlertDescription>
      </Alert>
    </div>
  )
}

function checkActionPermission(permissions: any, action: string): boolean {
  switch (action) {
    case 'create_group':
      return permissions.canCreateGroups
    case 'manage_group':
      return permissions.canManageAllGroups
    case 'moderate_content':
      return permissions.canModerateContent
    case 'join_group':
      return permissions.canJoinGroups
    case 'create_event':
      return permissions.canCreateEvents
    case 'create_post':
      return permissions.canCreatePosts
    case 'manage_members':
      return permissions.canManageMembers
    case 'delete_content':
      return permissions.canDeleteContent
    default:
      return false
  }
}

function getPermissionMessage(action: string, userRole: string): string {
  const messages = {
    create_group: {
      member: "You need to be verified to create groups. Please contact an administrator to get verified.",
      group_leader: "You can create groups.",
      admin: "You can create and manage all groups."
    },
    manage_group: {
      member: "Only group leaders can manage groups.",
      group_leader: "You can manage groups you lead.",
      admin: "You can manage all groups."
    },
    join_group: {
      member: "You can join groups.",
      group_leader: "You can join groups.",
      admin: "You can join any group."
    },
    create_event: {
      member: "You need to be a group leader to create events.",
      group_leader: "You can create events in groups you lead.",
      admin: "You can create events in any group."
    },
    create_post: {
      member: "You can create posts in groups you're a member of.",
      group_leader: "You can create posts in groups you lead.",
      admin: "You can create posts in any group."
    }
  }

  return messages[action as keyof typeof messages]?.[userRole as keyof typeof messages.create_group] || 
         "You don't have permission to perform this action."
}

// Specific permission components
export function CreateGroupPermission({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionFeedback action="create_group" fallback={fallback}>
      {children}
    </PermissionFeedback>
  )
}

export function ManageGroupPermission({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionFeedback action="manage_group" fallback={fallback}>
      {children}
    </PermissionFeedback>
  )
}

export function ModerateContentPermission({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionFeedback action="moderate_content" fallback={fallback}>
      {children}
    </PermissionFeedback>
  )
}

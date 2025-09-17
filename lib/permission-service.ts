/**
 * Enterprise Permission Service
 * Centralized permission logic for Youth Groups feature
 */

export interface UserProfile {
  id: string
  role: 'admin' | 'group_leader' | 'member'
  is_verified: boolean
  is_active: boolean
  created_at: string
}

export interface PermissionResult {
  canCreateGroups: boolean
  canManageAllGroups: boolean
  canModerateContent: boolean
  canJoinGroups: boolean
  canCreateEvents: boolean
  canCreatePosts: boolean
  canManageMembers: boolean
  canDeleteContent: boolean
  userRole: 'admin' | 'group_leader' | 'member'
  isGroupLeader: boolean
}

/**
 * Calculate user permissions based on profile and context
 */
export function calculatePermissions(profile: UserProfile | null): PermissionResult {
  // Default permissions for unauthenticated users
  if (!profile) {
    return {
      canCreateGroups: false,
      canManageAllGroups: false,
      canModerateContent: false,
      canJoinGroups: false,
      canCreateEvents: false,
      canCreatePosts: false,
      canManageMembers: false,
      canDeleteContent: false,
      userRole: 'member',
      isGroupLeader: false,
    }
  }

  const { role, is_verified, is_active } = profile
  const isAdmin = role === 'admin'
  const isGroupLeader = role === 'group_leader' || isAdmin
  const isActive = is_active !== false // Default to true if not set

  // Enterprise permission matrix
  return {
    // Group creation: Active users who are verified, group leaders, or admins
    canCreateGroups: isActive && (is_verified || isGroupLeader),
    
    // Global management: Only admins
    canManageAllGroups: isAdmin,
    
    // Content moderation: Group leaders and admins
    canModerateContent: isGroupLeader,
    
    // Group joining: All active users
    canJoinGroups: isActive,
    
    // Event creation: Group leaders and admins (can be enhanced with group membership checks)
    canCreateEvents: isActive && isGroupLeader,
    
    // Post creation: All active users (can be enhanced with group membership checks)
    canCreatePosts: isActive,
    
    // Member management: Group leaders and admins
    canManageMembers: isGroupLeader,
    
    // Content deletion: Group leaders and admins
    canDeleteContent: isGroupLeader,
    
    // User role and status
    userRole: role,
    isGroupLeader,
  }
}

/**
 * Check if user can perform a specific action on a group
 */
export function canPerformAction(
  permissions: PermissionResult,
  action: string,
  groupId?: string,
  isGroupOwner?: boolean,
  isGroupMember?: boolean
): boolean {
  switch (action) {
    case 'create_group':
      return permissions.canCreateGroups
    
    case 'manage_group':
      return permissions.canManageAllGroups || isGroupOwner
    
    case 'join_group':
      return permissions.canJoinGroups
    
    case 'create_event':
      return permissions.canCreateEvents && (isGroupMember || permissions.canManageAllGroups)
    
    case 'create_post':
      return permissions.canCreatePosts && (isGroupMember || permissions.canManageAllGroups)
    
    case 'manage_members':
      return permissions.canManageMembers && (isGroupOwner || permissions.canManageAllGroups)
    
    case 'delete_content':
      return permissions.canDeleteContent && (isGroupMember || permissions.canManageAllGroups)
    
    case 'moderate_content':
      return permissions.canModerateContent
    
    default:
      return false
  }
}

/**
 * Get user-friendly permission messages
 */
export function getPermissionMessage(action: string, userRole: string): string {
  const messages = {
    create_group: {
      member: "You need to be verified to create groups. Please contact an administrator.",
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
    }
  }

  return messages[action as keyof typeof messages]?.[userRole as keyof typeof messages.create_group] || 
         "You don't have permission to perform this action."
}

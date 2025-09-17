// Standardized API Response Types
// This ensures all APIs return consistent response structures

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  details?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  success: false
  error: string
  details?: string
  code?: string
}

// Helper functions for creating standardized responses
export function createSuccessResponse<T>(
  data: T, 
  message?: string, 
  pagination?: ApiResponse<T>['pagination']
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    pagination
  }
}

export function createErrorResponse(
  error: string, 
  details?: string, 
  code?: string
): ApiError {
  return {
    success: false,
    error,
    details,
    code
  }
}

// Common error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  RATE_LIMITED: 'Too many requests',
  INVALID_TOKEN: 'Invalid authentication token',
  USER_NOT_FOUND: 'User not found',
  GROUP_NOT_FOUND: 'Group not found',
  MEMBER_NOT_FOUND: 'Member not found',
  REQUEST_NOT_FOUND: 'Request not found',
  EVENT_NOT_FOUND: 'Event not found',
  POST_NOT_FOUND: 'Post not found',
  ALREADY_MEMBER: 'User is already a member',
  NOT_MEMBER: 'User is not a member',
  GROUP_FULL: 'Group has reached maximum capacity',
  INVALID_ACTION: 'Invalid action',
  MISSING_FIELDS: 'Required fields are missing'
} as const

// Common success messages
export const SUCCESS_MESSAGES = {
  GROUP_CREATED: 'Group created successfully',
  GROUP_UPDATED: 'Group updated successfully',
  GROUP_DELETED: 'Group deleted successfully',
  MEMBER_ADDED: 'Member added successfully',
  MEMBER_REMOVED: 'Member removed successfully',
  MEMBER_ROLE_UPDATED: 'Member role updated successfully',
  JOIN_REQUEST_CREATED: 'Join request created successfully',
  JOIN_REQUEST_APPROVED: 'Join request approved',
  JOIN_REQUEST_REJECTED: 'Join request rejected',
  EVENT_CREATED: 'Event created successfully',
  EVENT_UPDATED: 'Event updated successfully',
  EVENT_DELETED: 'Event deleted successfully',
  POST_CREATED: 'Post created successfully',
  POST_UPDATED: 'Post updated successfully',
  POST_DELETED: 'Post deleted successfully',
  USER_JOINED: 'User joined group successfully',
  USER_LEFT: 'User left group successfully'
} as const

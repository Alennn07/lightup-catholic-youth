// Custom hook for Youth Groups API calls with comprehensive error handling
import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'
import { createSuccessResponse, createErrorResponse, ApiResponse } from '@/lib/api-response'

interface ApiCallOptions {
  showSuccessToast?: boolean
  showErrorToast?: boolean
  successMessage?: string
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  retryCount?: number
  retryDelay?: number
}

interface ApiState {
  loading: boolean
  error: string | null
  data: any
  retryCount: number
}

export function useYouthGroupsApi() {
  const { toast } = useToast()
  const { getAccessToken } = useAuth()
  const [apiState, setApiState] = useState<ApiState>({
    loading: false,
    error: null,
    data: null,
    retryCount: 0
  })

  const makeApiCall = useCallback(async <T = any>(
    url: string,
    options: RequestInit = {},
    apiOptions: ApiCallOptions = {}
  ): Promise<ApiResponse<T> | null> => {
    const {
      showSuccessToast = false,
      showErrorToast = true,
      successMessage,
      onSuccess,
      onError,
      retryCount = 0,
      retryDelay = 1000
    } = apiOptions

    setApiState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const token = await getAccessToken()
      if (!token) {
        throw new Error('No authentication token available')
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      setApiState(prev => ({ 
        ...prev, 
        loading: false, 
        error: null, 
        data: data.data,
        retryCount: 0
      }))

      if (showSuccessToast && successMessage) {
        toast({
          title: "Success",
          description: successMessage,
          variant: "default"
        })
      }

      if (onSuccess) {
        onSuccess(data.data)
      }

      return data

    } catch (error: any) {
      console.error('🚨 Youth Groups API Error:', error)
      
      const errorMessage = error.message || 'An unexpected error occurred'
      
      setApiState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage,
        retryCount: prev.retryCount + 1
      }))

      if (showErrorToast) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        })
      }

      if (onError) {
        onError(error)
      }

      // Retry logic for transient errors
      if (retryCount > 0 && apiState.retryCount < retryCount) {
        console.log(`🔄 Retrying API call (${apiState.retryCount + 1}/${retryCount})`)
        
        setTimeout(() => {
          makeApiCall(url, options, { ...apiOptions, retryCount: retryCount - 1 })
        }, retryDelay)
      }

      return null
    }
  }, [getAccessToken, toast, apiState.retryCount])

  // Specific API methods for Youth Groups
  const fetchGroups = useCallback(async (filters?: any) => {
    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value))
        }
      })
    }
    
    const url = `/api/youth-groups${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return makeApiCall(url, { method: 'GET' })
  }, [makeApiCall])

  const fetchGroup = useCallback(async (groupId: string) => {
    return makeApiCall(`/api/youth-groups/${groupId}`, { method: 'GET' })
  }, [makeApiCall])

  const createGroup = useCallback(async (groupData: any) => {
    return makeApiCall('/api/youth-groups', {
      method: 'POST',
      body: JSON.stringify(groupData)
    }, {
      showSuccessToast: true,
      successMessage: 'Group created successfully!',
      onSuccess: () => {
        // Refresh groups list
        fetchGroups()
      }
    })
  }, [makeApiCall, fetchGroups])

  const updateGroup = useCallback(async (groupId: string, groupData: any) => {
    return makeApiCall(`/api/youth-groups/${groupId}`, {
      method: 'PUT',
      body: JSON.stringify(groupData)
    }, {
      showSuccessToast: true,
      successMessage: 'Group updated successfully!'
    })
  }, [makeApiCall])

  const deleteGroup = useCallback(async (groupId: string) => {
    return makeApiCall(`/api/youth-groups/${groupId}`, {
      method: 'DELETE'
    }, {
      showSuccessToast: true,
      successMessage: 'Group deleted successfully!'
    })
  }, [makeApiCall])

  const joinGroup = useCallback(async (groupId: string, message?: string) => {
    return makeApiCall(`/api/youth-groups/${groupId}/join`, {
      method: 'POST',
      body: JSON.stringify({ message })
    }, {
      showSuccessToast: true,
      successMessage: 'Join request sent successfully!'
    })
  }, [makeApiCall])

  const leaveGroup = useCallback(async (groupId: string) => {
    return makeApiCall(`/api/youth-groups/${groupId}/leave`, {
      method: 'POST'
    }, {
      showSuccessToast: true,
      successMessage: 'You have left the group'
    })
  }, [makeApiCall])

  const fetchGroupMembers = useCallback(async (groupId: string) => {
    return makeApiCall(`/api/youth-groups/${groupId}/members`, { method: 'GET' })
  }, [makeApiCall])

  const addGroupMember = useCallback(async (groupId: string, email: string) => {
    return makeApiCall(`/api/youth-groups/${groupId}/members`, {
      method: 'POST',
      body: JSON.stringify({ email })
    }, {
      showSuccessToast: true,
      successMessage: 'Member added successfully!'
    })
  }, [makeApiCall])

  const removeGroupMember = useCallback(async (groupId: string, userId: string) => {
    return makeApiCall(`/api/youth-groups/${groupId}/members/${userId}`, {
      method: 'DELETE'
    }, {
      showSuccessToast: true,
      successMessage: 'Member removed successfully!'
    })
  }, [makeApiCall])

  const updateMemberRole = useCallback(async (groupId: string, userId: string, role: string) => {
    return makeApiCall(`/api/youth-groups/${groupId}/members/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    }, {
      showSuccessToast: true,
      successMessage: 'Member role updated successfully!'
    })
  }, [makeApiCall])

  const fetchGroupEvents = useCallback(async (groupId: string) => {
    return makeApiCall(`/api/youth-groups/${groupId}/events`, { method: 'GET' })
  }, [makeApiCall])

  const createGroupEvent = useCallback(async (groupId: string, eventData: any) => {
    return makeApiCall(`/api/youth-groups/${groupId}/events`, {
      method: 'POST',
      body: JSON.stringify(eventData)
    }, {
      showSuccessToast: true,
      successMessage: 'Event created successfully!'
    })
  }, [makeApiCall])

  const updateGroupEvent = useCallback(async (groupId: string, eventId: string, eventData: any) => {
    return makeApiCall(`/api/youth-groups/${groupId}/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData)
    }, {
      showSuccessToast: true,
      successMessage: 'Event updated successfully!'
    })
  }, [makeApiCall])

  const deleteGroupEvent = useCallback(async (groupId: string, eventId: string) => {
    return makeApiCall(`/api/youth-groups/${groupId}/events/${eventId}`, {
      method: 'DELETE'
    }, {
      showSuccessToast: true,
      successMessage: 'Event deleted successfully!'
    })
  }, [makeApiCall])

  const fetchGroupPosts = useCallback(async (groupId: string) => {
    return makeApiCall(`/api/youth-groups/${groupId}/posts`, { method: 'GET' })
  }, [makeApiCall])

  const createGroupPost = useCallback(async (groupId: string, postData: any) => {
    return makeApiCall(`/api/youth-groups/${groupId}/posts`, {
      method: 'POST',
      body: JSON.stringify(postData)
    }, {
      showSuccessToast: true,
      successMessage: 'Post created successfully!'
    })
  }, [makeApiCall])

  const updateGroupPost = useCallback(async (groupId: string, postId: string, postData: any) => {
    return makeApiCall(`/api/youth-groups/${groupId}/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(postData)
    }, {
      showSuccessToast: true,
      successMessage: 'Post updated successfully!'
    })
  }, [makeApiCall])

  const deleteGroupPost = useCallback(async (groupId: string, postId: string) => {
    return makeApiCall(`/api/youth-groups/${groupId}/posts/${postId}`, {
      method: 'DELETE'
    }, {
      showSuccessToast: true,
      successMessage: 'Post deleted successfully!'
    })
  }, [makeApiCall])

  const clearError = useCallback(() => {
    setApiState(prev => ({ ...prev, error: null, retryCount: 0 }))
  }, [])

  const reset = useCallback(() => {
    setApiState({
      loading: false,
      error: null,
      data: null,
      retryCount: 0
    })
  }, [])

  return {
    ...apiState,
    makeApiCall,
    fetchGroups,
    fetchGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    joinGroup,
    leaveGroup,
    fetchGroupMembers,
    addGroupMember,
    removeGroupMember,
    updateMemberRole,
    fetchGroupEvents,
    createGroupEvent,
    updateGroupEvent,
    deleteGroupEvent,
    fetchGroupPosts,
    createGroupPost,
    updateGroupPost,
    deleteGroupPost,
    clearError,
    reset
  }
}

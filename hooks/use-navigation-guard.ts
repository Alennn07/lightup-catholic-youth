"use client"

import { useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface NavigationGuardOptions {
  shouldBlock?: boolean
  message?: string
  onConfirm?: () => void
  onCancel?: () => void
}

interface UnsavedData {
  id: string
  type: 'prayer' | 'journal' | 'event' | 'group'
  hasUnsavedChanges: boolean
  data: any
}

export function useNavigationGuard() {
  const router = useRouter()
  const { toast } = useToast()
  const unsavedDataRef = useRef<Map<string, UnsavedData>>(new Map())
  const isNavigatingRef = useRef(false)

  // Register unsaved data
  const registerUnsavedData = useCallback((id: string, type: UnsavedData['type'], data: any) => {
    unsavedDataRef.current.set(id, {
      id,
      type,
      hasUnsavedChanges: true,
      data
    })
  }, [])

  // Clear unsaved data
  const clearUnsavedData = useCallback((id: string) => {
    unsavedDataRef.current.delete(id)
  }, [])

  // Check if there's any unsaved data
  const hasUnsavedData = useCallback(() => {
    return Array.from(unsavedDataRef.current.values()).some(item => item.hasUnsavedChanges)
  }, [])

  // Get unsaved data for specific type
  const getUnsavedDataByType = useCallback((type: UnsavedData['type']) => {
    return Array.from(unsavedDataRef.current.values()).filter(item => item.type === type)
  }, [])

  // Safe navigation with confirmation
  const safeNavigate = useCallback(async (href: string, options?: NavigationGuardOptions) => {
    if (isNavigatingRef.current) return

    const hasUnsaved = hasUnsavedData()
    const shouldBlock = options?.shouldBlock ?? hasUnsaved

    if (shouldBlock && hasUnsaved) {
      const unsavedItems = Array.from(unsavedDataRef.current.values())
      const message = options?.message || 
        `You have unsaved changes in ${unsavedItems.map(item => item.type).join(', ')}. Are you sure you want to leave?`

      // Show confirmation dialog
      const confirmed = window.confirm(message)
      
      if (!confirmed) {
        options?.onCancel?.()
        return false
      }

      // Clear unsaved data if confirmed
      unsavedDataRef.current.clear()
      options?.onConfirm?.()
    }

    isNavigatingRef.current = true
    router.push(href)
    return true
  }, [router, hasUnsavedData])

  // Safe back navigation
  const safeGoBack = useCallback(async (fallbackHref: string = '/') => {
    if (isNavigatingRef.current) return

    const hasUnsaved = hasUnsavedData()
    
    if (hasUnsaved) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to go back?')
      if (!confirmed) return false
      unsavedDataRef.current.clear()
    }

    isNavigatingRef.current = true
    
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackHref)
    }
    return true
  }, [router, hasUnsavedData])

  // Handle browser back/forward buttons
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedData()) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return e.returnValue
      }
    }

    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedData()) {
        const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?')
        if (!confirmed) {
          // Push current state back to prevent navigation
          window.history.pushState(null, '', window.location.href)
          return
        }
        unsavedDataRef.current.clear()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [hasUnsavedData])

  // Reset navigation flag after route change
  useEffect(() => {
    const handleRouteChange = () => {
      isNavigatingRef.current = false
    }

    // Listen for route changes
    const originalPush = router.push
    const originalBack = router.back

    router.push = (...args) => {
      handleRouteChange()
      return originalPush.apply(router, args)
    }

    router.back = () => {
      handleRouteChange()
      return originalBack.apply(router)
    }

    return () => {
      router.push = originalPush
      router.back = originalBack
    }
  }, [router])

  return {
    registerUnsavedData,
    clearUnsavedData,
    hasUnsavedData,
    getUnsavedDataByType,
    safeNavigate,
    safeGoBack
  }
}

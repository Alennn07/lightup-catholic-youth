"use client"

import { useCallback, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

interface NavigationHistory {
  path: string
  timestamp: number
  scrollPosition: number
}

interface SmartNavigationOptions {
  fallbackPath?: string
  warnOnUnsavedChanges?: boolean
  restoreScroll?: boolean
}

export function useSmartNavigation(options: SmartNavigationOptions = {}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const historyRef = useRef<NavigationHistory[]>([])
  const scrollPositionsRef = useRef<Map<string, number>>(new Map())
  const unsavedChangesRef = useRef<Set<string>>(new Set())

  const {
    fallbackPath = '/',
    warnOnUnsavedChanges = true,
    restoreScroll = true
  } = options

  // Track navigation history
  useEffect(() => {
    const currentTime = Date.now()
    const scrollPosition = window.scrollY

    // Add current page to history
    historyRef.current.push({
      path: pathname,
      timestamp: currentTime,
      scrollPosition
    })

    // Store scroll position
    scrollPositionsRef.current.set(pathname, scrollPosition)

    // Clean up old history (keep last 10 entries)
    if (historyRef.current.length > 10) {
      historyRef.current = historyRef.current.slice(-10)
    }
  }, [pathname])

  // Register unsaved changes
  const registerUnsavedChanges = useCallback((key: string) => {
    unsavedChangesRef.current.add(key)
  }, [])

  // Clear unsaved changes
  const clearUnsavedChanges = useCallback((key: string) => {
    unsavedChangesRef.current.delete(key)
  }, [])

  // Check if there are unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    return unsavedChangesRef.current.size > 0
  }, [])

  // Smart back navigation
  const smartBack = useCallback(async () => {
    // Check for unsaved changes
    if (warnOnUnsavedChanges && hasUnsavedChanges()) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      )
      if (!confirmed) return false
    }

    // Get previous page from history
    const history = historyRef.current
    if (history.length < 2) {
      // No history, go to fallback
      router.push(fallbackPath)
      return true
    }

    // Get the previous page (second to last entry)
    const previousPage = history[history.length - 2]
    const currentPage = history[history.length - 1]

    // Don't go back to the same page
    if (previousPage.path === currentPage.path) {
      if (history.length >= 3) {
        const earlierPage = history[history.length - 3]
        router.push(earlierPage.path)
      } else {
        router.push(fallbackPath)
      }
    } else {
      router.push(previousPage.path)
    }

    return true
  }, [router, fallbackPath, warnOnUnsavedChanges, hasUnsavedChanges])

  // Navigate to specific page with history tracking
  const navigateTo = useCallback(async (path: string) => {
    // Check for unsaved changes
    if (warnOnUnsavedChanges && hasUnsavedChanges()) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      )
      if (!confirmed) return false
    }

    router.push(path)
    return true
  }, [router, warnOnUnsavedChanges, hasUnsavedChanges])

  // Get appropriate back path based on current page
  const getBackPath = useCallback(() => {
    const history = historyRef.current
    if (history.length < 2) return fallbackPath

    const previousPage = history[history.length - 2]
    return previousPage.path
  }, [fallbackPath])

  // Get back button label based on previous page
  const getBackLabel = useCallback(() => {
    const backPath = getBackPath()
    
    // Map paths to user-friendly labels
    const pathLabels: Record<string, string> = {
      '/': 'Home',
      '/dashboard': 'Dashboard',
      '/features': 'Features',
      '/community': 'Community',
      '/prayer-wall': 'Prayer Wall',
      '/faith-journal': 'Faith Journal',
      '/youth-groups': 'Youth Groups',
      '/faithbot': 'FaithBot AI',
      '/faith-quiz': 'Faith Quiz',
      '/daily-bible-verse': 'Daily Bible Verse',
      '/liturgical-calendar': 'Liturgical Calendar',
      '/profile': 'Profile',
      '/settings': 'Settings',
      '/support': 'Support',
      '/search': 'Search',
      '/about': 'About'
    }

    return pathLabels[backPath] || 'Back'
  }, [getBackPath])

  // Restore scroll position
  const restoreScrollPosition = useCallback((path: string) => {
    if (!restoreScroll) return

    const savedPosition = scrollPositionsRef.current.get(path)
    if (savedPosition !== undefined) {
      window.scrollTo({ top: savedPosition, behavior: 'smooth' })
    }
  }, [restoreScroll])

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      // Restore scroll position for the current page
      setTimeout(() => {
        restoreScrollPosition(pathname)
      }, 100)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [pathname, restoreScrollPosition])

  // Handle beforeunload for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges()) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  return {
    smartBack,
    navigateTo,
    getBackPath,
    getBackLabel,
    registerUnsavedChanges,
    clearUnsavedChanges,
    hasUnsavedChanges,
    restoreScrollPosition
  }
}

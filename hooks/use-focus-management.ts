"use client"

import { useCallback, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface FocusManagementOptions {
  skipToContent?: boolean
  announcePageChange?: boolean
  focusOnNavigation?: boolean
}

export function useFocusManagement(options: FocusManagementOptions = {}) {
  const pathname = usePathname()
  const previousPathname = useRef<string | null>(null)
  const skipLinkRef = useRef<HTMLAnchorElement>(null)
  const mainContentRef = useRef<HTMLElement>(null)
  const lastFocusedElement = useRef<HTMLElement | null>(null)

  const {
    skipToContent = true,
    announcePageChange = true,
    focusOnNavigation = true
  } = options

  // Announce page changes to screen readers
  const announcePageChange = useCallback((newPath: string) => {
    if (!announcePageChange) return

    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = `Navigated to ${newPath.replace('/', '').replace('-', ' ') || 'home page'}`
    
    document.body.appendChild(announcement)
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }, [announcePageChange])

  // Focus management for navigation
  const focusOnNavigation = useCallback(() => {
    if (!focusOnNavigation) return

    // Try to focus skip link first
    if (skipToContent && skipLinkRef.current) {
      skipLinkRef.current.focus()
      return
    }

    // Focus main content
    if (mainContentRef.current) {
      mainContentRef.current.focus()
      return
    }

    // Fallback to first focusable element
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus()
    }
  }, [focusOnNavigation, skipToContent])

  // Handle focus restoration
  const restoreFocus = useCallback(() => {
    if (lastFocusedElement.current && document.contains(lastFocusedElement.current)) {
      lastFocusedElement.current.focus()
    } else {
      focusOnNavigation()
    }
  }, [focusOnNavigation])

  // Save current focus
  const saveFocus = useCallback(() => {
    lastFocusedElement.current = document.activeElement as HTMLElement
  }, [])

  // Skip to content functionality
  const skipToContent = useCallback(() => {
    if (mainContentRef.current) {
      mainContentRef.current.focus()
      mainContentRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  // Handle pathname changes
  useEffect(() => {
    if (previousPathname.current && previousPathname.current !== pathname) {
      announcePageChange(pathname)
      
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        focusOnNavigation()
      }, 100)
    }
    
    previousPathname.current = pathname
  }, [pathname, announcePageChange, focusOnNavigation])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip to content with Alt + S
      if (e.altKey && e.key === 's') {
        e.preventDefault()
        skipToContent()
      }
      
      // Focus management with Tab
      if (e.key === 'Tab') {
        // Ensure focus is visible
        const focusedElement = document.activeElement as HTMLElement
        if (focusedElement && focusedElement.style.outline === 'none') {
          focusedElement.style.outline = '2px solid #3b82f6'
          focusedElement.style.outlineOffset = '2px'
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [skipToContent])

  // Clean up focus styles on blur
  useEffect(() => {
    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target && target.style.outline.includes('3b82f6')) {
        target.style.outline = 'none'
        target.style.outlineOffset = '0'
      }
    }

    document.addEventListener('focusout', handleFocusOut)
    return () => document.removeEventListener('focusout', handleFocusOut)
  }, [])

  return {
    skipLinkRef,
    mainContentRef,
    focusOnNavigation,
    restoreFocus,
    saveFocus,
    skipToContent
  }
}

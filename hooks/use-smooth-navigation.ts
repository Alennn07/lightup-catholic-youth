"use client"

import { useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

interface SmoothNavigationOptions {
  duration?: number
  easing?: string
  scrollToTop?: boolean
  preserveScroll?: boolean
}

export function useSmoothNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const scrollPositions = useRef<Map<string, number>>(new Map())
  const isNavigating = useRef(false)

  // Store current scroll position
  const saveScrollPosition = useCallback((path: string) => {
    scrollPositions.current.set(path, window.scrollY)
  }, [])

  // Restore scroll position
  const restoreScrollPosition = useCallback((path: string) => {
    const savedPosition = scrollPositions.current.get(path)
    if (savedPosition !== undefined) {
      window.scrollTo({ top: savedPosition, behavior: 'smooth' })
    }
  }, [])

  // Smooth navigation with transitions
  const smoothNavigate = useCallback(async (
    href: string, 
    options: SmoothNavigationOptions = {}
  ) => {
    if (isNavigating.current) return

    const {
      duration = 300,
      easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
      scrollToTop = true,
      preserveScroll = false
    } = options

    isNavigating.current = true

    // Save current scroll position
    if (preserveScroll) {
      saveScrollPosition(pathname)
    }

    // Create transition overlay
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      z-index: 9999;
      opacity: 0;
      transition: opacity ${duration}ms ${easing};
      pointer-events: none;
    `
    document.body.appendChild(overlay)

    // Fade out
    await new Promise(resolve => {
      overlay.style.opacity = '1'
      setTimeout(resolve, duration / 2)
    })

    // Navigate
    router.push(href)

    // Wait for navigation to complete
    await new Promise(resolve => setTimeout(resolve, 100))

    // Fade in
    await new Promise(resolve => {
      overlay.style.opacity = '0'
      setTimeout(() => {
        document.body.removeChild(overlay)
        resolve(void 0)
      }, duration / 2)
    })

    // Handle scroll
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (preserveScroll) {
      // Restore scroll position after a short delay
      setTimeout(() => restoreScrollPosition(href), 100)
    }

    isNavigating.current = false
  }, [router, pathname, saveScrollPosition, restoreScrollPosition])

  // Page transition effect
  const pageTransition = useCallback((element: HTMLElement, direction: 'in' | 'out' = 'in') => {
    const duration = 300
    const easing = 'cubic-bezier(0.4, 0, 0.2, 1)'

    if (direction === 'out') {
      element.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`
      element.style.opacity = '0'
      element.style.transform = 'translateY(20px)'
    } else {
      element.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`
      element.style.opacity = '1'
      element.style.transform = 'translateY(0)'
    }
  }, [])

  // Scroll restoration on page load
  useEffect(() => {
    const handleLoad = () => {
      // Restore scroll position if available
      const savedPosition = scrollPositions.current.get(pathname)
      if (savedPosition !== undefined) {
        window.scrollTo({ top: savedPosition, behavior: 'auto' })
      }
    }

    window.addEventListener('load', handleLoad)
    return () => window.removeEventListener('load', handleLoad)
  }, [pathname])

  // Clean up scroll positions on unmount
  useEffect(() => {
    return () => {
      scrollPositions.current.clear()
    }
  }, [])

  return {
    smoothNavigate,
    pageTransition,
    saveScrollPosition,
    restoreScrollPosition,
    isNavigating: isNavigating.current
  }
}

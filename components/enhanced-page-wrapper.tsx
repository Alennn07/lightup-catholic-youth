"use client"

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useFocusManagement } from '@/hooks/use-focus-management'
import { useSmoothNavigation } from '@/hooks/use-smooth-navigation'
import { RouteGuard } from './route-guard'
import { SkipLink } from './skip-link'

interface EnhancedPageWrapperProps {
  children: React.ReactNode
  requireAuth?: boolean
  fallbackPath?: string
  unsavedDataTypes?: string[]
  className?: string
  enableTransitions?: boolean
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3
}

export function EnhancedPageWrapper({
  children,
  requireAuth = false,
  fallbackPath = '/auth/sign-in',
  unsavedDataTypes = [],
  className = '',
  enableTransitions = true
}: EnhancedPageWrapperProps) {
  const pathname = usePathname()
  const { mainContentRef, focusOnNavigation } = useFocusManagement()
  const { pageTransition: smoothTransition } = useSmoothNavigation()
  const pageRef = useRef<HTMLDivElement>(null)

  // Focus management on route change
  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      focusOnNavigation()
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname, focusOnNavigation])

  // Apply page transition effect
  useEffect(() => {
    if (pageRef.current && enableTransitions) {
      smoothTransition(pageRef.current, 'in')
    }
  }, [pathname, enableTransitions, smoothTransition])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key to close modals/overlays
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('[role="dialog"]')
        if (activeModal) {
          const closeButton = activeModal.querySelector('[aria-label="Close"]')
          if (closeButton) {
            (closeButton as HTMLElement).click()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const content = (
    <motion.div
      ref={pageRef}
      initial={enableTransitions ? "initial" : false}
      animate="in"
      exit="out"
      variants={enableTransitions ? pageVariants : undefined}
      transition={enableTransitions ? pageTransition : undefined}
      className={`min-h-screen ${className}`}
      role="main"
      aria-label="Main content"
    >
      {children}
    </motion.div>
  )

  if (requireAuth || unsavedDataTypes.length > 0) {
    return (
      <RouteGuard
        requireAuth={requireAuth}
        fallbackPath={fallbackPath}
        unsavedDataTypes={unsavedDataTypes}
      >
        {content}
      </RouteGuard>
    )
  }

  return content
}

// Specialized page wrappers for different use cases
export function AuthPageWrapper({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <EnhancedPageWrapper
      className={`bg-gradient-to-br from-blue-50 via-white to-purple-50 ${className}`}
      enableTransitions={true}
    >
      {children}
    </EnhancedPageWrapper>
  )
}

export function DashboardPageWrapper({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <EnhancedPageWrapper
      requireAuth={true}
      unsavedDataTypes={['prayer', 'journal', 'event']}
      className={`bg-gradient-to-br from-blue-50 via-white to-purple-50 ${className}`}
      enableTransitions={true}
    >
      {children}
    </EnhancedPageWrapper>
  )
}

export function FeaturePageWrapper({ 
  children, 
  className = '',
  unsavedDataTypes = []
}: { 
  children: React.ReactNode
  className?: string
  unsavedDataTypes?: string[]
}) {
  return (
    <EnhancedPageWrapper
      unsavedDataTypes={unsavedDataTypes}
      className={`bg-gradient-to-br from-blue-50 via-white to-purple-50 ${className}`}
      enableTransitions={true}
    >
      {children}
    </EnhancedPageWrapper>
  )
}

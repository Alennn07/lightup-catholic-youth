"use client"

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'
import { useNavigationGuard } from '@/hooks/use-navigation-guard'
import { useSmoothNavigation } from '@/hooks/use-smooth-navigation'

interface EnhancedBackButtonProps {
  fallbackHref?: string
  fallbackLabel?: string
  showHomeButton?: boolean
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function EnhancedBackButton({
  fallbackHref = '/',
  fallbackLabel = 'Home',
  showHomeButton = true,
  className = '',
  variant = 'outline',
  size = 'md'
}: EnhancedBackButtonProps) {
  const router = useRouter()
  const { safeGoBack } = useNavigationGuard()
  const { smoothNavigate } = useSmoothNavigation()

  const handleBack = useCallback(async () => {
    const success = await safeGoBack(fallbackHref)
    if (!success) {
      // If back navigation was cancelled, do nothing
      return
    }
  }, [safeGoBack, fallbackHref])

  const handleHome = useCallback(async () => {
    await smoothNavigate('/', {
      duration: 300,
      scrollToTop: true
    })
  }, [smoothNavigate])

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        onClick={handleBack}
        variant={variant}
        className={`flex items-center gap-2 ${sizeClasses[size]}`}
        aria-label="Go back to previous page"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      {showHomeButton && (
        <Button
          onClick={handleHome}
          variant="ghost"
          className={`flex items-center gap-2 ${sizeClasses[size]}`}
          aria-label={`Go to ${fallbackLabel}`}
        >
          <Home className="h-4 w-4" />
          {fallbackLabel}
        </Button>
      )}
    </div>
  )
}

// Breadcrumb component for complex navigation
interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const { smoothNavigate } = useSmoothNavigation()

  const handleNavigation = useCallback(async (href: string) => {
    await smoothNavigate(href, {
      duration: 300,
      scrollToTop: true
    })
  }, [smoothNavigate])

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <span className="mx-2 text-gray-400" aria-hidden="true">
              /
            </span>
          )}
          {item.href ? (
            <button
              onClick={() => handleNavigation(item.href!)}
              className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-900 font-medium" aria-current="page">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}

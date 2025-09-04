"use client"

import { forwardRef } from 'react'
import { useFocusManagement } from '@/hooks/use-focus-management'

interface SkipLinkProps {
  href?: string
  children?: React.ReactNode
  className?: string
}

export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ href = '#main-content', children = 'Skip to main content', className = '' }, ref) => {
    const { skipToContent } = useFocusManagement()

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      skipToContent()
    }

    return (
      <a
        ref={ref}
        href={href}
        onClick={handleClick}
        className={`
          sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
          focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white 
          focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:ring-offset-2
          ${className}
        `}
        tabIndex={0}
      >
        {children}
      </a>
    )
  }
)

SkipLink.displayName = 'SkipLink'

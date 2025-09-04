"use client"

import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'
import { useSmartNavigation } from '@/hooks/use-smart-navigation'

interface SmartBackButtonProps {
  fallbackPath?: string
  showHomeButton?: boolean
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export function SmartBackButton({
  fallbackPath,
  showHomeButton = true,
  className = '',
  variant = 'outline',
  size = 'md',
  label
}: SmartBackButtonProps) {
  const { smartBack, getBackLabel, navigateTo } = useSmartNavigation({
    fallbackPath,
    warnOnUnsavedChanges: true,
    restoreScroll: true
  })

  const handleBack = async () => {
    await smartBack()
  }

  const handleHome = async () => {
    await navigateTo('/')
  }

  const backLabel = label || getBackLabel()

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
        aria-label={`Go back to ${backLabel}`}
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Button>
      
      {showHomeButton && (
        <Button
          onClick={handleHome}
          variant="ghost"
          className={`flex items-center gap-2 ${sizeClasses[size]}`}
          aria-label="Go to home page"
        >
          <Home className="h-4 w-4" />
          Home
        </Button>
      )}
    </div>
  )
}

// Specialized back buttons for different contexts
export function DashboardBackButton({ className = '' }: { className?: string }) {
  return (
    <SmartBackButton
      fallbackPath="/"
      showHomeButton={true}
      className={className}
      label="Home"
    />
  )
}

export function FeatureBackButton({ className = '' }: { className?: string }) {
  return (
    <SmartBackButton
      fallbackPath="/features"
      showHomeButton={true}
      className={className}
      label="Features"
    />
  )
}

export function AuthBackButton({ className = '' }: { className?: string }) {
  return (
    <SmartBackButton
      fallbackPath="/"
      showHomeButton={false}
      className={className}
      label="Home"
    />
  )
}

export function SettingsBackButton({ className = '' }: { className?: string }) {
  return (
    <SmartBackButton
      fallbackPath="/dashboard"
      showHomeButton={true}
      className={className}
      label="Dashboard"
    />
  )
}

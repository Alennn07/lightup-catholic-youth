"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useNavigationGuard } from '@/hooks/use-navigation-guard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Save, X } from 'lucide-react'

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  fallbackPath?: string
  unsavedDataTypes?: string[]
}

export function RouteGuard({ 
  children, 
  requireAuth = false, 
  fallbackPath = '/auth/sign-in',
  unsavedDataTypes = []
}: RouteGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { hasUnsavedData, getUnsavedDataByType, clearUnsavedData } = useNavigationGuard()
  const [showUnsavedModal, setShowUnsavedModal] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

  // Check authentication
  useEffect(() => {
    if (requireAuth && !isLoading && !user) {
      const redirectUrl = new URL(fallbackPath, window.location.origin)
      redirectUrl.searchParams.set('redirectTo', window.location.pathname)
      router.push(redirectUrl.toString())
    }
  }, [requireAuth, isLoading, user, fallbackPath, router])

  // Handle unsaved data navigation
  const handleNavigation = (href: string) => {
    if (hasUnsavedData()) {
      setPendingNavigation(href)
      setShowUnsavedModal(true)
    } else {
      router.push(href)
    }
  }

  const handleSaveAndContinue = () => {
    // This would trigger save functionality
    // For now, we'll just clear the unsaved data
    clearUnsavedData('all')
    setShowUnsavedModal(false)
    
    if (pendingNavigation) {
      router.push(pendingNavigation)
      setPendingNavigation(null)
    }
  }

  const handleDiscardAndContinue = () => {
    clearUnsavedData('all')
    setShowUnsavedModal(false)
    
    if (pendingNavigation) {
      router.push(pendingNavigation)
      setPendingNavigation(null)
    }
  }

  const handleCancel = () => {
    setShowUnsavedModal(false)
    setPendingNavigation(null)
  }

  // Show loading state while checking auth
  if (requireAuth && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show auth required message
  if (requireAuth && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              You need to be signed in to access this page.
            </p>
            <Button 
              onClick={() => router.push(fallbackPath)}
              className="w-full"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      {children}
      
      {/* Unsaved Data Modal */}
      {showUnsavedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Unsaved Changes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                You have unsaved changes. What would you like to do?
              </p>
              
              <div className="space-y-2">
                {unsavedDataTypes.map(type => {
                  const data = getUnsavedDataByType(type as any)
                  if (data.length > 0) {
                    return (
                      <div key={type} className="text-sm text-gray-500">
                        • {data.length} unsaved {type}(s)
                      </div>
                    )
                  }
                  return null
                })}
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveAndContinue}
                  className="flex-1"
                  variant="default"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save & Continue
                </Button>
                <Button
                  onClick={handleDiscardAndContinue}
                  className="flex-1"
                  variant="outline"
                >
                  <X className="h-4 w-4 mr-2" />
                  Discard & Continue
                </Button>
              </div>
              
              <Button
                onClick={handleCancel}
                variant="ghost"
                className="w-full"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

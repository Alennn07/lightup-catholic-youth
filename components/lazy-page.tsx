"use client"

import { Suspense, lazy, ComponentType } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface LazyPageProps {
  pageName: string
  fallback?: React.ReactNode
}

// Loading skeleton component
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Error boundary component
function PageError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-4">
            <Loader2 className="h-12 w-12 mx-auto animate-spin" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Failed to Load Page</h2>
          <p className="text-gray-600 mb-4">
            There was an error loading this page. Please try again.
          </p>
          <div className="space-x-2">
            <button
              onClick={reset}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Go Back
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Lazy page wrapper with error boundary
export function LazyPage({ pageName, fallback }: LazyPageProps) {
  const router = useRouter()
  
  // Dynamically import the page component
  const LazyComponent = lazy(() => 
    import(`../app/${pageName}/page`)
      .then(module => ({ default: module.default }))
      .catch(error => {
        console.error(`Failed to load page: ${pageName}`, error)
        throw error
      })
  )

  return (
    <Suspense fallback={fallback || <PageSkeleton />}>
      <LazyComponent />
    </Suspense>
  )
}

// Preload function for critical pages
export function preloadPage(pageName: string) {
  import(`../app/${pageName}/page`)
    .then(module => {
      console.log(`Preloaded page: ${pageName}`)
    })
    .catch(error => {
      console.error(`Failed to preload page: ${pageName}`, error)
    })
}

// Route-based code splitting hook
export function useRoutePreloading() {
  const router = useRouter()
  
  const preloadRoute = (href: string) => {
    // Extract page name from href
    const pageName = href.replace('/', '') || 'index'
    
    // Preload the page
    preloadPage(pageName)
  }
  
  const preloadOnHover = (href: string) => {
    // Preload on hover with a small delay
    const timeoutId = setTimeout(() => {
      preloadRoute(href)
    }, 200)
    
    return () => clearTimeout(timeoutId)
  }
  
  return {
    preloadRoute,
    preloadOnHover
  }
}

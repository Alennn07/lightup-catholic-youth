"use client"

import { useState, useCallback, useEffect } from 'react'
import { PrayerWall } from "@/components/prayer-wall"
import { EnhancedNavigation } from "@/components/enhanced-navigation"
import { EnhancedPageWrapper } from "@/components/enhanced-page-wrapper"
import { EnhancedBackButton, Breadcrumb } from "@/components/enhanced-back-button"
import { useNavigationGuard } from '@/hooks/use-navigation-guard'
import { useURLState } from '@/hooks/use-url-state'
import { useFocusManagement } from '@/hooks/use-focus-management'
import { getBreadcrumbs } from '@/lib/routing-config'

export default function EnhancedPrayerWallPage() {
  const { registerUnsavedData, clearUnsavedData } = useNavigationGuard()
  const { mainContentRef } = useFocusManagement()
  
  // URL state management
  const [searchQuery, setSearchQuery] = useURLString('search', '')
  const [selectedCategory, setSelectedCategory] = useURLString('category', '')
  const [sortBy, setSortBy] = useURLString('sort', 'newest')
  const [showAnonymous, setShowAnonymous] = useURLBoolean('anonymous', true)
  const [currentPage, setCurrentPage] = useURLNumber('page', 1)

  // Track unsaved prayer data
  const [hasUnsavedPrayer, setHasUnsavedPrayer] = useState(false)
  const [currentPrayerId, setCurrentPrayerId] = useState<string | null>(null)

  // Register unsaved data when creating/editing prayer
  const handlePrayerEditStart = useCallback((prayerId: string, data: any) => {
    setCurrentPrayerId(prayerId)
    setHasUnsavedPrayer(true)
    registerUnsavedData(prayerId, 'prayer', data)
  }, [registerUnsavedData])

  // Clear unsaved data when saving
  const handlePrayerSave = useCallback((prayerId: string) => {
    setHasUnsavedPrayer(false)
    clearUnsavedData(prayerId)
    setCurrentPrayerId(null)
  }, [clearUnsavedData])

  // Clear unsaved data when cancelling
  const handlePrayerCancel = useCallback((prayerId: string) => {
    setHasUnsavedPrayer(false)
    clearUnsavedData(prayerId)
    setCurrentPrayerId(null)
  }, [clearUnsavedData])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (currentPrayerId) {
        clearUnsavedData(currentPrayerId)
      }
    }
  }, [currentPrayerId, clearUnsavedData])

  // Get breadcrumbs for current path
  const breadcrumbs = getBreadcrumbs('/prayer-wall')

  return (
    <EnhancedPageWrapper
      unsavedDataTypes={['prayer']}
      className="bg-gradient-to-br from-blue-50 via-white to-purple-50"
    >
      <EnhancedNavigation />
      
      <main 
        ref={mainContentRef}
        className="container mx-auto px-4 pt-24 pb-8"
        tabIndex={-1}
        aria-label="Prayer Wall"
      >
        {/* Skip link target */}
        <div id="main-content" className="sr-only" />
        
        {/* Breadcrumb Navigation */}
        <div className="mb-4">
          <Breadcrumb items={breadcrumbs} />
        </div>

        {/* Enhanced Back Button */}
        <div className="mb-6">
          <EnhancedBackButton 
            fallbackHref="/dashboard"
            fallbackLabel="Dashboard"
            showHomeButton={true}
          />
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Prayer Wall
          </h1>
          <p className="text-lg text-gray-600">
            Share your prayer requests and pray for others in your community
          </p>
        </div>

        {/* URL State Controls (Debug - remove in production) */}
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Prayer Wall Filters (Debug):</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <label className="block font-medium">Search:</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-2 py-1 border rounded"
                placeholder="Search prayers..."
              />
            </div>
            <div>
              <label className="block font-medium">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-2 py-1 border rounded"
              >
                <option value="">All Categories</option>
                <option value="health">Health</option>
                <option value="family">Family</option>
                <option value="work">Work</option>
                <option value="spiritual">Spiritual</option>
              </select>
            </div>
            <div>
              <label className="block font-medium">Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-2 py-1 border rounded"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most-prayed">Most Prayed</option>
              </select>
            </div>
            <div>
              <label className="block font-medium">Show Anonymous:</label>
              <input
                type="checkbox"
                checked={showAnonymous}
                onChange={(e) => setShowAnonymous(e.target.checked)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Prayer Wall Component */}
        <div className="space-y-6">
          <PrayerWall 
            onEditStart={handlePrayerEditStart}
            onSave={handlePrayerSave}
            onCancel={handlePrayerCancel}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            showAnonymous={showAnonymous}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Navigation State Indicators */}
        {hasUnsavedPrayer && (
          <div className="fixed bottom-4 right-4 bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Unsaved prayer</span>
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Help */}
        <div className="fixed bottom-4 left-4 bg-gray-800 text-white px-3 py-2 rounded-lg text-xs opacity-75 hover:opacity-100 transition-opacity">
          <div className="font-semibold mb-1">Keyboard Shortcuts:</div>
          <div>Alt + S: Skip to content</div>
          <div>Escape: Close modals</div>
        </div>
      </main>
    </EnhancedPageWrapper>
  )
}

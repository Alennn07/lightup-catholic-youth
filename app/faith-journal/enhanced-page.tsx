"use client"

import { useState, useEffect, useCallback } from 'react'
import { FaithJournal } from "@/components/faith-journal"
import { EnhancedNavigation } from "@/components/enhanced-navigation"
import { EnhancedPageWrapper } from "@/components/enhanced-page-wrapper"
import { EnhancedBackButton } from "@/components/enhanced-back-button"
import { useNavigationGuard } from '@/hooks/use-navigation-guard'
import { useURLState } from '@/hooks/use-url-state'
import { useFocusManagement } from '@/hooks/use-focus-management'

export default function EnhancedFaithJournalPage() {
  const { registerUnsavedData, clearUnsavedData } = useNavigationGuard()
  const { mainContentRef } = useFocusManagement()
  
  // URL state management for filters and search
  const [searchQuery, setSearchQuery] = useURLString('search', '')
  const [selectedMood, setSelectedMood] = useURLString('mood', '')
  const [sortBy, setSortBy] = useURLString('sort', 'newest')
  const [viewMode, setViewMode] = useURLString('view', 'grid')

  // Track unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null)

  // Register unsaved data when editing
  const handleEditStart = useCallback((entryId: string, data: any) => {
    setCurrentEntryId(entryId)
    setHasUnsavedChanges(true)
    registerUnsavedData(entryId, 'journal', data)
  }, [registerUnsavedData])

  // Clear unsaved data when saving
  const handleSave = useCallback((entryId: string) => {
    setHasUnsavedChanges(false)
    clearUnsavedData(entryId)
    setCurrentEntryId(null)
  }, [clearUnsavedData])

  // Clear unsaved data when cancelling
  const handleCancel = useCallback((entryId: string) => {
    setHasUnsavedChanges(false)
    clearUnsavedData(entryId)
    setCurrentEntryId(null)
  }, [clearUnsavedData])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (currentEntryId) {
        clearUnsavedData(currentEntryId)
      }
    }
  }, [currentEntryId, clearUnsavedData])

  return (
    <EnhancedPageWrapper
      unsavedDataTypes={['journal']}
      className="bg-gradient-to-br from-blue-50 via-white to-purple-50"
    >
      <EnhancedNavigation />
      
      <main 
        ref={mainContentRef}
        className="container mx-auto px-4 pt-24 pb-8"
        tabIndex={-1}
        aria-label="Faith Journal"
      >
        {/* Skip link target */}
        <div id="main-content" className="sr-only" />
        
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
            Faith Journal
          </h1>
          <p className="text-lg text-gray-600">
            Document your spiritual journey and reflections
          </p>
        </div>

        {/* URL State Debug (remove in production) */}
        <div className="mb-6 p-4 bg-gray-100 rounded-lg text-sm">
          <h3 className="font-semibold mb-2">URL State (Debug):</h3>
          <p>Search: {searchQuery}</p>
          <p>Mood: {selectedMood}</p>
          <p>Sort: {sortBy}</p>
          <p>View: {viewMode}</p>
        </div>

        {/* Enhanced Faith Journal Component */}
        <div className="space-y-6">
          <FaithJournal 
            onEditStart={handleEditStart}
            onSave={handleSave}
            onCancel={handleCancel}
            searchQuery={searchQuery}
            selectedMood={selectedMood}
            sortBy={sortBy}
            viewMode={viewMode}
          />
        </div>

        {/* Navigation State Indicator */}
        {hasUnsavedChanges && (
          <div className="fixed bottom-4 right-4 bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Unsaved changes</span>
            </div>
          </div>
        )}
      </main>
    </EnhancedPageWrapper>
  )
}

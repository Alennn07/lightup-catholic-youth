"use client"

import { useEffect, useCallback } from 'react'
import { useSmartNavigation } from '@/hooks/use-smart-navigation'

interface UnsavedDataGuardProps {
  children: React.ReactNode
  dataKey: string
  hasUnsavedChanges: boolean
  onSave?: () => void
  onDiscard?: () => void
}

export function UnsavedDataGuard({
  children,
  dataKey,
  hasUnsavedChanges,
  onSave,
  onDiscard
}: UnsavedDataGuardProps) {
  const { registerUnsavedChanges, clearUnsavedChanges } = useSmartNavigation()

  // Register/clear unsaved changes
  useEffect(() => {
    if (hasUnsavedChanges) {
      registerUnsavedChanges(dataKey)
    } else {
      clearUnsavedChanges(dataKey)
    }
  }, [hasUnsavedChanges, dataKey, registerUnsavedChanges, clearUnsavedChanges])

  // Handle save
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave()
    }
    clearUnsavedChanges(dataKey)
  }, [onSave, clearUnsavedChanges, dataKey])

  // Handle discard
  const handleDiscard = useCallback(() => {
    if (onDiscard) {
      onDiscard()
    }
    clearUnsavedChanges(dataKey)
  }, [onDiscard, clearUnsavedChanges, dataKey])

  // Expose save and discard functions to children
  const enhancedChildren = typeof children === 'function' 
    ? children({ handleSave, handleDiscard, hasUnsavedChanges })
    : children

  return <>{enhancedChildren}</>
}

// Hook for managing unsaved data in forms
export function useUnsavedData(dataKey: string) {
  const { registerUnsavedChanges, clearUnsavedChanges, hasUnsavedChanges } = useSmartNavigation()

  const markAsUnsaved = useCallback(() => {
    registerUnsavedChanges(dataKey)
  }, [dataKey, registerUnsavedChanges])

  const markAsSaved = useCallback(() => {
    clearUnsavedChanges(dataKey)
  }, [dataKey, clearUnsavedChanges])

  return {
    markAsUnsaved,
    markAsSaved,
    hasUnsavedChanges: hasUnsavedChanges()
  }
}

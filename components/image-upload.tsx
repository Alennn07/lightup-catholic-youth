'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  onUpload: (url: string) => void
  onError?: (error: string) => void
  type?: 'avatar' | 'image'
  context?: string
  maxFiles?: number
  className?: string
  disabled?: boolean
  accept?: string
  placeholder?: string
}

interface UploadState {
  isUploading: boolean
  progress: number
  error: string | null
  success: boolean
}

export function ImageUpload({
  onUpload,
  onError,
  type = 'image',
  context,
  maxFiles = 1,
  className,
  disabled = false,
  accept = 'image/*',
  placeholder = 'Click to upload or drag and drop'
}: ImageUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false
  })
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(async (files: FileList) => {
    if (disabled) return

    const fileArray = Array.from(files)
    if (fileArray.length > maxFiles) {
      const error = `Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`
      setUploadState(prev => ({ ...prev, error }))
      onError?.(error)
      return
    }

    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
      success: false
    })

    try {
      const endpoint = type === 'avatar' ? '/api/upload/avatar' : '/api/upload/images'
      
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i]
        const formData = new FormData()
        formData.append('file', file)
        
        if (context && type === 'image') {
          formData.append('context', context)
        }

        // Get auth token
        const { data: { session } } = await import('@/lib/supabase').then(m => m.supabase.auth.getSession())
        if (!session?.access_token) {
          throw new Error('Not authenticated')
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          },
          body: formData
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Upload failed')
        }

        // Update progress
        const progress = Math.round(((i + 1) / fileArray.length) * 100)
        setUploadState(prev => ({ ...prev, progress }))

        // Call success callback
        onUpload(result.url)
      }

      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        success: true,
        progress: 100
      }))

      // Reset success state after 2 seconds
      setTimeout(() => {
        setUploadState(prev => ({ ...prev, success: false, progress: 0 }))
      }, 2000)

    } catch (error: any) {
      const errorMessage = error.message || 'Upload failed'
      setUploadState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        success: false
      })
      onError?.(errorMessage)
    }
  }, [type, context, maxFiles, disabled, onUpload, onError])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled) return
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleUpload(files)
    }
  }, [handleUpload, disabled])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleUpload(files)
    }
  }, [handleUpload])

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }, [disabled])

  const clearError = useCallback(() => {
    setUploadState(prev => ({ ...prev, error: null }))
  }, [])

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
          'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20',
          dragActive && 'border-primary bg-primary/5',
          disabled && 'opacity-50 cursor-not-allowed',
          uploadState.error && 'border-destructive',
          uploadState.success && 'border-green-500 bg-green-50'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center justify-center text-center">
          {uploadState.isUploading ? (
            <>
              <div className="w-12 h-12 mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Uploading...</p>
              <Progress value={uploadState.progress} className="w-full max-w-xs" />
            </>
          ) : uploadState.success ? (
            <>
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <p className="text-sm text-green-600 font-medium">Upload successful!</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 mb-4 text-muted-foreground">
                {type === 'avatar' ? (
                  <ImageIcon className="w-full h-full" />
                ) : (
                  <Upload className="w-full h-full" />
                )}
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                {placeholder}
              </p>
              <p className="text-xs text-muted-foreground">
                {type === 'avatar' ? 'PNG, JPG, WEBP up to 5MB' : 'PNG, JPG, WEBP up to 10MB'}
                {maxFiles > 1 && ` • Max ${maxFiles} files`}
              </p>
            </>
          )}
        </div>
      </div>

      {uploadState.error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{uploadState.error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="h-auto p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

// Specialized avatar upload component
export function AvatarUpload({ 
  onUpload, 
  onError, 
  className,
  disabled = false 
}: {
  onUpload: (url: string) => void
  onError?: (error: string) => void
  className?: string
  disabled?: boolean
}) {
  return (
    <ImageUpload
      type="avatar"
      onUpload={onUpload}
      onError={onError}
      className={className}
      disabled={disabled}
      placeholder="Upload profile picture"
      maxFiles={1}
    />
  )
}

// Specialized prayer wall image upload component
export function PrayerWallImageUpload({ 
  onUpload, 
  onError, 
  className,
  disabled = false 
}: {
  onUpload: (url: string) => void
  onError?: (error: string) => void
  className?: string
  disabled?: boolean
}) {
  return (
    <ImageUpload
      type="image"
      context="prayer-wall"
      onUpload={onUpload}
      onError={onError}
      className={className}
      disabled={disabled}
      placeholder="Upload prayer image"
      maxFiles={1}
    />
  )
}

// Specialized journal image upload component
export function JournalImageUpload({ 
  onUpload, 
  onError, 
  className,
  disabled = false 
}: {
  onUpload: (url: string) => void
  onError?: (error: string) => void
  className?: string
  disabled?: boolean
}) {
  return (
    <ImageUpload
      type="image"
      context="journal"
      onUpload={onUpload}
      onError={onError}
      className={className}
      disabled={disabled}
      placeholder="Upload journal image"
      maxFiles={3}
    />
  )
}

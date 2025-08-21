import { useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/auth-context'

interface ActivityData {
  [key: string]: any
}

export function useAnalytics() {
  const { user } = useAuth()
  const lastTrackTime = useRef<{ [key: string]: number }>({})

  const trackActivity = async (activityType: string, activityData: any = {}) => {
    if (Date.now() - (lastTrackTime.current[activityType] || 0) < 1000) {
      return // Rate limiting: same activity type can only be tracked once per second
    }
    
    try {
      lastTrackTime.current[activityType] = Date.now()
      
      // Add timeout to prevent hanging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 second timeout
      
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activity_type: activityType,
          activity_data: activityData,
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error('Failed to track activity')
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error tracking activity:', error)
      }
      // Continue without analytics if there's an error
    }
  }

  const trackFeatureUsage = useCallback((featureId: string, featureName: string) => {
    trackActivity('feature_used', { featureName }, featureId)
  }, [trackActivity])

  const trackFeatureRating = useCallback((featureId: string, rating: number, feedback?: string) => {
    trackActivity('feature_rated', { rating, feedback }, featureId)
  }, [trackActivity])

  const trackFeatureFeedback = useCallback((featureId: string, feedback: string, rating?: number) => {
    trackActivity('feature_feedback', { feedback, rating }, featureId)
  }, [trackActivity])

  const trackPageView = useCallback((pagePath: string, pageTitle?: string) => {
    trackActivity('page_view', { pagePath, pageTitle })
  }, [trackActivity])

  const trackUserAction = useCallback((action: string, details?: ActivityData) => {
    trackActivity('user_action', { action, ...details })
  }, [trackActivity])

  const trackError = useCallback((error: string, context?: ActivityData) => {
    trackActivity('error', { error, context })
  }, [trackActivity])

  const trackConversion = useCallback((conversionType: string, details?: ActivityData) => {
    trackActivity('conversion', { conversionType, ...details })
  }, [trackActivity])

  return {
    trackActivity,
    trackFeatureUsage,
    trackFeatureRating,
    trackFeatureFeedback,
    trackPageView,
    trackUserAction,
    trackError,
    trackConversion,
  }
}

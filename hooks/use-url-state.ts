"use client"

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface URLStateOptions {
  replace?: boolean
  shallow?: boolean
}

export function useURLState<T = any>(
  key: string,
  defaultValue: T,
  options: URLStateOptions = {}
) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [state, setState] = useState<T>(() => {
    const value = searchParams.get(key)
    if (value === null) return defaultValue
    
    try {
      return JSON.parse(decodeURIComponent(value))
    } catch {
      return defaultValue
    }
  })

  const updateState = useCallback((newState: T | ((prev: T) => T)) => {
    const value = typeof newState === 'function' ? (newState as Function)(state) : newState
    
    setState(value)
    
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === defaultValue || value === null || value === undefined) {
      params.delete(key)
    } else {
      params.set(key, encodeURIComponent(JSON.stringify(value)))
    }
    
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`
    
    if (options.replace) {
      router.replace(newUrl, { scroll: false })
    } else {
      router.push(newUrl, { scroll: false })
    }
  }, [key, defaultValue, searchParams, router, state, options])

  // Sync with URL changes
  useEffect(() => {
    const value = searchParams.get(key)
    if (value === null) {
      if (state !== defaultValue) {
        setState(defaultValue)
      }
    } else {
      try {
        const parsedValue = JSON.parse(decodeURIComponent(value))
        if (JSON.stringify(parsedValue) !== JSON.stringify(state)) {
          setState(parsedValue)
        }
      } catch {
        // Invalid JSON, keep current state
      }
    }
  }, [searchParams, key, state, defaultValue])

  return [state, updateState] as const
}

// Specialized hooks for common use cases
export function useURLString(key: string, defaultValue: string = '') {
  return useURLState(key, defaultValue)
}

export function useURLNumber(key: string, defaultValue: number = 0) {
  return useURLState(key, defaultValue)
}

export function useURLBoolean(key: string, defaultValue: boolean = false) {
  return useURLState(key, defaultValue)
}

export function useURLArray<T = any>(key: string, defaultValue: T[] = []) {
  return useURLState<T[]>(key, defaultValue)
}

export function useURLObject<T = Record<string, any>>(key: string, defaultValue: T = {} as T) {
  return useURLState<T>(key, defaultValue)
}

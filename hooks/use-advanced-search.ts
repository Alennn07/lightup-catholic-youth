// Advanced Search Hook for Youth Groups
// Provides full-text search with filters and sorting

import { useState, useCallback, useMemo } from 'react'
import { YouthGroup, GroupEvent, GroupPost } from '@/types/youth-groups'

export interface SearchFilters {
  query: string
  category: 'all' | 'my_groups' | 'public' | 'private'
  ageRange: string
  location: string
  groupType: string
  sortBy: 'name' | 'created_at' | 'member_count' | 'relevance'
  sortOrder: 'asc' | 'desc'
  hasEvents: boolean
  hasPosts: boolean
  isActive: boolean
  maxMembers: number
  minMembers: number
}

export interface SearchResult {
  groups: YouthGroup[]
  events: GroupEvent[]
  posts: GroupPost[]
  totalResults: number
  searchTime: number
  suggestions: string[]
}

const defaultFilters: SearchFilters = {
  query: '',
  category: 'all',
  ageRange: '',
  location: '',
  groupType: '',
  sortBy: 'relevance',
  sortOrder: 'desc',
  hasEvents: false,
  hasPosts: false,
  isActive: true,
  maxMembers: 1000,
  minMembers: 0
}

export function useAdvancedSearch() {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters)
  const [isSearching, setIsSearching] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  // Update a single filter
  const updateFilter = useCallback(<K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  // Update multiple filters at once
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Reset all filters to default
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  // Add search query to history
  const addToHistory = useCallback((query: string) => {
    if (query.trim() && !searchHistory.includes(query.trim())) {
      setSearchHistory(prev => [query.trim(), ...prev].slice(0, 10)) // Keep last 10 searches
    }
  }, [searchHistory])

  // Clear search history
  const clearHistory = useCallback(() => {
    setSearchHistory([])
  }, [])

  // Generate search suggestions based on query
  const getSuggestions = useCallback((query: string, groups: YouthGroup[]): string[] => {
    if (!query.trim()) return []

    const suggestions: string[] = []
    const queryLower = query.toLowerCase()

    // Extract unique values from groups for suggestions
    const names = groups.map(g => g.name).filter(Boolean)
    const parishes = groups.map(g => g.parish).filter(Boolean)
    const cities = groups.map(g => g.city).filter(Boolean)
    const states = groups.map(g => g.state).filter(Boolean)
    const countries = groups.map(g => g.country).filter(Boolean)
    const ageRanges = groups.map(g => g.age_range).filter(Boolean)

    const allValues = [...names, ...parishes, ...cities, ...states, ...countries, ...ageRanges]

    // Find matching suggestions
    allValues.forEach(value => {
      if (value.toLowerCase().includes(queryLower) && !suggestions.includes(value)) {
        suggestions.push(value)
      }
    })

    return suggestions.slice(0, 5) // Return top 5 suggestions
  }, [])

  // Advanced search function
  const search = useCallback(async (
    groups: YouthGroup[],
    events: GroupEvent[] = [],
    posts: GroupPost[] = []
  ): Promise<SearchResult> => {
    const startTime = Date.now()
    setIsSearching(true)

    try {
      let filteredGroups = [...groups]
      let filteredEvents = [...events]
      let filteredPosts = [...posts]

      // Text search across all fields
      if (filters.query.trim()) {
        const queryLower = filters.query.toLowerCase()
        
        filteredGroups = filteredGroups.filter(group => {
          const searchableText = [
            group.name,
            group.description,
            group.mission_statement,
            group.parish,
            group.diocese,
            group.city,
            group.state,
            group.country,
            group.meeting_location,
            group.age_range
          ].join(' ').toLowerCase()

          return searchableText.includes(queryLower)
        })

        filteredEvents = filteredEvents.filter(event => {
          const searchableText = [
            event.title,
            event.description,
            event.location
          ].join(' ').toLowerCase()

          return searchableText.includes(queryLower)
        })

        filteredPosts = filteredPosts.filter(post => {
          const searchableText = [
            post.title,
            post.content
          ].join(' ').toLowerCase()

          return searchableText.includes(queryLower)
        })
      }

      // Category filter
      if (filters.category !== 'all') {
        switch (filters.category) {
          case 'my_groups':
            // This would need to be filtered based on user membership
            // For now, we'll keep all groups
            break
          case 'public':
            filteredGroups = filteredGroups.filter(group => group.is_public)
            break
          case 'private':
            filteredGroups = filteredGroups.filter(group => !group.is_public)
            break
        }
      }

      // Age range filter
      if (filters.ageRange) {
        filteredGroups = filteredGroups.filter(group => 
          group.age_range === filters.ageRange
        )
      }

      // Location filter
      if (filters.location) {
        const locationLower = filters.location.toLowerCase()
        filteredGroups = filteredGroups.filter(group => 
          group.city?.toLowerCase().includes(locationLower) ||
          group.state?.toLowerCase().includes(locationLower) ||
          group.country?.toLowerCase().includes(locationLower)
        )
      }

      // Group type filter (if implemented)
      if (filters.groupType) {
        // This would need to be implemented based on your group type system
        // For now, we'll skip this filter
      }

      // Has events filter
      if (filters.hasEvents) {
        const groupsWithEvents = new Set(events.map(e => e.group_id))
        filteredGroups = filteredGroups.filter(group => 
          groupsWithEvents.has(group.id)
        )
      }

      // Has posts filter
      if (filters.hasPosts) {
        const groupsWithPosts = new Set(posts.map(p => p.group_id))
        filteredGroups = filteredGroups.filter(group => 
          groupsWithPosts.has(group.id)
        )
      }

      // Active groups filter
      if (filters.isActive) {
        filteredGroups = filteredGroups.filter(group => group.is_active)
      }

      // Member count filters
      filteredGroups = filteredGroups.filter(group => {
        const memberCount = group.member_count || 0
        return memberCount >= filters.minMembers && memberCount <= filters.maxMembers
      })

      // Sort results
      filteredGroups.sort((a, b) => {
        let comparison = 0

        switch (filters.sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name)
            break
          case 'created_at':
            comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            break
          case 'member_count':
            comparison = (a.member_count || 0) - (b.member_count || 0)
            break
          case 'relevance':
            // Simple relevance scoring based on query match
            if (filters.query.trim()) {
              const aScore = getRelevanceScore(a, filters.query)
              const bScore = getRelevanceScore(b, filters.query)
              comparison = bScore - aScore
            } else {
              comparison = 0
            }
            break
        }

        return filters.sortOrder === 'asc' ? comparison : -comparison
      })

      // Generate suggestions
      const suggestions = getSuggestions(filters.query, groups)

      // Add to search history
      if (filters.query.trim()) {
        addToHistory(filters.query)
      }

      const searchTime = Date.now() - startTime

      return {
        groups: filteredGroups,
        events: filteredEvents,
        posts: filteredPosts,
        totalResults: filteredGroups.length + filteredEvents.length + filteredPosts.length,
        searchTime,
        suggestions
      }

    } finally {
      setIsSearching(false)
    }
  }, [filters, getSuggestions, addToHistory])

  // Calculate relevance score for a group
  const getRelevanceScore = useCallback((group: YouthGroup, query: string): number => {
    const queryLower = query.toLowerCase()
    let score = 0

    // Name match gets highest score
    if (group.name.toLowerCase().includes(queryLower)) {
      score += 10
    }

    // Description match gets medium score
    if (group.description.toLowerCase().includes(queryLower)) {
      score += 5
    }

    // Other fields get lower scores
    const otherFields = [
      group.mission_statement,
      group.parish,
      group.diocese,
      group.city,
      group.state,
      group.country
    ]

    otherFields.forEach(field => {
      if (field?.toLowerCase().includes(queryLower)) {
        score += 2
      }
    })

    return score
  }, [])

  // Memoized search results
  const searchResults = useMemo(() => {
    return {
      hasActiveFilters: Object.entries(filters).some(([key, value]) => {
        if (key === 'sortBy' || key === 'sortOrder') return false
        return value !== defaultFilters[key as keyof SearchFilters]
      }),
      isSearching,
      searchHistory
    }
  }, [filters, isSearching, searchHistory])

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    search,
    searchResults,
    clearHistory
  }
}

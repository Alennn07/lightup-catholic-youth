"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Search, X, Clock, Users, Heart, BookOpen, Calendar, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'
import { formatDistanceToNow } from 'date-fns'

interface SearchResult {
  id: string
  type: 'prayer' | 'journal' | 'group' | 'event'
  title: string
  content: string
  category?: string
  location?: string
  created_at: string
  image_url?: string
  image_urls?: string[]
  prayer_count?: number
  member_count?: number
  mood?: string
  tags?: string[]
  is_anonymous?: boolean
}

interface SearchResponse {
  success: boolean
  data: {
    prayers: SearchResult[]
    journal: SearchResult[]
    groups: SearchResult[]
    events: SearchResult[]
    total: number
    page: number
    limit: number
    hasMore: boolean
  }
  query: string
  type: string
}

interface GlobalSearchProps {
  placeholder?: string
  className?: string
  onResultClick?: (result: SearchResult) => void
}

export function GlobalSearch({ 
  placeholder = "Search prayers, journal, groups, events...", 
  className = "",
  onResultClick
}: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResponse['data'] | null>(null)
  const [searchType, setSearchType] = useState<'all' | 'prayers' | 'journal' | 'groups' | 'events'>('all')
  const [page, setPage] = useState(1)
  
  const { toast } = useToast()
  const { user } = useAuth()

  // Debounced search function
  const performSearch = useCallback(async (searchQuery: string, type: string = 'all', pageNum: number = 1) => {
    if (!searchQuery.trim()) {
      setResults(null)
      return
    }

    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        query: searchQuery,
        type,
        page: pageNum.toString(),
        limit: '10'
      })

      if (user?.id) {
        params.append('userId', user.id)
      }

      console.log(`🔍 Frontend search: ${searchQuery}, type: ${type}`)
      const response = await fetch(`/api/search?${params}`)
      const data = await response.json()

      console.log(`📊 Frontend search response:`, data)

      if (data.success) {
        setResults(data.data)
        setPage(pageNum)
        console.log(`✅ Search results set:`, data.data)
      } else {
        console.error(`❌ Search failed:`, data.error)
        toast({
          title: "Search failed",
          description: data.error || "Unable to search at this time",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Search error:', error)
      toast({
        title: "Search error",
        description: "Unable to search at this time",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, toast])

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        performSearch(query, searchType, 1)
      } else {
        setResults(null)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, searchType, performSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      performSearch(query, searchType, 1)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result)
    }
    setIsOpen(false)
    setQuery('')
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'prayer': return <Heart className="h-4 w-4 text-rose-500" />
      case 'journal': return <BookOpen className="h-4 w-4 text-blue-500" />
      case 'group': return <Users className="h-4 w-4 text-green-500" />
      case 'event': return <Calendar className="h-4 w-4 text-purple-500" />
      default: return <Search className="h-4 w-4 text-gray-500" />
    }
  }

  const getResultTypeLabel = (type: string) => {
    switch (type) {
      case 'prayer': return 'Prayer Request'
      case 'journal': return 'Journal Entry'
      case 'group': return 'Youth Group'
      case 'event': return 'Event'
      default: return 'Result'
    }
  }

  const renderResult = (result: SearchResult) => (
    <div
      key={`${result.type}-${result.id}`}
      onClick={() => handleResultClick(result)}
      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getResultIcon(result.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {result.title}
            </h4>
            <Badge variant="secondary" className="text-xs">
              {getResultTypeLabel(result.type)}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {result.content}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(result.created_at), { addSuffix: true })}
            </div>
            {result.category && (
              <Badge variant="outline" className="text-xs">
                {result.category}
              </Badge>
            )}
            {result.location && (
              <span className="truncate">{result.location}</span>
            )}
            {result.prayer_count !== undefined && (
              <span>{result.prayer_count} prayers</span>
            )}
            {result.member_count !== undefined && (
              <span>{result.member_count} members</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="pl-10 pr-10 w-full"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery('')
                setResults(null)
              }}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (query || results) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Search Type Filter */}
          <div className="p-3 border-b border-gray-100">
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'prayers', label: 'Prayers' },
                { value: 'journal', label: 'Journal' },
                { value: 'groups', label: 'Groups' },
                { value: 'events', label: 'Events' }
              ].map((type) => (
                <Button
                  key={type.value}
                  variant={searchType === type.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchType(type.value as any)}
                  className="text-xs"
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Searching...</p>
              </div>
            ) : results && (results.prayers.length > 0 || results.journal.length > 0 || results.groups.length > 0 || results.events.length > 0) ? (
              <div>
                {/* Prayers */}
                {results.prayers.map(renderResult)}
                
                {/* Journal */}
                {results.journal.map(renderResult)}
                
                {/* Groups */}
                {results.groups.map(renderResult)}
                
                {/* Events */}
                {results.events.map(renderResult)}

                {/* Load More */}
                {results.hasMore && (
                  <div className="p-3 text-center border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => performSearch(query, searchType, page + 1)}
                      disabled={isLoading}
                    >
                      Load More
                    </Button>
                  </div>
                )}
              </div>
            ) : query && !isLoading ? (
              <div className="p-6 text-center">
                <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No results found</p>
                <p className="text-xs text-gray-400 mt-1">Try different keywords or search type</p>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

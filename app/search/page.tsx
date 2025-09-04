"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, Filter, Clock, Users, Heart, BookOpen, Calendar, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

function SearchContent() {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<'all' | 'prayers' | 'journal' | 'groups' | 'events'>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResponse['data'] | null>(null)
  const [page, setPage] = useState(1)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  // Initialize search from URL params
  useEffect(() => {
    const urlQuery = searchParams.get('q')
    const urlType = searchParams.get('type') as any || 'all'
    
    if (urlQuery) {
      setQuery(urlQuery)
      setSearchType(urlType)
      performSearch(urlQuery, urlType, 1)
    }
  }, [searchParams])

  const performSearch = async (searchQuery: string, type: string = 'all', pageNum: number = 1) => {
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
        limit: '20'
      })

      if (user?.id) {
        params.append('userId', user.id)
      }

      const response = await fetch(`/api/search?${params}`)
      const data = await response.json()

      if (data.success) {
        setResults(data.data)
        setPage(pageNum)
        
        // Update URL
        const newParams = new URLSearchParams(searchParams)
        newParams.set('q', searchQuery)
        newParams.set('type', type)
        router.replace(`/search?${newParams.toString()}`)
      } else {
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
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      performSearch(query, searchType, 1)
    }
  }

  const handleTypeChange = (type: string) => {
    setSearchType(type as any)
    if (query.trim()) {
      performSearch(query, type, 1)
    }
  }

  const handleLoadMore = () => {
    if (query.trim() && results?.hasMore) {
      performSearch(query, searchType, page + 1)
    }
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'prayer': return <Heart className="h-5 w-5 text-rose-500" />
      case 'journal': return <BookOpen className="h-5 w-5 text-blue-500" />
      case 'group': return <Users className="h-5 w-5 text-green-500" />
      case 'event': return <Calendar className="h-5 w-5 text-purple-500" />
      default: return <Search className="h-5 w-5 text-gray-500" />
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
    <Card key={`${result.type}-${result.id}`} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            {getResultIcon(result.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {result.title}
              </h3>
              <Badge variant="secondary">
                {getResultTypeLabel(result.type)}
              </Badge>
            </div>
            <p className="text-gray-600 mb-3 line-clamp-3">
              {result.content}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDistanceToNow(new Date(result.created_at), { addSuffix: true })}
              </div>
              {result.category && (
                <Badge variant="outline">
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
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search</h1>
          <p className="text-gray-600">Find prayers, journal entries, youth groups, and events</p>
        </div>

        {/* Search Form */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search prayers, journal, groups, events..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button type="submit" disabled={isLoading || !query.trim()}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Search
                </Button>
              </div>

              {/* Search Type Filter */}
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'All Results' },
                  { value: 'prayers', label: 'Prayers' },
                  { value: 'journal', label: 'Journal' },
                  { value: 'groups', label: 'Groups' },
                  { value: 'events', label: 'Events' }
                ].map((type) => (
                  <Button
                    key={type.value}
                    variant={searchType === type.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTypeChange(type.value)}
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Searching...</p>
          </div>
        ) : results && results.total > 0 ? (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Found {results.total} result{results.total !== 1 ? 's' : ''} for "{query}"
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Filter className="h-4 w-4" />
                {searchType === 'all' ? 'All types' : getResultTypeLabel(searchType)}
              </div>
            </div>

            {/* Results by Type */}
            {results.prayers.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  Prayer Requests ({results.prayers.length})
                </h2>
                <div className="space-y-4">
                  {results.prayers.map(renderResult)}
                </div>
              </div>
            )}

            {results.journal.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  Journal Entries ({results.journal.length})
                </h2>
                <div className="space-y-4">
                  {results.journal.map(renderResult)}
                </div>
              </div>
            )}

            {results.groups.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  Youth Groups ({results.groups.length})
                </h2>
                <div className="space-y-4">
                  {results.groups.map(renderResult)}
                </div>
              </div>
            )}

            {results.events.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  Events ({results.events.length})
                </h2>
                <div className="space-y-4">
                  {results.events.map(renderResult)}
                </div>
              </div>
            )}

            {/* Load More */}
            {results.hasMore && (
              <div className="text-center">
                <Button onClick={handleLoadMore} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Load More Results
                </Button>
              </div>
            )}
          </div>
        ) : query && !isLoading ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 mb-4">Try different keywords or search type</p>
            <Button onClick={() => setSearchType('all')} variant="outline">
              Search All Types
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}

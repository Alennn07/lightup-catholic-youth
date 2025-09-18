"use client"

import { useState, useEffect } from 'react'
import { GroupCategory } from '@/types/youth-groups'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tag, X } from 'lucide-react'

interface GroupCategorySelectorProps {
  selectedCategoryId?: string
  onCategoryChange: (categoryId: string | undefined) => void
  showLabel?: boolean
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function GroupCategorySelector({
  selectedCategoryId,
  onCategoryChange,
  showLabel = true,
  placeholder = "Select a category",
  className = "",
  disabled = false
}: GroupCategorySelectorProps) {
  const [categories, setCategories] = useState<GroupCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/group-categories?active_only=true')
      const result = await response.json()
      
      if (result.success) {
        setCategories(result.data || [])
      } else {
        setError(result.error || 'Failed to load categories')
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId)

  const handleCategoryChange = (value: string) => {
    if (value === 'none') {
      onCategoryChange(undefined)
    } else {
      onCategoryChange(value)
    }
  }

  const clearSelection = () => {
    onCategoryChange(undefined)
  }

  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        {showLabel && <Label>Category</Label>}
        <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`space-y-2 ${className}`}>
        {showLabel && <Label>Category</Label>}
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && <Label>Category</Label>}
      
      <div className="space-y-2">
        <Select
          value={selectedCategoryId || 'none'}
          onValueChange={handleCategoryChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <span>No category</span>
              </div>
            </SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedCategory && (
          <Card className="p-3">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: selectedCategory.color }}
                  />
                  <div>
                    <div className="font-medium text-sm">{selectedCategory.name}</div>
                    {selectedCategory.description && (
                      <div className="text-xs text-gray-600">{selectedCategory.description}</div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// Category Badge Component for displaying categories in lists
interface CategoryBadgeProps {
  category?: GroupCategory
  className?: string
}

export function CategoryBadge({ category, className = "" }: CategoryBadgeProps) {
  if (!category) return null

  return (
    <Badge 
      variant="outline" 
      className={`inline-flex items-center space-x-1 ${className}`}
      style={{ 
        borderColor: category.color,
        color: category.color 
      }}
    >
      <div 
        className="w-2 h-2 rounded-full" 
        style={{ backgroundColor: category.color }}
      />
      <span>{category.name}</span>
    </Badge>
  )
}

// Category Filter Component for filtering groups by category
interface CategoryFilterProps {
  selectedCategoryId?: string
  onCategoryChange: (categoryId: string | undefined) => void
  className?: string
}

export function CategoryFilter({
  selectedCategoryId,
  onCategoryChange,
  className = ""
}: CategoryFilterProps) {
  const [categories, setCategories] = useState<GroupCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/group-categories?active_only=true')
      const result = await response.json()
      
      if (result.success) {
        setCategories(result.data || [])
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Select
        value={selectedCategoryId || 'all'}
        onValueChange={(value) => onCategoryChange(value === 'all' ? undefined : value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>All Categories</span>
            </div>
          </SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

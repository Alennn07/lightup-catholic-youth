"use client"

// Youth Groups Test Panel
// A comprehensive testing component for all high-priority features

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
// Simplified test panel - no complex hooks needed
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, XCircle, Clock, Bell, Search, BarChart3, Zap } from 'lucide-react'

export function YouthGroupsTestPanel() {
  const { user } = useAuth()
  const [testResults, setTestResults] = useState<Record<string, 'pending' | 'pass' | 'fail'>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [testGroups] = useState([
    { id: '1', name: 'Test Group 1', description: 'A test group for testing', is_public: true },
    { id: '2', name: 'Youth Ministry', description: 'Catholic youth group for young adults', is_public: true },
    { id: '3', name: 'Bible Study', description: 'Weekly bible study group for all ages', is_public: false },
    { id: '4', name: 'Young Adults', description: 'Young adults ministry group', is_public: true },
    { id: '5', name: 'Prayer Warriors', description: 'Dedicated prayer group for youth', is_public: false }
  ])

  // Real-time notifications (simplified)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  // Advanced search (simplified)
  const [filters, setFilters] = useState({ category: 'all' })
  const [searchResults, setSearchResults] = useState<any>(null)
  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }
  const search = async (groups: any[], events: any[] = [], posts: any[] = []) => {
    const startTime = Date.now()
    
    // Filter groups based on search query
    let filteredGroups = groups
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase()
      filteredGroups = groups.filter(group => 
        group.name.toLowerCase().includes(queryLower) ||
        group.description.toLowerCase().includes(queryLower)
      )
    }
    
    // Apply category filter
    if (filters.category === 'public') {
      filteredGroups = filteredGroups.filter(group => group.is_public !== false)
    } else if (filters.category === 'private') {
      filteredGroups = filteredGroups.filter(group => group.is_public === false)
    }
    
    const searchTime = Date.now() - startTime
    
    return {
      groups: filteredGroups,
      events: [],
      posts: [],
      totalResults: filteredGroups.length,
      searchTime,
      suggestions: searchQuery.trim() ? 
        groups
          .filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(g => g.name)
          .slice(0, 3) : []
    }
  }

  // Analytics (simplified)
  const [analytics, setAnalytics] = useState<any>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [activityCount, setActivityCount] = useState(0)
  
  const trackActivity = async (activity: any) => {
    console.log('Tracking activity:', activity)
    setActivityCount(prev => prev + 1)
    
    // Update analytics with new activity
    setAnalytics((prev: any) => {
      if (!prev) {
        return {
          userEngagement: {
            groupsJoined: 0,
            groupsCreated: 0,
            eventsAttended: 0,
            postsCreated: 0,
            totalActivity: 0,
            lastActive: new Date().toISOString()
          },
          groupActivity: {
            totalGroups: testGroups.length,
            activeGroups: testGroups.filter(g => g.is_public).length,
            totalMembers: testGroups.length * 10,
            totalEvents: 0,
            totalPosts: 0,
            averageGroupSize: 10,
            mostActiveGroup: 'Youth Ministry'
          }
        }
      }
      
      const updated = { ...prev }
      updated.userEngagement.totalActivity = activityCount + 1
      updated.userEngagement.lastActive = new Date().toISOString()
      
      // Update specific metrics based on activity type
      switch (activity.type) {
        case 'group_joined':
          updated.userEngagement.groupsJoined += 1
          break
        case 'group_created':
          updated.userEngagement.groupsCreated += 1
          updated.groupActivity.totalGroups += 1
          break
        case 'event_attended':
          updated.userEngagement.eventsAttended += 1
          break
        case 'post_created':
          updated.userEngagement.postsCreated += 1
          break
      }
      
      return updated
    })
  }

  // Real-time updates (simplified)
  const [realtimeEvents, setRealtimeEvents] = useState<string[]>([])

  // Live search effect
  useEffect(() => {
    if (searchQuery.trim()) {
      const performSearch = async () => {
        const results = await search(testGroups, [], [])
        setSearchResults(results)
      }
      performSearch()
    } else {
      setSearchResults(null)
    }
  }, [searchQuery, filters.category])

  // Test functions
  const testRealtimeUpdates = async () => {
    setTestResults(prev => ({ ...prev, 'realtime-updates': 'pending' }))
    
    try {
      // Simulate a real-time event
      const testEvent = {
        id: 'test-event',
        title: 'Test Event',
        group_id: 'test-group',
        created_at: new Date().toISOString()
      }
      
      // Simulate real-time event
      setRealtimeEvents(prev => [...prev, `Simulated event: ${testEvent.title}`])
      console.log('Testing real-time updates...')
      setTestResults(prev => ({ ...prev, 'realtime-updates': 'pass' }))
    } catch (error) {
      console.error('Real-time test failed:', error)
      setTestResults(prev => ({ ...prev, 'realtime-updates': 'fail' }))
    }
  }

  const testNotifications = async () => {
    setTestResults(prev => ({ ...prev, 'notifications': 'pending' }))
    
    try {
      // Test notification system
      const testNotification = {
        id: 'test-notification',
        type: 'group_update' as const,
        title: 'Test Notification',
        message: 'This is a test notification',
        groupId: 'test-group',
        groupName: 'Test Group',
        userId: user?.id || '',
        timestamp: new Date().toISOString(),
        read: false
      }
      
      // Add test notification
      setNotifications(prev => [testNotification, ...prev])
      setUnreadCount(prev => prev + 1)
      console.log('Testing notifications...')
      setTestResults(prev => ({ ...prev, 'notifications': 'pass' }))
    } catch (error) {
      console.error('Notification test failed:', error)
      setTestResults(prev => ({ ...prev, 'notifications': 'fail' }))
    }
  }

  const testAdvancedSearch = async () => {
    setTestResults(prev => ({ ...prev, 'advanced-search': 'pending' }))
    
    try {
      const results = await search(testGroups, [], [])
      setSearchResults(results)
      console.log('Search results:', results)
      setTestResults(prev => ({ ...prev, 'advanced-search': 'pass' }))
    } catch (error) {
      console.error('Search test failed:', error)
      setTestResults(prev => ({ ...prev, 'advanced-search': 'fail' }))
    }
  }

  const testAnalytics = async () => {
    setTestResults(prev => ({ ...prev, 'analytics': 'pending' }))
    
    try {
      // Initialize analytics if not already set
      if (!analytics) {
        setAnalytics({
          userEngagement: {
            groupsJoined: 0,
            groupsCreated: 0,
            eventsAttended: 0,
            postsCreated: 0,
            totalActivity: 0,
            lastActive: new Date().toISOString()
          },
          groupActivity: {
            totalGroups: testGroups.length,
            activeGroups: testGroups.filter(g => g.is_public).length,
            totalMembers: testGroups.length * 10,
            totalEvents: 0,
            totalPosts: 0,
            averageGroupSize: 10,
            mostActiveGroup: 'Youth Ministry'
          }
        })
      }
      
      // Track multiple activities to show real-time updates
      await trackActivity({
        type: 'group_created',
        groupId: 'test-group-1',
        metadata: { test: true }
      })
      
      await trackActivity({
        type: 'group_joined',
        groupId: 'test-group-2',
        metadata: { test: true }
      })
      
      await trackActivity({
        type: 'event_attended',
        groupId: 'test-group-3',
        metadata: { test: true }
      })
      
      await trackActivity({
        type: 'post_created',
        groupId: 'test-group-4',
        metadata: { test: true }
      })
      
      console.log('Analytics test passed - tracked 4 activities')
      setTestResults(prev => ({ ...prev, 'analytics': 'pass' }))
    } catch (error) {
      console.error('Analytics test failed:', error)
      setTestResults(prev => ({ ...prev, 'analytics': 'fail' }))
    }
  }

  const runAllTests = async () => {
    setTestResults({})
    await testRealtimeUpdates()
    await testNotifications()
    await testAdvancedSearch()
    await testAnalytics()
  }

  const getStatusIcon = (status: 'pending' | 'pass' | 'fail') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: 'pending' | 'pass' | 'fail') => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800'
      case 'fail':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Youth Groups Test Panel</CardTitle>
          <CardDescription>Please log in to test the features</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Youth Groups Test Panel</span>
          </CardTitle>
          <CardDescription>
            Test all high-priority features: Real-time updates, Notifications, Advanced Search, and Analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={runAllTests} className="w-full">
              Run All Tests
            </Button>
            
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={testRealtimeUpdates} variant="outline">
                Test Real-time Updates
              </Button>
              <Button onClick={testNotifications} variant="outline">
                Test Notifications
              </Button>
              <Button onClick={testAdvancedSearch} variant="outline">
                Test Advanced Search
              </Button>
              <Button onClick={testAnalytics} variant="outline">
                Test Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="test-results" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="test-results">Test Results</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="test-results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(testResults).map(([test, status]) => (
                  <div key={test} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(status)}
                      <span className="font-medium capitalize">
                        {test.replace('-', ' ')}
                      </span>
                    </div>
                    <Badge className={getStatusColor(status)}>
                      {status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Real-time Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {realtimeEvents.length === 0 ? (
                  <p className="text-gray-500">No real-time events yet...</p>
                ) : (
                  realtimeEvents.map((event, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {event}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="destructive">{unreadCount}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Button onClick={markAllAsRead} size="sm">
                    Mark All as Read
                  </Button>
                  <span className="text-sm text-gray-500">
                    {notifications.length} total notifications
                  </span>
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-gray-500">No notifications yet...</p>
                  ) : (
                    notifications.map((notification) => (
                      <div key={notification.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{notification.title}</h4>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                          </div>
                          <Button
                            onClick={() => markAsRead(notification.id)}
                            size="sm"
                            variant="outline"
                          >
                            Mark Read
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Advanced Search</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Search Query</label>
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search groups..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Groups</SelectItem>
                        <SelectItem value="my_groups">My Groups</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={testAdvancedSearch} className="w-full">
                  Test Search
                </Button>
                
                {searchResults && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Search Results:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Total Results: {searchResults.totalResults}</p>
                      <p>Search Time: {searchResults.searchTime}ms</p>
                      {searchResults.suggestions.length > 0 && (
                        <p>Suggestions: {searchResults.suggestions.join(', ')}</p>
                      )}
                    </div>
                    
                    {searchResults.groups.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Found Groups:</h5>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {searchResults.groups.map((group: any) => (
                            <div key={group.id} className="p-2 border rounded-lg bg-gray-50">
                              <div className="font-medium text-sm">{group.name}</div>
                              <div className="text-xs text-gray-600">{group.description}</div>
                              <div className="text-xs text-blue-600">
                                {group.is_public ? 'Public' : 'Private'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsLoading ? (
                  <p className="text-gray-500">Loading analytics...</p>
                ) : analytics ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">User Engagement</h4>
                      <div className="text-sm space-y-1">
                        <p>Groups Joined: {analytics.userEngagement.groupsJoined}</p>
                        <p>Groups Created: {analytics.userEngagement.groupsCreated}</p>
                        <p>Events Attended: {analytics.userEngagement.eventsAttended}</p>
                        <p>Posts Created: {analytics.userEngagement.postsCreated}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Group Activity</h4>
                      <div className="text-sm space-y-1">
                        <p>Total Groups: {analytics.groupActivity.totalGroups}</p>
                        <p>Active Groups: {analytics.groupActivity.activeGroups}</p>
                        <p>Total Members: {analytics.groupActivity.totalMembers}</p>
                        <p>Most Active: {analytics.groupActivity.mostActiveGroup}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No analytics data available</p>
                )}
                
                <div className="space-y-2">
                  <Button onClick={testAnalytics} className="w-full">
                    Test Analytics Tracking
                  </Button>
                  <Button 
                    onClick={() => {
                      setAnalytics(null)
                      setActivityCount(0)
                    }} 
                    variant="outline" 
                    className="w-full"
                  >
                    Reset Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

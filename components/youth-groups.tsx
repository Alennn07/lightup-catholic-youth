"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Users, MapPin, Calendar, Plus, Settings, MessageSquare, Heart } from 'lucide-react'

interface YouthGroup {
  id: string
  name: string
  description: string
  mission_statement?: string
  parish?: string
  diocese?: string
  city?: string
  state?: string
  country?: string
  meeting_location?: string
  meeting_time?: string
  meeting_frequency?: string
  age_range?: string
  max_members: number
  is_public: boolean
  is_active: boolean
  owner_id: string
  created_at: string
  updated_at: string
  owner?: {
    id: string
    email: string
    user_metadata?: any
  }
  member_count?: number
  user_role?: string
  user_status?: string
  is_member?: boolean
  members?: any[]
  events?: any[]
  posts?: any[]
}

export default function YouthGroups() {
  const { user, getAccessToken } = useAuth()
  const { toast } = useToast()
  const [groups, setGroups] = useState<YouthGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<YouthGroup | null>(null)
  const [showGroupDetails, setShowGroupDetails] = useState(false)

  // Form state for creating groups
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mission_statement: '',
    parish: '',
    diocese: '',
    city: '',
    state: '',
    country: '',
    meeting_location: '',
    meeting_time: '',
    meeting_frequency: '',
    age_range: '',
    max_members: 50,
    is_public: true
  })

  useEffect(() => {
    if (user) {
      fetchGroups()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchGroups = async () => {
    try {
      console.log('🚀 fetchGroups started')
      
      const token = await getAccessToken()
      console.log('🔑 Token received:', token ? 'Yes' : 'No')
      
      if (!token) {
        console.log('❌ No token available')
        toast({ title: "Authentication Error", description: "Please sign in to view groups.", variant: "destructive" })
        return
      }

      console.log('📡 Making API request to /api/youth-groups')
      const response = await fetch('/api/youth-groups', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response ok:', response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error Response:', errorText)
        
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch (parseError) {
          console.error('❌ Could not parse error response:', parseError)
          errorData = { error: 'Unknown error', details: errorText }
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('✅ API Response data:', data)
      setGroups(data.groups || [])
    } catch (error: any) {
      console.error('❌ Error fetching groups:', error)
      toast({ title: "Error", description: error.message || "Failed to load youth groups.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleJoinGroup = async (groupId: string) => {
    try {
      const token = await getAccessToken()
      if (!token) {
        toast({ title: "Authentication Error", description: "Please sign in to join groups.", variant: "destructive" })
        return
      }

      const response = await fetch('/api/youth-groups/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ groupId, action: 'join' })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to join group')
      }

      const data = await response.json()
      toast({ title: "Success", description: data.message })
      
      // Refresh groups to update membership status
      fetchGroups()
    } catch (error: any) {
      console.error('Error joining group:', error)
      toast({ title: "Error", description: error.message || "Failed to join group.", variant: "destructive" })
    }
  }

  const handleLeaveGroup = async (groupId: string) => {
    try {
      const token = await getAccessToken()
      if (!token) {
        toast({ title: "Authentication Error", description: "Please sign in to leave groups.", variant: "destructive" })
        return
      }

      const response = await fetch('/api/youth-groups/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ groupId, action: 'leave' })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to leave group')
      }

      const data = await response.json()
      toast({ title: "Success", description: data.message })
      
      // Refresh groups to update membership status
      fetchGroups()
    } catch (error: any) {
      console.error('Error leaving group:', error)
      toast({ title: "Error", description: error.message || "Failed to leave group.", variant: "destructive" })
    }
  }

  const handleCreateGroup = async () => {
    try {
      const token = await getAccessToken()
      if (!token) {
        toast({ title: "Authentication Error", description: "Please sign in to create groups.", variant: "destructive" })
        return
      }

      const response = await fetch('/api/youth-groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create group')
      }

      const data = await response.json()
      toast({ title: "Success", description: "Group created successfully!" })
      
      // Reset form and close modal
      setFormData({
        name: '',
        description: '',
        mission_statement: '',
        parish: '',
        diocese: '',
        city: '',
        state: '',
        country: '',
        meeting_location: '',
        meeting_time: '',
        meeting_frequency: '',
        age_range: '',
        max_members: 50,
        is_public: true
      })
      setShowCreateForm(false)
      
      // Refresh groups
      fetchGroups()
    } catch (error: any) {
      console.error('Error creating group:', error)
      toast({ title: "Error", description: error.message || "Failed to create group.", variant: "destructive" })
    }
  }

  const handleViewGroup = async (group: YouthGroup) => {
    try {
      const token = await getAccessToken()
      if (!token) {
        toast({ title: "Authentication Error", description: "Please sign in to view group details.", variant: "destructive" })
        return
      }

      const response = await fetch(`/api/youth-groups/${group.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch group details')
      }

      const data = await response.json()
      setSelectedGroup(data.group)
      setShowGroupDetails(true)
    } catch (error) {
      console.error('Error fetching group details:', error)
      toast({ title: "Error", description: "Failed to load group details.", variant: "destructive" })
    }
  }

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.parish?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.city?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'my-groups' && group.is_member) ||
                           (selectedCategory === 'public' && group.is_public)

    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading youth groups...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Youth Groups</h1>
          <p className="text-muted-foreground">Connect with Catholic youth in your area</p>
        </div>
        {user && (
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Youth Group</DialogTitle>
                <DialogDescription>
                  Start a new youth group to bring young Catholics together in faith and fellowship.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Group Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter group name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="parish">Parish</Label>
                    <Input
                      id="parish"
                      value={formData.parish}
                      onChange={(e) => setFormData({ ...formData, parish: e.target.value })}
                      placeholder="Enter parish name"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your group's purpose and activities"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="mission_statement">Mission Statement</Label>
                  <Textarea
                    id="mission_statement"
                    value={formData.mission_statement}
                    onChange={(e) => setFormData({ ...formData, mission_statement: e.target.value })}
                    placeholder="What is your group's mission?"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Country"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="meeting_location">Meeting Location</Label>
                    <Input
                      id="meeting_location"
                      value={formData.meeting_location}
                      onChange={(e) => setFormData({ ...formData, meeting_location: e.target.value })}
                      placeholder="Where does your group meet?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="meeting_time">Meeting Time</Label>
                    <Input
                      id="meeting_time"
                      value={formData.meeting_time}
                      onChange={(e) => setFormData({ ...formData, meeting_time: e.target.value })}
                      placeholder="e.g., Every Sunday 6:00 PM"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="meeting_frequency">Frequency</Label>
                    <Select value={formData.meeting_frequency} onValueChange={(value) => setFormData({ ...formData, meeting_frequency: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="age_range">Age Range</Label>
                    <Select value={formData.age_range} onValueChange={(value) => setFormData({ ...formData, age_range: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="13-18">13-18</SelectItem>
                        <SelectItem value="18-25">18-25</SelectItem>
                        <SelectItem value="13-25">13-25</SelectItem>
                        <SelectItem value="16-22">16-22</SelectItem>
                        <SelectItem value="18-35">18-35</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="max_members">Max Members</Label>
                    <Input
                      id="max_members"
                      type="number"
                      value={formData.max_members}
                      onChange={(e) => setFormData({ ...formData, max_members: parseInt(e.target.value) || 50 })}
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_public"
                    checked={formData.is_public}
                    onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="is_public">Make this group public (anyone can join)</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateGroup} disabled={!formData.name || !formData.description}>
                    Create Group
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search groups by name, description, parish, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            <SelectItem value="my-groups">My Groups</SelectItem>
            <SelectItem value="public">Public Groups</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Groups Grid */}
      {filteredGroups.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No groups found</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Be the first to create a youth group in your area!'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                      {group.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {group.is_member && (
                      <Badge variant="secondary" className="text-xs">
                        {group.user_role === 'owner' ? 'Owner' : 'Member'}
                      </Badge>
                    )}
                    {!group.is_public && (
                      <Badge variant="outline" className="text-xs">Private</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  {group.parish && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{group.parish}</span>
                    </div>
                  )}
                  {group.city && group.state && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{group.city}, {group.state}</span>
                    </div>
                  )}
                  {group.meeting_time && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{group.meeting_time}</span>
                    </div>
                  )}
                  {group.age_range && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Ages {group.age_range}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {group.member_count || 0} members
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewGroup(group)}
                    >
                      View Details
                    </Button>
                    {!group.is_member ? (
                      <Button
                        size="sm"
                        onClick={() => handleJoinGroup(group.id)}
                        disabled={!group.is_public}
                      >
                        Join Group
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleLeaveGroup(group.id)}
                        disabled={group.user_role === 'owner'}
                      >
                        Leave Group
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Group Details Modal */}
      {selectedGroup && (
        <Dialog open={showGroupDetails} onOpenChange={setShowGroupDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedGroup.name}</DialogTitle>
              <DialogDescription>{selectedGroup.description}</DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Mission Statement</h4>
                      <p className="text-muted-foreground">
                        {selectedGroup.mission_statement || 'No mission statement provided.'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Meeting Information</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {selectedGroup.meeting_location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{selectedGroup.meeting_location}</span>
                          </div>
                        )}
                        {selectedGroup.meeting_time && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{selectedGroup.meeting_time}</span>
                          </div>
                        )}
                        {selectedGroup.meeting_frequency && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{selectedGroup.meeting_frequency}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Group Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Parish:</span>
                          <span>{selectedGroup.parish || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Diocese:</span>
                          <span>{selectedGroup.diocese || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span>
                            {[selectedGroup.city, selectedGroup.state, selectedGroup.country]
                              .filter(Boolean)
                              .join(', ') || 'Not specified'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Age Range:</span>
                          <span>{selectedGroup.age_range || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Max Members:</span>
                          <span>{selectedGroup.max_members}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant={selectedGroup.is_public ? "default" : "outline"}>
                            {selectedGroup.is_public ? 'Public' : 'Private'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="members" className="space-y-4">
                <div className="space-y-3">
                  {selectedGroup.members && selectedGroup.members.length > 0 ? (
                    selectedGroup.members.map((member: any) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {member.user?.user_metadata?.full_name || member.user?.email || 'Unknown User'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {member.role} • Joined {new Date(member.joined_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant={member.role === 'owner' ? 'default' : 'secondary'}>
                          {member.role}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No members found.</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="events" className="space-y-4">
                <div className="space-y-3">
                  {selectedGroup.events && selectedGroup.events.length > 0 ? (
                    selectedGroup.events.map((event: any) => (
                      <div key={event.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-medium">{event.title}</h5>
                            <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(event.event_date).toLocaleDateString()}
                              </span>
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {event.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No upcoming events.</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="posts" className="space-y-4">
                <div className="space-y-3">
                  {selectedGroup.posts && selectedGroup.posts.length > 0 ? (
                    selectedGroup.posts.map((post: any) => (
                      <div key={post.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {post.title && (
                              <h5 className="font-medium mb-2">{post.title}</h5>
                            )}
                            <p className="text-sm text-muted-foreground mb-2">{post.content}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {post.post_type}
                              </span>
                              <span>{new Date(post.created_at).toLocaleDateString()}</span>
                              <span>by {post.user?.user_metadata?.full_name || post.user?.email || 'Unknown User'}</span>
                            </div>
                          </div>
                          {post.is_pinned && (
                            <Badge variant="outline" className="text-xs">Pinned</Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No posts yet.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

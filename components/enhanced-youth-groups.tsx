"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { usePermissions } from '@/hooks/use-permissions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Users, MapPin, Calendar, Plus, Settings, MessageSquare, Heart, X, Edit, Trash2, Globe, RefreshCw, UserPlus, Clock, CheckCircle, XCircle } from 'lucide-react'
import { logIfEnabled } from "@/lib/performance-monitor"
import { useTranslation } from "@/lib/i18n"
import { RoleBasedWrapper, CanCreateGroups, GroupOwnerOnly, CanManageMembers } from '@/components/role-based-wrapper'
import { MemberRequestModal } from '@/components/member-request-modal'
import { NotificationBadge } from '@/components/notification-badge'

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
  requires_approval: boolean
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
  is_owner?: boolean
  is_pending?: boolean
  members?: any[]
  events?: any[]
  posts?: any[]
}

export default function EnhancedYouthGroups() {
  const { t } = useTranslation()
  const { user, getAccessToken } = useAuth()
  const { toast } = useToast()
  const { permissions, loading: permissionsLoading } = usePermissions()
  
  const [groups, setGroups] = useState<YouthGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showGroupDetails, setShowGroupDetails] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<YouthGroup | null>(null)
  const [loadingGroupDetails, setLoadingGroupDetails] = useState(false)
  const [showAddMemberForm, setShowAddMemberForm] = useState(false)
  const [showMemberRequests, setShowMemberRequests] = useState(false)
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showEditGroup, setShowEditGroup] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [joinRequestMessage, setJoinRequestMessage] = useState('')
  const [groupMembers, setGroupMembers] = useState<any[]>([])
  const [groupEvents, setGroupEvents] = useState<any[]>([])
  const [groupPosts, setGroupPosts] = useState<any[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [loadingPosts, setLoadingPosts] = useState(false)
  
  // Event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxAttendees: ''
  })
  
  // Post form state
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    type: 'announcement'
  })
  
  // Edit group form state
  const [editGroupForm, setEditGroupForm] = useState({
    name: '',
    description: '',
    mission_statement: '',
    meeting_time: '',
    meeting_location: '',
    age_range: '',
    max_members: '',
    is_public: true,
    requires_approval: true
  })

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
    is_public: true,
    requires_approval: true
  })

  useEffect(() => {
    fetchGroups()
  }, [])

  // Fetch data when group details modal opens
  useEffect(() => {
    if (showGroupDetails && selectedGroup) {
      console.log('🔄 Modal opened, fetching all group data...')
      fetchGroupMembers()
      fetchGroupEvents()
      fetchGroupPosts()
    }
  }, [showGroupDetails, selectedGroup])

  // Initialize edit form when group is selected
  useEffect(() => {
    if (selectedGroup && showEditGroup) {
      setEditGroupForm({
        name: selectedGroup.name || '',
        description: selectedGroup.description || '',
        mission_statement: selectedGroup.mission_statement || '',
        meeting_time: selectedGroup.meeting_time || '',
        meeting_location: selectedGroup.meeting_location || '',
        age_range: selectedGroup.age_range || '',
        max_members: selectedGroup.max_members?.toString() || '',
        is_public: selectedGroup.is_public || true,
        requires_approval: selectedGroup.requires_approval || true
      })
    }
  }, [selectedGroup, showEditGroup])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      const token = await getAccessToken()
      
      const headers: any = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('/api/youth-groups', {
        headers
      })

      if (response.ok) {
        const data = await response.json()
        setGroups(data.groups || [])
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to fetch groups",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
      toast({
        title: "Error",
        description: "Failed to fetch groups",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!permissions?.canCreateGroups) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to create groups",
        variant: "destructive"
      })
      return
    }

    try {
      const token = await getAccessToken()
      if (!token) return

      const response = await fetch('/api/youth-groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: "Group created successfully"
        })
        setShowCreateForm(false)
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
          is_public: true,
          requires_approval: true
        })
        fetchGroups()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create group",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating group:', error)
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive"
      })
    }
  }

  const handleJoinGroup = async (groupId: string) => {
    console.log('handleJoinGroup called for group:', groupId)
    // Find the group to check if it requires approval
    const group = groups.find(g => g.id === groupId)
    if (!group) {
      console.log('Group not found')
      return
    }

    console.log('Group found:', group.name, 'requires_approval:', group.requires_approval)

    // If group requires approval, show modal for join request
    if (group.requires_approval) {
      console.log('Opening modal for join request')
      setSelectedGroup(group)
      setShowGroupDetails(true)
      return
    }

    // If no approval required, join directly
    await submitJoinRequest(groupId, '')
  }

  const submitJoinRequest = async (groupId: string, message: string) => {
    try {
      const token = await getAccessToken()
      if (!token) return

      console.log('Submitting join request for group:', groupId, 'with message:', message)

      const response = await fetch(`/api/youth-groups/${groupId}/join-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: message
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Join request successful:', data)
        toast({
          title: "Success",
          description: data.message || "Join request submitted successfully"
        })
        setJoinRequestMessage('')
        setShowGroupDetails(false)
        setSelectedGroup(null)
        console.log('Refreshing groups list...')
        await fetchGroups()
        console.log('Groups refreshed')
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to join group",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error joining group:', error)
      toast({
        title: "Error",
        description: "Failed to join group",
        variant: "destructive"
      })
    }
  }

  const handleLeaveGroup = async (groupId: string) => {
    try {
      const token = await getAccessToken()
      if (!token) return

      const response = await fetch('/api/youth-groups/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          groupId,
          action: 'leave'
        })
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: data.message || "Left group successfully"
        })
        fetchGroups()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to leave group",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error leaving group:', error)
      toast({
        title: "Error",
        description: "Failed to leave group",
        variant: "destructive"
      })
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGroup) return

    try {
      const token = await getAccessToken()
      if (!token) return

      const response = await fetch(`/api/youth-groups/${selectedGroup.id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: newMemberEmail
        })
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: data.message || "Member added successfully"
        })
        setNewMemberEmail('')
        setShowAddMemberForm(false)
        fetchGroups()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to add member",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error adding member:', error)
      toast({
        title: "Error",
        description: "Failed to add member",
        variant: "destructive"
      })
    }
  }

  // Fetch group members
  const fetchGroupMembers = async () => {
    if (!selectedGroup) {
      console.log('❌ No selected group for fetching members')
      return
    }
    
    try {
      console.log('🔄 Fetching members for group:', selectedGroup.id)
      setLoadingMembers(true)
      const token = await getAccessToken()
      if (!token) {
        console.log('❌ No access token for fetching members')
        return
      }

      // Debug membership status first
      console.log('🔍 Debugging membership status...')
      const debugResponse = await fetch(`/api/debug-membership?groupId=${selectedGroup.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (debugResponse.ok) {
        const debugData = await debugResponse.json()
        console.log('🔍 Debug membership data:', debugData.debug)
      }

      console.log('🔄 Calling members API...')
      const response = await fetch(`/api/youth-groups/${selectedGroup.id}/members`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('📡 Members API response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Members data received:', data)
        setGroupMembers(data.members || [])
        console.log('✅ Members set in state:', data.members?.length || 0)
      } else {
        const error = await response.json()
        console.error('❌ Failed to fetch members:', error)
        toast({
          title: "Error",
          description: error.error || "Failed to fetch members",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('❌ Error fetching members:', error)
      toast({
        title: "Error",
        description: "Failed to fetch members",
        variant: "destructive"
      })
    } finally {
      setLoadingMembers(false)
    }
  }

  // Fetch group events
  const fetchGroupEvents = async () => {
    if (!selectedGroup) {
      console.log('❌ No selected group for fetching events')
      return
    }
    
    try {
      console.log('🔄 Fetching events for group:', selectedGroup.id)
      setLoadingEvents(true)
      const token = await getAccessToken()
      if (!token) {
        console.log('❌ No access token for fetching events')
        return
      }

      console.log('🔄 Calling events API...')
      const response = await fetch(`/api/youth-groups/${selectedGroup.id}/events`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('📡 Events API response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Events data received:', data)
        setGroupEvents(data.events || [])
        console.log('✅ Events set in state:', data.events?.length || 0)
      } else {
        const error = await response.json()
        console.error('❌ Failed to fetch events:', error)
        toast({
          title: "Error",
          description: error.error || "Failed to fetch events",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('❌ Error fetching events:', error)
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive"
      })
    } finally {
      setLoadingEvents(false)
    }
  }

  // Fetch group posts
  const fetchGroupPosts = async () => {
    if (!selectedGroup) {
      console.log('❌ No selected group for fetching posts')
      return
    }
    
    try {
      console.log('🔄 Fetching posts for group:', selectedGroup.id)
      setLoadingPosts(true)
      const token = await getAccessToken()
      if (!token) {
        console.log('❌ No access token for fetching posts')
        return
      }

      console.log('🔄 Calling posts API...')
      const response = await fetch(`/api/youth-groups/${selectedGroup.id}/posts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('📡 Posts API response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Posts data received:', data)
        setGroupPosts(data.posts || [])
        console.log('✅ Posts set in state:', data.posts?.length || 0)
      } else {
        const error = await response.json()
        console.error('❌ Failed to fetch posts:', error)
        toast({
          title: "Error",
          description: error.error || "Failed to fetch posts",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('❌ Error fetching posts:', error)
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive"
      })
    } finally {
      setLoadingPosts(false)
    }
  }

  // Handle create event
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGroup) return

    try {
      const token = await getAccessToken()
      if (!token) return

      const response = await fetch(`/api/youth-groups/${selectedGroup.id}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventForm)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event created successfully"
        })
        setEventForm({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          maxAttendees: ''
        })
        setShowCreateEvent(false)
        fetchGroupEvents() // Refresh events list
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create event",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating event:', error)
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive"
      })
    }
  }

  // Handle create post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGroup) return

    try {
      const token = await getAccessToken()
      if (!token) return

      const response = await fetch(`/api/youth-groups/${selectedGroup.id}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postForm)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Post created successfully"
        })
        setPostForm({
          title: '',
          content: '',
          type: 'announcement'
        })
        setShowCreatePost(false)
        fetchGroupPosts() // Refresh posts list
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create post",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating post:', error)
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      })
    }
  }

  // Handle edit group
  const handleEditGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGroup) return

    try {
      const token = await getAccessToken()
      if (!token) return

      const response = await fetch(`/api/youth-groups/${selectedGroup.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editGroupForm)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Group updated successfully"
        })
        setShowEditGroup(false)
        fetchGroups()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to update group",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating group:', error)
      toast({
        title: "Error",
        description: "Failed to update group",
        variant: "destructive"
      })
    }
  }

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.parish?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (selectedCategory === 'all') return matchesSearch
    if (selectedCategory === 'my_groups') return matchesSearch && (group.is_owner || group.is_member)
    if (selectedCategory === 'public') return matchesSearch && group.is_public
    if (selectedCategory === 'private') return matchesSearch && !group.is_public
    
    return matchesSearch
  })

  const getGroupActionButton = (group: YouthGroup) => {
    if (group.is_owner) {
      return (
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              setSelectedGroup(group)
              setShowMemberRequests(true)
            }}
            variant="outline"
            size="lg"
            className="text-base px-4 py-2"
          >
            <Users className="h-5 w-5 mr-2" />
            Manage
          </Button>
          <NotificationBadge groupId={group.id} />
        </div>
      )
    }
    
    if (group.is_member) {
      return (
        <Button
          onClick={() => handleLeaveGroup(group.id)}
          variant="destructive"
          size="lg"
          className="text-base px-4 py-2"
        >
          <X className="h-5 w-5 mr-2" />
          Leave
        </Button>
      )
    }
    
    if (group.is_pending) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-base px-4 py-2">
          <Clock className="h-4 w-4 mr-2" />
          Pending
        </Badge>
      )
    }
    
    // For any group that's not owned by user and user is not a member
    return (
      <Button
        onClick={() => handleJoinGroup(group.id)}
        size="lg"
        className="bg-blue-600 hover:bg-blue-700 text-base px-4 py-2"
      >
        <UserPlus className="h-5 w-5 mr-2" />
        {group.requires_approval ? 'Request to Join' : 'Join Group'}
      </Button>
    )
  }

  // Fallback function to ensure a button always shows
  const getFallbackButton = (group: YouthGroup) => {
    return (
      <Button
        onClick={() => handleJoinGroup(group.id)}
        size="lg"
        className="bg-green-600 hover:bg-green-700 text-base px-4 py-2"
      >
        <UserPlus className="h-5 w-5 mr-2" />
        Join Group
      </Button>
    )
  }

  if (loading || permissionsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Youth Groups</h2>
          <p className="text-gray-600">Connect with Catholic youth in your community</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <NotificationBadge />
          <CanCreateGroups>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </CanCreateGroups>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            <SelectItem value="my_groups">My Groups</SelectItem>
            <SelectItem value="public">Public Groups</SelectItem>
            <SelectItem value="private">Private Groups</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredGroups.map((group) => (
          <Card 
            key={group.id} 
            className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer border-2 hover:border-blue-200"
            onClick={() => {
              setSelectedGroup(group)
              setShowGroupDetails(true)
            }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                    {group.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2 text-base sm:text-lg text-gray-500 mb-3">
                    <MapPin className="h-5 w-5" />
                    <span>{group.city}, {group.state}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-base sm:text-lg text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>{group.member_count || 0}/{group.max_members}</span>
                    </div>
                    <Badge variant={group.is_public ? "default" : "secondary"} className="text-sm px-3 py-1">
                      {group.is_public ? "Public" : "Private"}
                    </Badge>
                    {group.requires_approval && (
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        Approval Required
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-gray-600 text-base sm:text-lg mb-4 line-clamp-3">
                {group.description}
              </p>
              
              {group.mission_statement && (
                <p className="text-gray-500 text-sm sm:text-base mb-4 italic">
                  "{group.mission_statement}"
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="text-base sm:text-lg text-gray-500">
                  {group.age_range && (
                    <span>Ages {group.age_range}</span>
                  )}
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  {getGroupActionButton(group) || getFallbackButton(group)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "Try adjusting your search terms" : "No groups match your current filters"}
          </p>
          <CanCreateGroups>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Group
            </Button>
          </CanCreateGroups>
        </div>
      )}

      {/* Create Group Modal */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Youth Group</DialogTitle>
            <DialogDescription>
              Start a new Catholic youth group in your community
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Group Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="age_range">Age Range</Label>
                <Input
                  id="age_range"
                  value={formData.age_range}
                  onChange={(e) => setFormData(prev => ({ ...prev, age_range: e.target.value }))}
                  placeholder="e.g., 13-18, 18-25"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="mission_statement">Mission Statement</Label>
              <Textarea
                id="mission_statement"
                value={formData.mission_statement}
                onChange={(e) => setFormData(prev => ({ ...prev, mission_statement: e.target.value }))}
                rows={2}
                placeholder="What is your group's mission?"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parish">Parish</Label>
                <Input
                  id="parish"
                  value={formData.parish}
                  onChange={(e) => setFormData(prev => ({ ...prev, parish: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="diocese">Diocese</Label>
                <Input
                  id="diocese"
                  value={formData.diocese}
                  onChange={(e) => setFormData(prev => ({ ...prev, diocese: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meeting_location">Meeting Location</Label>
                <Input
                  id="meeting_location"
                  value={formData.meeting_location}
                  onChange={(e) => setFormData(prev => ({ ...prev, meeting_location: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="meeting_time">Meeting Time</Label>
                <Input
                  id="meeting_time"
                  value={formData.meeting_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, meeting_time: e.target.value }))}
                  placeholder="e.g., Sundays 6:00 PM"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max_members">Maximum Members</Label>
                <Input
                  id="max_members"
                  type="number"
                  value={formData.max_members}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_members: parseInt(e.target.value) || 50 }))}
                  min="1"
                  max="1000"
                />
              </div>
              <div className="space-y-2">
                <Label>Group Settings</Label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.is_public}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Public Group</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.requires_approval}
                      onChange={(e) => setFormData(prev => ({ ...prev, requires_approval: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Require Approval to Join</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Group
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Group Details Modal */}
      <Dialog open={Boolean(showGroupDetails && selectedGroup)} onOpenChange={setShowGroupDetails}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {selectedGroup?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {selectedGroup?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedGroup && (
            <div className="flex flex-col h-full">
              {/* Tabs */}
              <Tabs defaultValue="details" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details" className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Details</span>
                  </TabsTrigger>
                  <TabsTrigger value="members" className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Members</span>
                  </TabsTrigger>
                  <TabsTrigger value="events" className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Events</span>
                  </TabsTrigger>
                  <TabsTrigger value="posts" className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Posts</span>
                  </TabsTrigger>
                </TabsList>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto mt-4">
                  {/* Group Details Tab */}
                  <TabsContent value="details" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Info */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Group Information</h3>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <MapPin className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Location</p>
                                <p className="text-sm text-gray-600">
                                  {selectedGroup.city}, {selectedGroup.state}, {selectedGroup.country}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <Users className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Members</p>
                                <p className="text-sm text-gray-600">
                                  {selectedGroup.member_count || 0} / {selectedGroup.max_members} members
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <Calendar className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Meeting Time</p>
                                <p className="text-sm text-gray-600">
                                  {selectedGroup.meeting_time || 'Not specified'}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <Globe className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Visibility</p>
                                <p className="text-sm text-gray-600">
                                  {selectedGroup.is_public ? 'Public' : 'Private'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Additional Details */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Details</h3>
                          <div className="space-y-3">
                            {selectedGroup.age_range && (
                              <div>
                                <p className="text-sm font-medium text-gray-900">Age Range</p>
                                <p className="text-sm text-gray-600">{selectedGroup.age_range}</p>
                              </div>
                            )}
                            
                            {selectedGroup.parish && (
                              <div>
                                <p className="text-sm font-medium text-gray-900">Parish</p>
                                <p className="text-sm text-gray-600">{selectedGroup.parish}</p>
                              </div>
                            )}
                            
                            {selectedGroup.diocese && (
                              <div>
                                <p className="text-sm font-medium text-gray-900">Diocese</p>
                                <p className="text-sm text-gray-600">{selectedGroup.diocese}</p>
                              </div>
                            )}
                            
                            {selectedGroup.meeting_location && (
                              <div>
                                <p className="text-sm font-medium text-gray-900">Meeting Location</p>
                                <p className="text-sm text-gray-600">{selectedGroup.meeting_location}</p>
                              </div>
                            )}
                            
                            {selectedGroup.meeting_frequency && (
                              <div>
                                <p className="text-sm font-medium text-gray-900">Meeting Frequency</p>
                                <p className="text-sm text-gray-600">{selectedGroup.meeting_frequency}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mission Statement */}
                    {selectedGroup.mission_statement && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Mission Statement</h3>
                        <p className="text-gray-700 italic bg-gray-50 p-4 rounded-lg">
                          "{selectedGroup.mission_statement}"
                        </p>
                      </div>
                    )}

                    {/* Edit Group Button */}
                    {selectedGroup.is_owner && (
                      <div className="flex justify-end pt-4 border-t">
                        <Button 
                          onClick={() => setShowEditGroup(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Group Details
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Members Tab */}
                  <TabsContent value="members" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Group Members</h3>
                      {selectedGroup.is_owner && (
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => setShowAddMemberForm(true)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Member
                          </Button>
                          <Button 
                            onClick={() => setShowMemberRequests(true)}
                            variant="outline"
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Manage Requests
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {/* Members List */}
                    <div className="space-y-3">
                      {loadingMembers ? (
                        <div className="text-center py-8 text-gray-500">
                          <RefreshCw className="h-8 w-8 mx-auto mb-4 text-gray-300 animate-spin" />
                          <p>Loading members...</p>
                        </div>
                      ) : groupMembers.length > 0 ? (
                        <div className="space-y-2">
                          {groupMembers.map((member, index) => (
                            <div key={member.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Users className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {member.email || member.user?.email || 'Unknown User'}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {member.role || 'Member'} • {member.status || 'Active'}
                                  </p>
                                </div>
                              </div>
                              {selectedGroup?.is_owner && member.role !== 'owner' && (
                                <Button size="sm" variant="outline">
                                  <Settings className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No members found</p>
                          <p className="text-sm">Members will appear here once they join the group</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Events Tab */}
                  <TabsContent value="events" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Group Events</h3>
                      {selectedGroup.is_owner && (
                        <Button 
                          onClick={() => setShowCreateEvent(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Event
                        </Button>
                      )}
                    </div>
                    
                    {/* Events List */}
                    <div className="space-y-3">
                      {loadingEvents ? (
                        <div className="text-center py-8 text-gray-500">
                          <RefreshCw className="h-8 w-8 mx-auto mb-4 text-gray-300 animate-spin" />
                          <p>Loading events...</p>
                        </div>
                      ) : groupEvents.length > 0 ? (
                        <div className="space-y-2">
                          {groupEvents.map((event, index) => (
                            <div key={event.id || index} className="p-4 bg-gray-50 rounded-lg border">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                                  <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>{event.event_date}</span>
                                    </div>
                                    {event.event_time && (
                                      <div className="flex items-center space-x-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{event.event_time}</span>
                                      </div>
                                    )}
                                    {event.location && (
                                      <div className="flex items-center space-x-1">
                                        <MapPin className="h-3 w-3" />
                                        <span>{event.location}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No events found</p>
                          <p className="text-sm">Events will appear here once they are created</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Posts Tab */}
                  <TabsContent value="posts" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Group Posts</h3>
                      {selectedGroup.is_owner && (
                        <Button 
                          onClick={() => setShowCreatePost(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Post
                        </Button>
                      )}
                    </div>
                    
                    {/* Posts List */}
                    <div className="space-y-3">
                      {loadingPosts ? (
                        <div className="text-center py-8 text-gray-500">
                          <RefreshCw className="h-8 w-8 mx-auto mb-4 text-gray-300 animate-spin" />
                          <p>Loading posts...</p>
                        </div>
                      ) : groupPosts.length > 0 ? (
                        <div className="space-y-2">
                          {groupPosts.map((post, index) => (
                            <div key={post.id || index} className="p-4 bg-gray-50 rounded-lg border">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h4 className="font-semibold text-gray-900">{post.title}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      {post.type}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{post.content}</p>
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <Users className="h-3 w-3" />
                                      <span>{post.user?.email || 'Unknown User'}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No posts found</p>
                          <p className="text-sm">Posts will appear here once they are created</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
                <Button variant="outline" onClick={() => setShowGroupDetails(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Join Request Modal */}
      <Dialog open={(() => {
        const shouldOpen = Boolean(showGroupDetails && selectedGroup && !selectedGroup.is_owner && !selectedGroup.is_member)
        console.log('Modal condition:', {
          showGroupDetails,
          selectedGroup: selectedGroup?.name,
          is_owner: selectedGroup?.is_owner,
          is_member: selectedGroup?.is_member,
          shouldOpen
        })
        return shouldOpen
      })()} onOpenChange={setShowGroupDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join {selectedGroup?.name}</DialogTitle>
            <DialogDescription>
              {selectedGroup?.requires_approval 
                ? "Your request will be reviewed by the group leader"
                : "You will be added to the group immediately"
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedGroup?.requires_approval && (
              <div>
                <Label htmlFor="join_message">Message (Optional)</Label>
                <Textarea
                  id="join_message"
                  value={joinRequestMessage}
                  onChange={(e) => setJoinRequestMessage(e.target.value)}
                  placeholder="Tell the group leader why you want to join..."
                  rows={3}
                />
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowGroupDetails(false)}>
                Cancel
              </Button>
              <Button onClick={() => selectedGroup && submitJoinRequest(selectedGroup.id, joinRequestMessage)}>
                {selectedGroup?.requires_approval ? "Request to Join" : "Join Group"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Member Request Modal */}
      {selectedGroup && (
        <MemberRequestModal
          groupId={selectedGroup.id}
          groupName={selectedGroup.name}
          isOpen={showMemberRequests}
          onClose={() => {
            console.log('Modal onClose called, setting showMemberRequests to false')
            setShowMemberRequests(false)
          }}
          onRequestProcessed={fetchGroups}
        />
      )}

      {/* Add Member Modal */}
      <Dialog open={showAddMemberForm} onOpenChange={setShowAddMemberForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member to {selectedGroup?.name}</DialogTitle>
            <DialogDescription>
              Add a new member directly to your group
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddMember} className="space-y-4">
            <div>
              <Label htmlFor="member_email">Member Email *</Label>
              <Input
                id="member_email"
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Enter member's email address"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setShowAddMemberForm(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Member
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Group Modal */}
      <Dialog open={showEditGroup} onOpenChange={setShowEditGroup}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Group Details</DialogTitle>
            <DialogDescription>
              Update your group information
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditGroup} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_name">Group Name *</Label>
                <Input
                  id="edit_name"
                  value={editGroupForm.name}
                  onChange={(e) => setEditGroupForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit_max_members">Max Members</Label>
                <Input
                  id="edit_max_members"
                  type="number"
                  value={editGroupForm.max_members}
                  onChange={(e) => setEditGroupForm(prev => ({ ...prev, max_members: e.target.value }))}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="edit_description">Description *</Label>
                <Textarea
                  id="edit_description"
                  value={editGroupForm.description}
                  onChange={(e) => setEditGroupForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="edit_mission">Mission Statement</Label>
                <Textarea
                  id="edit_mission"
                  value={editGroupForm.mission_statement}
                  onChange={(e) => setEditGroupForm(prev => ({ ...prev, mission_statement: e.target.value }))}
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="edit_meeting_time">Meeting Time</Label>
                <Input
                  id="edit_meeting_time"
                  value={editGroupForm.meeting_time}
                  onChange={(e) => setEditGroupForm(prev => ({ ...prev, meeting_time: e.target.value }))}
                  placeholder="e.g., Every Sunday 10:00 AM"
                />
              </div>
              
              <div>
                <Label htmlFor="edit_meeting_location">Meeting Location</Label>
                <Input
                  id="edit_meeting_location"
                  value={editGroupForm.meeting_location}
                  onChange={(e) => setEditGroupForm(prev => ({ ...prev, meeting_location: e.target.value }))}
                  placeholder="e.g., Parish Hall"
                />
              </div>
              
              <div>
                <Label htmlFor="edit_age_range">Age Range</Label>
                <Input
                  id="edit_age_range"
                  value={editGroupForm.age_range}
                  onChange={(e) => setEditGroupForm(prev => ({ ...prev, age_range: e.target.value }))}
                  placeholder="e.g., 18-25"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Group Settings</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit_is_public"
                    checked={editGroupForm.is_public}
                    onChange={(e) => setEditGroupForm(prev => ({ ...prev, is_public: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="edit_is_public" className="text-sm">Public Group</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit_requires_approval"
                    checked={editGroupForm.requires_approval}
                    onChange={(e) => setEditGroupForm(prev => ({ ...prev, requires_approval: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="edit_requires_approval" className="text-sm">Requires Approval</Label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setShowEditGroup(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Event Modal */}
      <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Add a new event for {selectedGroup?.name}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="event_title">Event Title *</Label>
                <Input
                  id="event_title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Youth Group Meeting"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="event_date">Date *</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="event_time">Time *</Label>
                <Input
                  id="event_time"
                  type="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="event_location">Location</Label>
                <Input
                  id="event_location"
                  value={eventForm.location}
                  onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Parish Hall, Room 101"
                />
              </div>
              
              <div>
                <Label htmlFor="event_max_attendees">Max Attendees</Label>
                <Input
                  id="event_max_attendees"
                  type="number"
                  value={eventForm.maxAttendees}
                  onChange={(e) => setEventForm(prev => ({ ...prev, maxAttendees: e.target.value }))}
                  placeholder="Optional"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="event_description">Description *</Label>
                <Textarea
                  id="event_description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  placeholder="Describe the event, what to bring, etc."
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setShowCreateEvent(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Create Event
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Post Modal */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>
              Share an announcement or discussion with {selectedGroup?.name}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="post_title">Post Title *</Label>
                <Input
                  id="post_title"
                  value={postForm.title}
                  onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Weekly Announcements"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="post_type">Post Type</Label>
                <Select
                  value={postForm.type}
                  onValueChange={(value) => setPostForm(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="discussion">Discussion</SelectItem>
                    <SelectItem value="prayer_request">Prayer Request</SelectItem>
                    <SelectItem value="event_reminder">Event Reminder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="post_content">Content *</Label>
                <Textarea
                  id="post_content"
                  value={postForm.content}
                  onChange={(e) => setPostForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  placeholder="Share your message with the group..."
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setShowCreatePost(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Create Post
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

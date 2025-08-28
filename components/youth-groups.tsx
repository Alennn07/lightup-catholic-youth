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
import { Search, Users, MapPin, Calendar, Plus, Settings, MessageSquare, Heart, X, Edit, Trash2, Globe } from 'lucide-react'

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
  is_owner?: boolean
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
  const [showGroupDetails, setShowGroupDetails] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<YouthGroup | null>(null)
  const [loadingGroupDetails, setLoadingGroupDetails] = useState(false)
  const [showAddMemberForm, setShowAddMemberForm] = useState(false)
  const [showCreateEventForm, setShowCreateEventForm] = useState(false)
  const [showCreatePostForm, setShowCreatePostForm] = useState(false)
  const [showEditEventForm, setShowEditEventForm] = useState(false)
  const [showEditPostForm, setShowEditPostForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [editingPost, setEditingPost] = useState<any>(null)
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    max_attendees: 50,
    is_public: false
  })
  const [postFormData, setPostFormData] = useState({
    title: '',
    content: '',
    post_type: 'general',
    is_public: false
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
    is_public: true
  })

  const [isAddingMember, setIsAddingMember] = useState(false)
  const [isRemovingMember, setIsRemovingMember] = useState<string | null>(null)
  const [isEditingGroupName, setIsEditingGroupName] = useState(false)
  const [editingGroupName, setEditingGroupName] = useState('')
  const [isPageLoading, setIsPageLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchGroups()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchGroups = async () => {
    try {
      setIsPageLoading(true)
      setLoading(true)
      const token = await getAccessToken()
      if (!token) {
        console.log('❌ No access token available')
        setLoading(false)
        setIsPageLoading(false)
        return
      }

      console.log('🚀 fetchGroups started')
      const response = await fetch('/api/youth-groups', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch groups')
      }

      const data = await response.json()
      setGroups(data.groups || [])
    } catch (error: any) {
      console.error('❌ Error fetching groups:', error)
      toast({ title: "Error", description: error.message || "Failed to fetch groups", variant: "destructive" })
    } finally {
      setLoading(false)
      setIsPageLoading(false)
    }
  }

  const fetchGroupDetails = async (groupId: string) => {
    try {
      setLoadingGroupDetails(true)
      const token = await getAccessToken()
      if (!token) {
        console.log('❌ No access token available')
        setLoadingGroupDetails(false)
        return
      }

      const response = await fetch(`/api/youth-groups/${groupId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch group details')
      }

      const data = await response.json()
      
      // Update the selected group with fresh data
      setSelectedGroup(data.group)
      
      // Update the groups list with fresh data
      setGroups(prevGroups => 
        prevGroups.map(group => 
          group.id === groupId ? data.group : group
        )
      )
    } catch (error: any) {
      console.error('❌ Error fetching group details:', error)
      toast({ title: "Error", description: error.message || "Failed to fetch group details", variant: "destructive" })
    } finally {
      setLoadingGroupDetails(false)
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
      console.log('🔄 NEW CODE: Fetching group with cache-busting parameter')
      const token = await getAccessToken()
      if (!token) {
        toast({ title: "Authentication Error", description: "Please sign in to view group details.", variant: "destructive" })
        return
      }

      const response = await fetch(`/api/youth-groups/${group.id}?t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
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

  const handleKickMember = async (memberId: string) => {
    if (!selectedGroup) return
    
    setIsRemovingMember(memberId)
    
    try {
      const token = await getAccessToken()
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in again",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`/api/youth-groups/${selectedGroup.id}/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Member removed successfully",
        })
        
        // SMOOTH UPDATE: Update the UI directly instead of full refresh
        if (selectedGroup) {
          // Remove the member from the current group data
          setSelectedGroup(prev => prev ? {
            ...prev,
            members: (prev.members || []).filter(member => member.id !== memberId)
          } : null)
          
          // Update the main groups list to reflect the change
          setGroups(prev => prev.map(group => 
            group.id === selectedGroup.id 
              ? { ...group, member_count: Math.max(0, (group.member_count || 0) - 1) }
              : group
          ))
        }
        
        console.log('✅ Member removed and UI updated smoothly')
      } else {
      toast({
          title: "Error",
          description: data.error || "Failed to remove member",
          variant: "destructive",
        })
      }
          } catch (error) {
        console.error('Error removing member:', error)
        toast({
          title: "Error",
          description: "Failed to remove member",
          variant: "destructive",
        })
      } finally {
        setIsRemovingMember(null)
      }
  }

  const handleEditEvent = (event: any) => {
    setEditingEvent(event)
    setShowEditEventForm(true)
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!selectedGroup) return
    
    try {
      const token = await getAccessToken()
      if (!token) {
        toast({ title: "Authentication Error", description: "Please sign in to manage events.", variant: "destructive" })
        return
      }

      const response = await fetch(`/api/youth-groups/${selectedGroup.id}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        toast({ title: "Success", description: data.message })
        
        // SMOOTH UPDATE: Update the UI directly instead of full refresh
        if (selectedGroup) {
          // Remove the event from the current group data
          setSelectedGroup(prev => prev ? {
            ...prev,
            events: (prev.events || []).filter(event => event.id !== eventId)
          } : null)
          
          // Update the main groups list to reflect the change
          setGroups(prev => prev.map(group => 
            group.id === selectedGroup.id 
              ? { ...group }
              : group
          ))
        }
        
        console.log('✅ Event deleted and UI updated smoothly')
      } else {
        toast({ title: "Error", description: data.error || "Failed to delete event", variant: "destructive" })
      }
    } catch (error: any) {
      console.error('Error deleting event:', error)
      toast({ title: "Error", description: error.message || "Failed to delete event.", variant: "destructive" })
    }
  }

  const handleEditPost = (post: any) => {
    setEditingPost(post)
    setShowEditPostForm(true)
  }

  const handleDeletePost = async (postId: string) => {
    if (!selectedGroup) return
    
    try {
      const token = await getAccessToken()
      if (!token) {
        toast({ title: "Authentication Error", description: "Please sign in to manage posts.", variant: "destructive" })
        return
      }

      const response = await fetch(`/api/youth-groups/${selectedGroup.id}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        toast({ title: "Success", description: data.message })
        
        // SMOOTH UPDATE: Update the UI directly instead of full refresh
        if (selectedGroup) {
          // Remove the post from the current group data
          setSelectedGroup(prev => prev ? {
            ...prev,
            posts: (prev.posts || []).filter(post => post.id !== postId)
          } : null)
          
          // Update the main groups list to reflect the change
          setGroups(prev => prev.map(group => 
            group.id === selectedGroup.id 
              ? { ...group }
              : group
          ))
        }
        
        console.log('✅ Post deleted and UI updated smoothly')
      } else {
        toast({ title: "Error", description: data.error || "Failed to delete post", variant: "destructive" })
      }
    } catch (error: any) {
      console.error('Error deleting post:', error)
      toast({ title: "Error", description: error.message || "Failed to delete post.", variant: "destructive" })
    }
  }

  const handleAddMember = async () => {
    if (!newMemberEmail || !selectedGroup) return
    
    try {
      setIsAddingMember(true)
      const token = await getAccessToken()
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in again",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`/api/youth-groups/${selectedGroup.id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: newMemberEmail })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Member added successfully",
        })
        setNewMemberEmail('')
        setShowAddMemberForm(false)
        
        // SMOOTH UPDATE: Update the UI directly instead of full refresh
        if (selectedGroup) {
          // Add the new member to the current group data
          const newMember = {
            id: data.member.id,
            user_id: data.member.user_id,
            role: data.member.role,
            status: data.member.status,
            joined_at: data.member.joined_at,
            user: { email: newMemberEmail } // We'll get the full user data later
          }
          
          // Update the selected group's members list
          setSelectedGroup(prev => prev ? {
            ...prev,
            members: [...(prev.members || []), newMember]
          } : null)
          
          // Update the main groups list to reflect the change
          setGroups(prev => prev.map(group => 
            group.id === selectedGroup.id 
              ? { ...group, member_count: (group.member_count || 0) + 1 }
              : group
          ))
        }
        
        console.log('✅ Member added and UI updated smoothly')
      } else {
      toast({
          title: "Error",
          description: data.error || "Failed to add member",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error adding member:', error)
      toast({
        title: "Error",
        description: "Failed to add member",
        variant: "destructive",
      })
    } finally {
      setIsAddingMember(false)
    }
  }

  const handleCreateEvent = async () => {
    try {
      const token = await getAccessToken()
      if (!token) {
        toast({ title: "Authentication Error", description: "Please sign in to create events.", variant: "destructive" })
        return
      }

      const response = await fetch(`/api/youth-groups/${selectedGroup?.id}/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventFormData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create event')
      }

      const data = await response.json()
      toast({ title: "Success", description: data.message })
      setShowCreateEventForm(false)
      setEventFormData({
        title: '',
        description: '',
        event_date: '',
        location: '',
        max_attendees: 50,
        is_public: false
      })
      
      // SMOOTH UPDATE: Update the UI directly instead of full refresh
      if (selectedGroup) {
        // Add the new event to the current group data
        const newEvent = {
          id: data.event.id,
          title: eventFormData.title,
          description: eventFormData.description,
          event_date: eventFormData.event_date,
          location: eventFormData.location,
          max_attendees: eventFormData.max_attendees,
          is_public: eventFormData.is_public,
          created_by: user?.id,
          created_at: new Date().toISOString()
        }
        
        // Update the selected group's events list
        setSelectedGroup(prev => prev ? {
          ...prev,
          events: [...(prev.events || []), newEvent]
        } : null)
        
        console.log('✅ Event created and UI updated smoothly')
      }
    } catch (error: any) {
      console.error('Error creating event:', error)
      toast({ title: "Error", description: error.message || "Failed to create event.", variant: "destructive" })
    }
  }

  const handleCreatePost = async () => {
    try {
      const token = await getAccessToken()
      if (!token) {
        toast({ title: "Authentication Error", description: "Please sign in to create posts.", variant: "destructive" })
        return
      }

      const response = await fetch(`/api/youth-groups/${selectedGroup?.id}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postFormData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create post')
      }

      const data = await response.json()
      toast({ title: "Success", description: data.message })
      setShowCreatePostForm(false)
      setPostFormData({
        title: '',
        content: '',
        post_type: 'general',
        is_public: false
      })
      
      // SMOOTH UPDATE: Update the UI directly instead of full refresh
      if (selectedGroup) {
        // Add the new post to the current group data
        const newPost = {
          id: data.post.id,
          title: postFormData.title,
          content: postFormData.content,
          post_type: postFormData.post_type,
          is_public: postFormData.is_public,
          user_id: user?.id,
          created_at: new Date().toISOString()
        }
        
        // Update the selected group's posts list
        setSelectedGroup(prev => prev ? {
          ...prev,
          posts: [...(prev.posts || []), newPost]
        } : null)
        
        console.log('✅ Post created and UI updated smoothly')
      }
    } catch (error: any) {
      console.error('Error creating post:', error)
      toast({ title: "Error", description: error.message || "Failed to create post.", variant: "destructive" })
    }
  }

  const handleToggleEventVisibility = async (event: any) => {
    try {
      const token = await getAccessToken()
      if (!token) {
        toast({ title: "Authentication Error", description: "Please sign in to manage events.", variant: "destructive" })
        return
      }

      const response = await fetch(`/api/youth-groups/${selectedGroup?.id}/events/${event.id}/visibility`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_public: !event.is_public })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to toggle event visibility')
      }

      const data = await response.json()
      toast({ title: "Success", description: data.message })
      
      // Refresh groups
      fetchGroups()
    } catch (error: any) {
      console.error('Error toggling event visibility:', error)
      toast({ title: "Error", description: error.message || "Failed to toggle event visibility.", variant: "destructive" })
    }
  }

  const handleTogglePostVisibility = async (post: any) => {
    try {
      const token = await getAccessToken()
      if (!token) {
        toast({ title: "Authentication Error", description: "Please sign in to manage posts.", variant: "destructive" })
        return
      }

      const response = await fetch(`/api/youth-groups/${selectedGroup?.id}/posts/${post.id}/visibility`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_public: !post.is_public })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to toggle post visibility')
      }

      const data = await response.json()
      toast({ title: "Success", description: data.message })
      
      // Refresh groups
      fetchGroups()
    } catch (error: any) {
      console.error('Error toggling post visibility:', error)
      toast({ title: "Error", description: error.message || "Failed to toggle post visibility.", variant: "destructive" })
    }
  }

  const handleUpdateEvent = async () => {
    try {
      const token = await getAccessToken()
      if (!token) {
        toast({ title: "Authentication Error", description: "Please sign in to manage events.", variant: "destructive" })
        return
      }

      const response = await fetch(`/api/youth-groups/${selectedGroup?.id}/events/${editingEvent.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingEvent)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update event')
      }

      const data = await response.json()
      toast({ title: "Success", description: data.message })
      setShowEditEventForm(false)
      
      // Auto-refresh the current group details
      if (selectedGroup) {
        fetchGroupDetails(selectedGroup.id)
      }
    } catch (error: any) {
      console.error('Error updating event:', error)
      toast({ title: "Error", description: error.message || "Failed to update event.", variant: "destructive" })
    }
  }

  const handleUpdateGroupName = async () => {
    if (!selectedGroup || !editingGroupName.trim()) return
    
    try {
      const token = await getAccessToken()
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in again",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`/api/youth-groups/${selectedGroup.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: editingGroupName.trim() })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Group name updated successfully",
        })
        
        // Update the UI directly
        setSelectedGroup(prev => prev ? { ...prev, name: editingGroupName.trim() } : null)
        setGroups(prev => prev.map(group => 
          group.id === selectedGroup.id 
            ? { ...group, name: editingGroupName.trim() }
            : group
        ))
        
        setIsEditingGroupName(false)
        setEditingGroupName('')
        
        console.log('✅ Group name updated and UI refreshed smoothly')
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update group name",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating group name:', error)
      toast({
        title: "Error",
        description: "Failed to update group name",
        variant: "destructive",
      })
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

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading youth groups...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Refreshing...</p>
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
                      disabled={loadingGroupDetails}
                    >
                      {loadingGroupDetails ? (
                        <div className="animate-spin h-4 w-4 border-b-2 border-primary"></div>
                      ) : (
                        "View Details"
                      )}
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
              <div className="flex items-center gap-2">
                {isEditingGroupName ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editingGroupName}
                      onChange={(e) => setEditingGroupName(e.target.value)}
                      className="text-2xl font-bold h-10"
                      placeholder="Enter group name"
                    />
                    <Button
                      size="sm"
                      onClick={handleUpdateGroupName}
                      className="h-10"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditingGroupName(false)
                        setEditingGroupName(selectedGroup.name)
                      }}
                      className="h-10"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <DialogTitle>{selectedGroup.name}</DialogTitle>
                    {selectedGroup.is_owner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsEditingGroupName(true)
                          setEditingGroupName(selectedGroup.name)
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
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
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Members ({selectedGroup.members?.length || 0})</h4>
                  {selectedGroup.is_owner && (
                    <Button size="sm" onClick={() => setShowAddMemberForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                  )}
                </div>
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
                              {member.user?.name || member.user?.username || member.user?.email || 'Unknown User'}
                            </p>
                            {/* Debug info */}
                            <p className="text-xs text-red-500">
                              Debug: {JSON.stringify(member.user)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {member.role} • Joined {new Date(member.joined_at).toLocaleDateString()}
                  </p>
                </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={member.role === 'owner' ? 'default' : 'secondary'}>
                            {member.role}
                          </Badge>
                          {selectedGroup.is_owner && member.role !== 'owner' && (
                    <Button
                              variant="outline"
                      size="sm"
                              onClick={() => handleKickMember(member.id)}
                              disabled={isRemovingMember === member.id}
                              className="text-red-600 hover:text-red-700"
                    >
                              {isRemovingMember === member.id ? (
                                <div className="animate-spin h-4 w-4 border-b-2 border-red-500"></div>
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                    </Button>
                  )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No members found.</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="events" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Events ({selectedGroup.events?.length || 0})</h4>
                  {selectedGroup.is_member && (
                    <Button size="sm" onClick={() => setShowCreateEventForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                  )}
                </div>
                
                {/* Public Events Section */}
                {selectedGroup.events && selectedGroup.events.filter((event: any) => event.is_public).length > 0 && (
                  <div className="mb-6">
                    <h5 className="font-medium text-green-600 mb-3 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Public Events (Visible to Everyone)
                    </h5>
                    <div className="space-y-3">
                      {selectedGroup.events
                        .filter((event: any) => event.is_public)
                        .map((event: any) => (
                          <div key={event.id} className="p-3 border border-green-200 rounded-lg bg-green-50">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h6 className="font-medium">{event.title}</h6>
                                  <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                                    Public
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{event.description}</p>
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
                        ))}
                    </div>
                  </div>
                )}
                
                {/* All Group Events */}
                <div>
                  <h5 className="font-medium mb-3">Group Events</h5>
                  <div className="space-y-3">
                    {selectedGroup.events && selectedGroup.events.length > 0 ? (
                      selectedGroup.events.map((event: any) => (
                        <div key={event.id} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
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
                            <div className="flex items-center gap-2">
                              {event.is_public && (
                                <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                                  Public
                                </Badge>
                              )}
                              {(selectedGroup.is_owner || event.created_by === user?.id) && (
                                <div className="flex gap-2">
                    <Button
                                    variant="outline"
                      size="sm"
                                    onClick={() => handleToggleEventVisibility(event)}
                                    className={event.is_public ? "text-orange-600 hover:text-orange-700" : "text-blue-600 hover:text-blue-700"}
                                  >
                                    {event.is_public ? "Make Private" : "Make Public"}
                                  </Button>
                                  <Button
                      variant="outline"
                                    size="sm"
                                    onClick={() => handleEditEvent(event)}
                    >
                                    <Edit className="h-4 w-4" />
                    </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteEvent(event.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                  )}
                </div>
              </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No upcoming events.</p>
                    )}
                      </div>
                  </div>
              </TabsContent>
              
              <TabsContent value="posts" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Posts ({selectedGroup.posts?.length || 0})</h4>
                  {selectedGroup.is_member && (
                    <Button size="sm" onClick={() => setShowCreatePostForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Post
                    </Button>
                  )}
                </div>
                
                {/* Public Posts Section */}
                {selectedGroup.posts && selectedGroup.posts.filter((post: any) => post.is_public).length > 0 && (
                  <div className="mb-6">
                    <h5 className="font-medium text-green-600 mb-3 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Public Posts (Visible to Everyone)
                    </h5>
                    <div className="space-y-3">
                      {selectedGroup.posts
                        .filter((post: any) => post.is_public)
                        .map((post: any) => (
                          <div key={post.id} className="p-3 border border-green-200 rounded-lg bg-green-50">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                {post.title && (
                                  <div className="flex items-center gap-2 mb-1">
                                    <h6 className="font-medium">{post.title}</h6>
                </div>
              )}
                                <p className="text-sm text-muted-foreground mb-2">{post.content}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <MessageSquare className="h-3 w-3" />
                                    {post.post_type}
                                  </span>
                                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                  <span>by {post.user?.name || post.user?.username || post.user?.email || 'Unknown User'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
        ))}
      </div>
                  </div>
                )}
                
                {/* All Group Posts */}
                <div>
                  <h5 className="font-medium mb-3">Group Posts</h5>
                  <div className="space-y-3">
                    {selectedGroup.posts && selectedGroup.posts.length > 0 ? (
                      selectedGroup.posts.map((post: any) => (
                        <div key={post.id} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {post.title && (
                                <div className="flex items-center gap-2 mb-1">
                                  <h6 className="font-medium">{post.title}</h6>
        </div>
                              )}
                              <p className="text-sm text-muted-foreground mb-2">{post.content}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  {post.post_type}
                                </span>
                                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                <span>by {post.user?.name || post.user?.username || post.user?.email || 'Unknown User'}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {post.is_pinned && (
                                <Badge variant="outline" className="text-xs">Pinned</Badge>
                              )}
                              {post.is_public && (
                                <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                                  Public
                                </Badge>
                              )}
                              {(selectedGroup.is_owner || post.user_id === user?.id) && (
                                <div className="flex gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleTogglePostVisibility(post)}
                                    className={post.is_public ? "text-orange-600 hover:text-orange-700" : "text-blue-600 hover:text-blue-700"}
                                  >
                                    {post.is_public ? "Private" : "Public"}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditPost(post)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeletePost(post.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No posts yet.</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Member Form */}
      {showAddMemberForm && (
        <Dialog open={showAddMemberForm} onOpenChange={setShowAddMemberForm}>
          <DialogContent>
          <DialogHeader>
              <DialogTitle>Add Member</DialogTitle>
              <DialogDescription>Invite someone to join your group by email.</DialogDescription>
          </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="member_email">Email Address</Label>
                <Input
                  id="member_email"
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddMemberForm(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleAddMember()} disabled={!newMemberEmail || isAddingMember}>
                  {isAddingMember ? (
                    <div className="animate-spin h-4 w-4 border-b-2 border-primary"></div>
                  ) : (
                    "Add Member"
                  )}
                </Button>
              </div>
              </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Event Form */}
      {showCreateEventForm && (
        <Dialog open={showCreateEventForm} onOpenChange={setShowCreateEventForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
              <DialogDescription>Add a new event to your group.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="event_title">Event Title</Label>
                <Input
                  id="event_title"
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <Label htmlFor="event_description">Description</Label>
                <Textarea
                  id="event_description"
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                  placeholder="Enter event description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event_date">Event Date</Label>
                <Input
                    id="event_date"
                    type="datetime-local"
                    value={eventFormData.event_date}
                    onChange={(e) => setEventFormData({ ...eventFormData, event_date: e.target.value })}
                />
              </div>
                <div>
                  <Label htmlFor="event_location">Location</Label>
                <Input
                    id="event_location"
                    value={eventFormData.location}
                    onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
                    placeholder="Event location"
                />
              </div>
              </div>
              <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                  id="is_public_event"
                  checked={eventFormData.is_public}
                  onChange={(e) => setEventFormData({ ...eventFormData, is_public: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="is_public_event">Make this event public (anyone can attend)</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateEventForm(false)}>
                Cancel
              </Button>
                <Button onClick={() => handleCreateEvent()} disabled={!eventFormData.title || !eventFormData.description}>
                  Create Event
                </Button>
              </div>
            </div>
        </DialogContent>
      </Dialog>
      )}

      {/* Edit Event Form */}
      {showEditEventForm && editingEvent && (
        <Dialog open={showEditEventForm} onOpenChange={setShowEditEventForm}>
          <DialogContent>
          <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>Update your event details.</DialogDescription>
          </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit_event_title">Title</Label>
                <Input
                  id="edit_event_title"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  placeholder="Event title"
                />
              </div>
              <div>
                <Label htmlFor="edit_event_description">Description</Label>
                <Textarea
                  id="edit_event_description"
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  placeholder="Event description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_event_date">Event Date</Label>
                <Input
                    id="edit_event_date"
                    type="datetime-local"
                    value={editingEvent.event_date ? new Date(editingEvent.event_date).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, event_date: e.target.value })}
                />
              </div>
                <div>
                  <Label htmlFor="edit_event_location">Location</Label>
                <Input
                    id="edit_event_location"
                    value={editingEvent.location || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    placeholder="Event location"
                />
              </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit_is_public_event"
                  checked={editingEvent.is_public || false}
                  onChange={(e) => setEditingEvent({ ...editingEvent, is_public: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="edit_is_public_event">Make this event public (anyone can attend)</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditEventForm(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleUpdateEvent()} disabled={!editingEvent.title || !editingEvent.description}>
                  Update Event
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Post Form */}
      {showCreatePostForm && (
        <Dialog open={showCreatePostForm} onOpenChange={setShowCreatePostForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Post</DialogTitle>
              <DialogDescription>Share something with your group.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="post_title">Title (Optional)</Label>
                <Input
                  id="post_title"
                  value={postFormData.title}
                  onChange={(e) => setPostFormData({ ...postFormData, title: e.target.value })}
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <Label htmlFor="post_content">Content</Label>
              <Textarea
                  id="post_content"
                  value={postFormData.content}
                  onChange={(e) => setPostFormData({ ...postFormData, content: e.target.value })}
                  placeholder="What would you like to share?"
                  rows={4}
              />
            </div>
              <div>
                <Label htmlFor="post_type">Post Type</Label>
                <Select value={postFormData.post_type} onValueChange={(value) => setPostFormData({ ...postFormData, post_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="prayer">Prayer Request</SelectItem>
                    <SelectItem value="event">Event Related</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                  id="is_public_post"
                  checked={postFormData.is_public}
                  onChange={(e) => setPostFormData({ ...postFormData, is_public: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="is_public_post">Make this post public (anyone can view)</Label>
            </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreatePostForm(false)}>
                Cancel
              </Button>
                <Button onClick={() => handleCreatePost()} disabled={!postFormData.content}>
                  Create Post
                </Button>
              </div>
            </div>
        </DialogContent>
      </Dialog>
      )}
    </div>
  )
}

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
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [joinRequestMessage, setJoinRequestMessage] = useState('')

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

  const fetchGroups = async () => {
    try {
      setLoading(true)
      const token = await getAccessToken()
      if (!token) return

      const response = await fetch('/api/youth-groups', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
    // Find the group to check if it requires approval
    const group = groups.find(g => g.id === groupId)
    if (!group) return

    // If group requires approval, show modal for join request
    if (group.requires_approval) {
      setSelectedGroup(group)
      setShowGroupDetails(true)
      return
    }

    // If no approval required, join directly
    try {
      const token = await getAccessToken()
      if (!token) return

      const response = await fetch(`/api/youth-groups/${groupId}/join-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: joinRequestMessage
        })
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: data.message || "Join request submitted successfully"
        })
        setJoinRequestMessage('')
        fetchGroups()
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
            size="sm"
          >
            <Users className="h-4 w-4 mr-2" />
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
          size="sm"
        >
          <X className="h-4 w-4 mr-2" />
          Leave
        </Button>
      )
    }
    
    if (group.is_pending) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    }
    
    // For any group that's not owned by user and user is not a member
    return (
      <Button
        onClick={() => handleJoinGroup(group.id)}
        size="sm"
        className="bg-blue-600 hover:bg-blue-700"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        {group.requires_approval ? 'Request to Join' : 'Join Group'}
      </Button>
    )
  }

  // Fallback function to ensure a button always shows
  const getFallbackButton = (group: YouthGroup) => {
    return (
      <Button
        onClick={() => handleJoinGroup(group.id)}
        size="sm"
        className="bg-green-600 hover:bg-green-700"
      >
        <UserPlus className="h-4 w-4 mr-2" />
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                    {group.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{group.city}, {group.state}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{group.member_count || 0}/{group.max_members}</span>
                    </div>
                    <Badge variant={group.is_public ? "default" : "secondary"}>
                      {group.is_public ? "Public" : "Private"}
                    </Badge>
                    {group.requires_approval && (
                      <Badge variant="outline" className="text-xs">
                        Approval Required
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {group.description}
              </p>
              
              {group.mission_statement && (
                <p className="text-gray-500 text-xs mb-4 italic">
                  "{group.mission_statement}"
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {group.age_range && (
                    <span>Ages {group.age_range}</span>
                  )}
                </div>
                {getGroupActionButton(group) || getFallbackButton(group)}
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

      {/* Join Request Modal */}
      <Dialog open={showGroupDetails && selectedGroup && !selectedGroup.is_owner && !selectedGroup.is_member} onOpenChange={setShowGroupDetails}>
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
              <Button onClick={() => selectedGroup && handleJoinGroup(selectedGroup.id)}>
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
          onClose={() => setShowMemberRequests(false)}
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
    </div>
  )
}

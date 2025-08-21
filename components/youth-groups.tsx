"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2, UserPlus, CalendarDays, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function YouthGroups() {
  const [groups, setGroups] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false)
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedParish, setSelectedParish] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const [groupForm, setGroupForm] = useState({
    name: "",
    parish: "",
    address: "",
    city: "",
    age_range: "",
    meeting_day: "",
    meeting_time: "",
    description: "",
    contact_person: "",
    contact_email: "",
    contact_phone: "",
    type: [] as string[]
  })

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    event_type: "social",
    date: "",
    start_time: "",
    end_time: "",
    location: "",
    organizer: "",
    max_attendees: undefined as number | undefined,
    registration_required: false,
    cost: 0
  })

  const groupTypes = [
    "youth-ministry",
    "bible-study",
    "service",
    "social",
    "prayer",
    "music",
    "sports",
    "outreach"
  ]

  const eventTypes = [
    "youth-mass",
    "service",
    "social",
    "prayer",
    "education",
    "retreat",
    "pilgrimage",
    "other"
  ]

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ]

  // Fetch user profile and groups on component mount
  useEffect(() => {
    fetchUserProfile()
    fetchGroups()
    fetchEvents()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
        setUserProfile(profile)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  const fetchGroups = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("youth_groups")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (error) throw error
      setGroups(data || [])
    } catch (error) {
      console.error("Error fetching groups:", error)
      toast({
        title: "Error",
        description: "Failed to fetch youth groups",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast({
          title: "Error",
          description: "You must be signed in to create a group",
          variant: "destructive"
        })
        return
      }

      const groupData = {
        ...groupForm,
        created_by: session.user.id,
        members_count: 0,
        is_active: true
      }

      const { data, error } = await supabase
        .from("youth_groups")
        .insert(groupData)
        .select()
        .single()

      if (error) throw error

      setGroups([data, ...groups])
      setIsCreateGroupOpen(false)
      resetGroupForm()

      toast({
        title: "Success",
        description: "Youth group created successfully!",
        variant: "default"
      })
    } catch (error: any) {
      console.error("Error creating group:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create group",
        variant: "destructive"
      })
    }
  }

  const handleEditGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedGroup) return

    try {
      const { data, error } = await supabase
        .from("youth_groups")
        .update(groupForm)
        .eq("id", selectedGroup.id)
        .select()
        .single()

      if (error) throw error

      setGroups(groups.map(group => 
        group.id === selectedGroup.id ? data : group
      ))
      setIsEditGroupOpen(false)
      setSelectedGroup(null)
      resetGroupForm()

      toast({
        title: "Success",
        description: "Group updated successfully!",
        variant: "default"
      })
    } catch (error: any) {
      console.error("Error updating group:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update group",
        variant: "destructive"
      })
    }
  }

  const handleDeleteGroup = async (groupId: number) => {
    if (!confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
      return
    }

    try {
      const { error } = await supabase
        .from("youth_groups")
        .delete()
        .eq("id", groupId)

      if (error) throw error

      setGroups(groups.filter(group => group.id !== groupId))
      toast({
        title: "Success",
        description: "Group deleted successfully",
        variant: "default"
      })
    } catch (error: any) {
      console.error("Error deleting group:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete group",
        variant: "destructive"
      })
    }
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedGroup) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast({
          title: "Error",
          description: "You must be signed in to create an event",
          variant: "destructive"
        })
        return
      }

      const eventData = {
        ...eventForm,
        user_id: session.user.id,
        group_id: selectedGroup.id,
        current_attendees: 0,
        is_recurring: false,
        status: "upcoming"
      }

      const { data, error } = await supabase
        .from("events")
        .insert(eventData)
        .select()
        .single()

      if (error) throw error

      setEvents([data, ...events])
      setIsCreateEventOpen(false)
      resetEventForm()

      toast({
        title: "Success",
        description: "Event created successfully!",
        variant: "default"
      })
    } catch (error: any) {
      console.error("Error creating event:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive"
      })
    }
  }

  const handleJoinGroup = async (groupId: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast({
          title: "Error",
          description: "You must be signed in to join a group",
          variant: "destructive"
        })
        return
      }

      // Check if user is already a member
      const { data: existingMembership } = await supabase
        .from("group_memberships")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("group_id", groupId)
        .single()

      if (existingMembership) {
        toast({
          title: "Already a member",
          description: "You are already a member of this group",
          variant: "default"
        })
        return
      }

      // Add membership
      const { error } = await supabase
        .from("group_memberships")
        .insert({
          user_id: session.user.id,
          group_id: groupId,
          status: "approved"
        })

      if (error) throw error

      // Update group member count
      const group = groups.find(g => g.id === groupId)
      if (group) {
        setGroups(groups.map(g => 
          g.id === groupId ? { ...g, members_count: g.members_count + 1 } : g
        ))
      }

      toast({
        title: "Success",
        description: "You have joined the group successfully!",
        variant: "default"
      })
    } catch (error: any) {
      console.error("Error joining group:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to join group",
        variant: "destructive"
      })
    }
  }

  const canManageGroup = (group: any) => {
    if (!userProfile) return false
    return group.created_by === userProfile.id || 
           userProfile.role === "admin" || 
           userProfile.role === "obcc" ||
           userProfile.role === "clergy"
  }

  const canJoinGroup = (group: any) => {
    if (!userProfile) return false
    return group.parish === userProfile.parish
  }

  const resetGroupForm = () => {
    setGroupForm({
      name: "",
      parish: "",
      address: "",
      city: "",
      age_range: "",
      meeting_day: "",
      meeting_time: "",
      description: "",
      contact_person: "",
      contact_email: "",
      contact_phone: "",
      type: []
    })
  }

  const resetEventForm = () => {
    setEventForm({
      title: "",
      description: "",
      event_type: "social",
      date: "",
      start_time: "",
      end_time: "",
      location: "",
      organizer: "",
      max_attendees: undefined,
      registration_required: false,
      cost: 0
    })
  }

  const openEditGroup = (group: any) => {
    setSelectedGroup(group)
    setGroupForm({
      name: group.name,
      parish: group.parish,
      address: group.address,
      city: group.city,
      age_range: group.age_range,
      meeting_day: group.meeting_day,
      meeting_time: group.meeting_time,
      description: group.description,
      contact_person: group.contact_person,
      contact_email: group.contact_email,
      contact_phone: group.contact_phone,
      type: group.type
    })
    setIsEditGroupOpen(true)
  }

  const openCreateEvent = (group: any) => {
    setSelectedGroup(group)
    setIsCreateEventOpen(true)
  }

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesParish = selectedParish === "all" || group.parish === selectedParish
    const matchesType = selectedType === "all" || group.type.includes(selectedType)
    
    return matchesSearch && matchesParish && matchesType
  })

  const getGroupEvents = (groupId: number) => {
    return events.filter(event => event.group_id === groupId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Youth Groups</h1>
        <p className="text-lg text-gray-600">Find and join Catholic youth communities near you</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 max-w-md items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedParish} onValueChange={setSelectedParish}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Parish" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Parishes</SelectItem>
              <SelectItem value="St. Mary's">St. Mary's</SelectItem>
              <SelectItem value="St. Joseph's">St. Joseph's</SelectItem>
              <SelectItem value="St. Patrick's">St. Patrick's</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {groupTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Create Group Button */}
        {userProfile && (
          <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Youth Group</DialogTitle>
                <DialogDescription>
                  Start a new youth group in your parish
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Group Name *</Label>
                    <Input
                      id="name"
                      value={groupForm.name}
                      onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parish">Parish *</Label>
                    <Input
                      id="parish"
                      value={groupForm.parish}
                      onChange={(e) => setGroupForm({ ...groupForm, parish: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={groupForm.address}
                      onChange={(e) => setGroupForm({ ...groupForm, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={groupForm.city}
                      onChange={(e) => setGroupForm({ ...groupForm, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age_range">Age Range *</Label>
                    <Input
                      id="age_range"
                      placeholder="e.g., 13-18"
                      value={groupForm.age_range}
                      onChange={(e) => setGroupForm({ ...groupForm, age_range: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting_day">Meeting Day *</Label>
                    <Select
                      value={groupForm.meeting_day}
                      onValueChange={(value) => setGroupForm({ ...groupForm, meeting_day: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map(day => (
                          <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting_time">Meeting Time *</Label>
                    <Input
                      id="meeting_time"
                      type="time"
                      value={groupForm.meeting_time}
                      onChange={(e) => setGroupForm({ ...groupForm, meeting_time: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_person">Contact Person *</Label>
                    <Input
                      id="contact_person"
                      value={groupForm.contact_person}
                      onChange={(e) => setGroupForm({ ...groupForm, contact_person: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Contact Email *</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={groupForm.contact_email}
                      onChange={(e) => setGroupForm({ ...groupForm, contact_email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Contact Phone *</Label>
                    <Input
                      id="contact_phone"
                      value={groupForm.contact_phone}
                      onChange={(e) => setGroupForm({ ...groupForm, contact_phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={groupForm.description}
                    onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Group Type *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {groupTypes.map(type => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={groupForm.type.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setGroupForm({ ...groupForm, type: [...groupForm.type, type] })
                            } else {
                              setGroupForm({ ...groupForm, type: groupForm.type.filter(t => t !== type) })
                            }
                          }}
                        />
                        <span className="text-sm">{type.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateGroupOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Group</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {group.parish} • {group.city}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  {canManageGroup(group) && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditGroup(group)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGroup(group.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700">{group.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{group.members_count} members</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{group.meeting_day}s at {group.meeting_time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{group.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Ages {group.age_range}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {group.type.map((type: string) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    Contact: {group.contact_person}
                  </p>
                  <p className="text-sm text-gray-600">
                    {group.contact_email}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  {canJoinGroup(group) && (
                    <Button
                      size="sm"
                      onClick={() => handleJoinGroup(group.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Join
                    </Button>
                  )}
                  
                  {canManageGroup(group) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openCreateEvent(group)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Event
                    </Button>
                  )}
                </div>
              </div>

              {/* Group Events */}
              {getGroupEvents(group.id).length > 0 && (
                <div className="border-t pt-3">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    Upcoming Events
                  </h4>
                  <div className="space-y-2">
                    {getGroupEvents(group.id).slice(0, 3).map((event) => (
                      <div key={event.id} className="text-xs bg-gray-50 p-2 rounded">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-gray-600">
                          {new Date(event.date).toLocaleDateString()} • {event.start_time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Edit Group Dialog */}
      <Dialog open={isEditGroupOpen} onOpenChange={setIsEditGroupOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Youth Group</DialogTitle>
            <DialogDescription>
              Update the group information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditGroup} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Group Name *</Label>
                <Input
                  id="edit-name"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-parish">Parish *</Label>
                <Input
                  id="edit-parish"
                  value={groupForm.parish}
                  onChange={(e) => setGroupForm({ ...groupForm, parish: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address *</Label>
                <Input
                  id="edit-address"
                  value={groupForm.address}
                  onChange={(e) => setGroupForm({ ...groupForm, address: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-city">City *</Label>
                <Input
                  id="edit-city"
                  value={groupForm.city}
                  onChange={(e) => setGroupForm({ ...groupForm, city: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-age-range">Age Range *</Label>
                <Input
                  id="edit-age-range"
                  value={groupForm.age_range}
                  onChange={(e) => setGroupForm({ ...groupForm, age_range: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-meeting-day">Meeting Day *</Label>
                <Select
                  value={groupForm.meeting_day}
                  onValueChange={(value) => setGroupForm({ ...groupForm, meeting_day: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map(day => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-meeting-time">Meeting Time *</Label>
                <Input
                  id="edit-meeting-time"
                  type="time"
                  value={groupForm.meeting_time}
                  onChange={(e) => setGroupForm({ ...groupForm, meeting_time: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contact-person">Contact Person *</Label>
                <Input
                  id="edit-contact-person"
                  value={groupForm.contact_person}
                  onChange={(e) => setGroupForm({ ...groupForm, contact_person: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contact-email">Contact Email *</Label>
                <Input
                  id="edit-contact-email"
                  type="email"
                  value={groupForm.contact_email}
                  onChange={(e) => setGroupForm({ ...groupForm, contact_email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contact-phone">Contact Phone *</Label>
                <Input
                  id="edit-contact-phone"
                  value={groupForm.contact_phone}
                  onChange={(e) => setGroupForm({ ...groupForm, contact_phone: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                value={groupForm.description}
                onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Group Type *</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {groupTypes.map(type => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={groupForm.type.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setGroupForm({ ...groupForm, type: [...groupForm.type, type] })
                        } else {
                          setGroupForm({ ...groupForm, type: groupForm.type.filter(t => t !== type) })
                        }
                      }}
                    />
                    <span className="text-sm">{type.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditGroupOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Group</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Add an event for {selectedGroup?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-title">Event Title *</Label>
                <Input
                  id="event-title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-type">Event Type *</Label>
                <Select
                  value={eventForm.event_type}
                  onValueChange={(value) => setEventForm({ ...eventForm, event_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-date">Date *</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-start-time">Start Time *</Label>
                <Input
                  id="event-start-time"
                  type="time"
                  value={eventForm.start_time}
                  onChange={(e) => setEventForm({ ...eventForm, start_time: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-end-time">End Time *</Label>
                <Input
                  id="event-end-time"
                  type="time"
                  value={eventForm.end_time}
                  onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-location">Location *</Label>
                <Input
                  id="event-location"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-organizer">Organizer *</Label>
                <Input
                  id="event-organizer"
                  value={eventForm.organizer}
                  onChange={(e) => setEventForm({ ...eventForm, organizer: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-max-attendees">Max Attendees</Label>
                <Input
                  id="event-max-attendees"
                  type="number"
                  value={eventForm.max_attendees || ""}
                  onChange={(e) => setEventForm({ ...eventForm, max_attendees: e.target.value ? parseInt(e.target.value) : undefined })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-cost">Cost</Label>
                <Input
                  id="event-cost"
                  type="number"
                  step="0.01"
                  value={eventForm.cost}
                  onChange={(e) => setEventForm({ ...eventForm, cost: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-description">Description *</Label>
              <Textarea
                id="event-description"
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="registration-required"
                checked={eventForm.registration_required}
                onChange={(e) => setEventForm({ ...eventForm, registration_required: e.target.checked })}
              />
              <Label htmlFor="registration-required">Registration Required</Label>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateEventOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

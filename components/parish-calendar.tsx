"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label as UILable } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, MapPin, Users, Filter, ChevronLeft, ChevronRight, Plus, Trash2, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClientComponentClient } from "@supabase/ssr"
import type { Event as EventType } from "@/lib/database"

type Event = {
  id: number
  title: string
  date: Date
  startTime: string
  endTime: string
  location: string
  description: string
  category: string
  organizer: string
  groupId: number
  user_id?: string
}

type UserRole = "user" | "group-leader" | "obcc" | "clergy" | "admin" | null

const eventCategories = [
  { name: "All Events", value: "all" },
  { name: "Youth Mass", value: "youth-mass" },
  { name: "Service Project", value: "service" },
  { name: "Social Event", value: "social" },
  { name: "Prayer Group", value: "prayer" },
  { name: "Bible Study", value: "bible-study" },
  { name: "Retreat", value: "retreat" },
]

const categoryColors: Record<string, string> = {
  "youth-mass": "bg-blue-100 text-blue-800 border-blue-200",
  service: "bg-green-100 text-green-800 border-green-200",
  social: "bg-purple-100 text-purple-800 border-purple-200",
  prayer: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "bible-study": "bg-orange-100 text-orange-800 border-orange-200",
  retreat: "bg-red-100 text-red-800 border-red-200",
}

export default function ParishCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [isEditEventOpen, setIsEditEventOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date(),
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    category: "social",
    organizer: "",
    groupId: 1,
  })

  const [editEvent, setEditEvent] = useState({
    title: "",
    date: new Date(),
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    category: "social",
    organizer: "",
    groupId: 1,
  })

  // Fetch user authentication and role
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUserId(session.user.id)
          
          // Get user profile to determine role
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("role")
            .eq("id", session.user.id)
            .single()
          
          setUserRole(profile?.role || "user")
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    fetchUser()
  }, [supabase.auth])

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/events")
        if (response.ok) {
          const data = await response.json()
          // Convert date strings to Date objects
          const eventsWithDates = data.map((event: any) => ({
            ...event,
            date: new Date(event.date),
            startTime: event.start_time,
            endTime: event.end_time,
            category: event.event_type,
            groupId: event.group_id || 1
          }))
          setEvents(eventsWithDates)
        } else {
          console.error("Failed to fetch events")
        }
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const isDayWithEvent = (day: Date) => {
    return events.some(
      (event) =>
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear(),
    )
  }

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        event_type: newEvent.category,
        date: newEvent.date.toISOString().split('T')[0],
        start_time: newEvent.startTime,
        end_time: newEvent.endTime,
        location: newEvent.location,
        organizer: newEvent.organizer,
        group_id: newEvent.groupId,
        cost: 0,
        registration_required: false,
        current_attendees: 0,
        is_recurring: false,
        status: "upcoming"
      }

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })

      if (response.ok) {
        const newEventData = await response.json()
        const eventToAdd: Event = {
          id: newEventData.id,
          title: newEventData.title,
          date: new Date(newEventData.date),
          startTime: newEventData.start_time,
          endTime: newEventData.end_time,
          location: newEventData.location,
          description: newEventData.description,
          category: newEventData.event_type,
          organizer: newEventData.organizer,
          groupId: newEventData.group_id || 1,
          user_id: newEventData.user_id
        }

        setEvents([...events, eventToAdd])
        setIsAddEventOpen(false)

        toast({
          title: "Event Added",
          description: "Your event has been successfully added to the calendar.",
          variant: "default",
        })

        // Reset form
        setNewEvent({
          title: "",
          date: new Date(),
          startTime: "",
          endTime: "",
          location: "",
          description: "",
          category: "social",
          organizer: "",
          groupId: 1,
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to create event",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setEvents(events.filter((event) => event.id !== eventId))
        setSelectedEvent(null)

        toast({
          title: "Event Deleted",
          description: "The event has been removed from the calendar.",
          variant: "default",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete event",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedEvent) return

    try {
      const eventData = {
        title: editEvent.title,
        description: editEvent.description,
        event_type: editEvent.category,
        date: editEvent.date.toISOString().split('T')[0],
        start_time: editEvent.startTime,
        end_time: editEvent.endTime,
        location: editEvent.location,
        organizer: editEvent.organizer,
        group_id: editEvent.groupId,
      }

      const response = await fetch(`/api/events/${selectedEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })

      if (response.ok) {
        const updatedEventData = await response.json()
        const updatedEvent: Event = {
          id: updatedEventData.id,
          title: updatedEventData.title,
          date: new Date(updatedEventData.date),
          startTime: updatedEventData.start_time,
          endTime: updatedEventData.end_time,
          location: updatedEventData.location,
          description: updatedEventData.description,
          category: updatedEventData.event_type,
          organizer: updatedEventData.organizer,
          groupId: updatedEventData.group_id || 1,
          user_id: updatedEventData.user_id
        }

        setEvents(events.map(event => 
          event.id === selectedEvent.id ? updatedEvent : event
        ))
        setIsEditEventOpen(false)
        setSelectedEvent(null)

        toast({
          title: "Event Updated",
          description: "Your event has been successfully updated.",
          variant: "default",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to update event",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating event:", error)
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const canEditEvent = (event: Event) => {
    if (!userId) return false
    
    // User owns the event
    if (event.user_id === userId) return true
    
    // Admin/OBCC members can edit any event
    if (userRole === "obcc" || userRole === "admin") return true
    
    // Clergy can edit any event
    if (userRole === "clergy") return true
    
    // Group leaders can edit events from their group
    if (userRole === "group-leader" && event.groupId === 1) return true
    
    return false
  }

  const canDeleteEvent = (event: Event) => {
    if (!userId) return false
    
    // User owns the event
    if (event.user_id === userId) return true
    
    // Admin/OBCC members can delete any event
    if (userRole === "obcc" || userRole === "admin") return true
    
    // Clergy can delete any event
    if (userRole === "clergy") return true
    
    // Group leaders can delete events from their group
    if (userRole === "group-leader" && event.groupId === 1) return true
    
    return false
  }

  const openEditDialog = (event: Event) => {
    setSelectedEvent(event)
    setEditEvent({
      title: event.title,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      description: event.description,
      category: event.category,
      organizer: event.organizer,
      groupId: event.groupId,
    })
    setIsEditEventOpen(true)
  }

  const filteredEvents = events.filter((event) => {
    if (selectedCategory !== "all" && event.category !== selectedCategory) {
      return false
    }
    return true
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
            <CalendarIcon className="h-6 w-6" />
            Parish Calendar
          </h2>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
          <CalendarIcon className="h-6 w-6" />
          Parish Calendar
        </h2>
        {userId && (userRole === "group-leader" || userRole === "obcc" || userRole === "clergy" || userRole === "admin") && (
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Create a new event for your youth group. This will be visible to all users.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddEvent} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <UILable htmlFor="event-title">Event Title</UILable>
                  <Input
                    id="event-title"
                    placeholder="Enter event title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <UILable htmlFor="start-time">Start Time</UILable>
                    <Input
                      id="start-time"
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <UILable htmlFor="end-time">End Time</UILable>
                    <Input
                      id="end-time"
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <UILable htmlFor="event-location">Location</UILable>
                  <Input
                    id="event-location"
                    placeholder="Enter event location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <UILable htmlFor="event-description">Description</UILable>
                  <Textarea
                    id="event-description"
                    placeholder="Enter event description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <UILable htmlFor="event-category">Category</UILable>
                    <Select
                      value={newEvent.category}
                      onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventCategories.slice(1).map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <UILable htmlFor="event-organizer">Organizer</UILable>
                    <Input
                      id="event-organizer"
                      placeholder="Enter organizer name"
                      value={newEvent.organizer}
                      onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddEventOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Event</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filter and Calendar Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {eventCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const prevMonth = new Date(currentMonth)
              prevMonth.setMonth(prevMonth.getMonth() - 1)
              setCurrentMonth(prevMonth)
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const nextMonth = new Date(currentMonth)
              nextMonth.setMonth(nextMonth.getMonth() + 1)
              setCurrentMonth(nextMonth)
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>
                Click on a date to view events or add new ones.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                modifiers={{
                  event: isDayWithEvent,
                }}
                modifiersStyles={{
                  event: {
                    backgroundColor: "#8b5cf6",
                    color: "white",
                    borderRadius: "50%",
                  },
                }}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
              <CardDescription>
                {date ? `Events on ${date.toLocaleDateString()}` : "All upcoming events"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No events found.</p>
              ) : (
                <div className="space-y-3">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600">{event.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{event.startTime} - {event.endTime}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge className={categoryColors[event.category] || "bg-gray-100 text-gray-800"}>
                            {event.category}
                          </Badge>
                          {(canEditEvent(event) || canDeleteEvent(event)) && (
                            <div className="flex items-center gap-1 ml-2">
                              {canEditEvent(event) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openEditDialog(event)
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              )}
                              {canDeleteEvent(event) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteEvent(event.id)
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
              <DialogDescription>
                Event details and information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Description</h4>
                <p className="text-gray-600">{selectedEvent.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Date</h4>
                  <p className="text-gray-600">{selectedEvent.date.toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Time</h4>
                  <p className="text-gray-600">{selectedEvent.startTime} - {selectedEvent.endTime}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Location</h4>
                  <p className="text-gray-600">{selectedEvent.location}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Organizer</h4>
                  <p className="text-gray-600">{selectedEvent.organizer}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={categoryColors[selectedEvent.category] || "bg-gray-100 text-gray-800"}>
                  {selectedEvent.category}
                </Badge>
              </div>
              <div className="flex justify-end gap-2">
                {(canEditEvent(selectedEvent) || canDeleteEvent(selectedEvent)) && (
                  <>
                    {canEditEvent(selectedEvent) && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          openEditDialog(selectedEvent)
                          setSelectedEvent(null)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                    {canDeleteEvent(selectedEvent) && (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleDeleteEvent(selectedEvent.id)
                          setSelectedEvent(null)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </>
                )}
                <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Event Dialog */}
      <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the event information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditEvent} className="space-y-4 mt-4">
            <div className="space-y-2">
              <UILable htmlFor="edit-event-title">Event Title</UILable>
              <Input
                id="edit-event-title"
                placeholder="Enter event title"
                value={editEvent.title}
                onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <UILable htmlFor="edit-start-time">Start Time</UILable>
                <Input
                  id="edit-start-time"
                  type="time"
                  value={editEvent.startTime}
                  onChange={(e) => setEditEvent({ ...editEvent, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <UILable htmlFor="edit-end-time">End Time</UILable>
                <Input
                  id="edit-end-time"
                  type="time"
                  value={editEvent.startTime}
                  onChange={(e) => setEditEvent({ ...editEvent, endTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <UILable htmlFor="edit-event-location">Location</UILable>
              <Input
                id="edit-event-location"
                placeholder="Enter event location"
                value={editEvent.location}
                onChange={(e) => setEditEvent({ ...editEvent, location: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <UILable htmlFor="edit-event-description">Description</UILable>
              <Textarea
                id="edit-event-description"
                placeholder="Enter event description"
                value={editEvent.description}
                onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <UILable htmlFor="edit-event-category">Category</UILable>
                <Select
                  value={editEvent.category}
                  onValueChange={(value) => setEditEvent({ ...editEvent, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventCategories.slice(1).map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <UILable htmlFor="edit-event-organizer">Organizer</UILable>
                <Input
                  id="edit-event-organizer"
                  placeholder="Enter organizer name"
                  value={editEvent.organizer}
                  onChange={(e) => setEditEvent({ ...editEvent, organizer: e.target.value })}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditEventOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

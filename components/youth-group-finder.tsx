"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Clock, Phone, Mail, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface YouthGroup {
  id: number
  name: string
  parish: string
  address: string
  city: string
  age_range: string
  meeting_day: string
  meeting_time: string
  description: string
  contact_person: string
  contact_email: string
  contact_phone: string
  type: string[]
  members_count: number
}

export function YouthGroupFinder() {
  const [groups, setGroups] = useState<YouthGroup[]>([])
  const [filteredGroups, setFilteredGroups] = useState<YouthGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAgeRange, setSelectedAgeRange] = useState("All Ages")
  const [selectedType, setSelectedType] = useState("All Types")
  const { toast } = useToast()

  const ageRanges = ["All Ages", "13-17", "14-18", "15-19", "18-22", "18-25"]
  const groupTypes = [
    "All Types",
    "Prayer",
    "Service",
    "Social",
    "Bible Study",
    "Adoration",
    "Outreach",
    "Faith Formation",
    "Music",
    "Study Groups",
    "Retreats",
    "Social Justice",
    "Fellowship",
  ]

  const fetchGroups = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (selectedAgeRange !== "All Ages") params.append("ageRange", selectedAgeRange)
      if (selectedType !== "All Types") params.append("type", selectedType)

      const response = await fetch(`/api/youth-groups?${params}`)
      if (!response.ok) throw new Error("Failed to fetch groups")

      const data = await response.json()
      setGroups(data)
      setFilteredGroups(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load youth groups",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [searchTerm, selectedAgeRange, selectedType])

  const handleJoinRequest = (groupId: number, groupName: string) => {
    toast({
      title: "Join request sent",
      description: `Your request to join ${groupName} has been sent to the group leader.`,
    })
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Prayer: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      Service: "bg-green-500/20 text-green-300 border-green-500/30",
      Social: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      "Bible Study": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      Adoration: "bg-pink-500/20 text-pink-300 border-pink-500/30",
      Outreach: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      "Faith Formation": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      Music: "bg-red-500/20 text-red-300 border-red-500/30",
    }
    return colors[type] || "bg-gray-500/20 text-gray-300 border-gray-500/30"
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-amber-50 via-white to-rose-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full mb-4 shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Find Youth Groups</h1>
            <p className="text-lg text-gray-600">Discover Catholic youth communities near you</p>
          </div>

          {/* Loading Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-3 mb-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
                  <div className="h-10 bg-gray-200 rounded-xl w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 via-white to-rose-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full mb-4 shadow-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Find Youth Groups</h1>
          <p className="text-lg text-gray-600">Discover Catholic youth communities near you</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search groups, parishes, or cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-amber-400 focus:ring-amber-400"
              />
            </div>
            <Select value={selectedAgeRange} onValueChange={setSelectedAgeRange}>
              <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-amber-400 focus:ring-amber-400">
                <SelectValue placeholder="All Ages" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {ageRanges.map((range) => (
                  <SelectItem key={range} value={range} className="text-gray-900">
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-amber-400 focus:ring-amber-400">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {groupTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-gray-900">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Groups List */}
        <div className="space-y-6">
          {filteredGroups.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">No youth groups found</p>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-xl mb-2">{group.name}</h3>
                    <p className="text-amber-600 font-medium text-lg mb-2">{group.parish}</p>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 text-amber-500" />
                      {group.address}, {group.city}
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-amber-400 to-rose-500 text-white border-0 px-3 py-1 text-sm font-medium">
                    {group.age_range}
                  </Badge>
                </div>

                <p className="text-gray-700 text-base leading-relaxed mb-4">{group.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {group.type.map((type) => (
                    <Badge key={type} className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
                      {type}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">
                      {group.meeting_day}s, {group.meeting_time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">{group.members_count} members</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <span className="font-semibold">Contact:</span>
                    <span className="text-gray-800">{group.contact_person}</span>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={`mailto:${group.contact_email}`}
                      className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors font-medium"
                    >
                      <Mail className="h-4 w-4" />
                      {group.contact_email}
                    </a>
                    <a
                      href={`tel:${group.contact_phone}`}
                      className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors font-medium"
                    >
                      <Phone className="h-4 w-4" />
                      {group.contact_phone}
                    </a>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => handleJoinRequest(group.id, group.name)}
                    className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Request to Join
                  </Button>
                  <Button
                    variant="outline"
                    className="border-amber-300 text-amber-600 hover:bg-amber-50 hover:border-amber-400 font-semibold px-6 py-2 rounded-xl"
                    onClick={() =>
                      window.open(`mailto:${group.contact_email}?subject=Inquiry about ${group.name}`, "_blank")
                    }
                  >
                    Contact
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

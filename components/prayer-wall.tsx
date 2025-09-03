"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, Plus, Send, Users, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { formatDistanceToNow } from "date-fns"
import { logIfEnabled } from "@/lib/performance-monitor"
import { useTranslation } from "@/lib/i18n"
import { PrayerWallImageUpload } from "@/components/image-upload"

interface PrayerRequest {
  id: string  // Changed from number to string (UUID)
  user_id: string
  name: string
  request: string
  category: string
  is_anonymous: boolean
  prayer_count: number
  created_at: string
  user?: {
    name: string
    avatar_url?: string
  }
}

export function PrayerWall() {
  const { t } = useTranslation()
  const [requests, setRequests] = useState<PrayerRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    request: "",
    category: "",
    isAnonymous: false,
    imageUrl: "",
  })
  const { toast } = useToast()
  const { user, getAccessToken } = useAuth()

  const categories = ["Health", "Family", "Education", "Work", "Spiritual", "Other"]

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/prayer-requests")
      if (!response.ok) throw new Error("Failed to fetch requests")
      const data = await response.json()
      setRequests(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load prayer requests",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a prayer request",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Get the current access token
      const accessToken = await getAccessToken()
      if (!accessToken) {
        throw new Error('No access token available')
      }

      const response = await fetch("/api/prayer-requests", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: formData.isAnonymous ? "Anonymous" : formData.name || user.name,
          request: formData.request,
          category: formData.category,
          is_anonymous: formData.isAnonymous,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit request")
      }

      const newRequest = await response.json()
      setRequests([newRequest, ...requests])
      setFormData({ name: "", request: "", category: "", isAnonymous: false, imageUrl: "" })
      setShowForm(false)

      toast({
        title: "Prayer request submitted",
        description: "Your request has been added to the prayer wall",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit prayer request",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePray = async (requestId: string) => {
    try {
      // Get the current access token
      const accessToken = await getAccessToken()
      if (!accessToken) {
        throw new Error('No access token available')
      }

      const response = await fetch(`/api/prayer-requests/${requestId}/pray`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update prayer count")
      }

      const { prayerCount } = await response.json()
      logIfEnabled(`🔄 API Response - prayerCount: ${prayerCount}`)
      logIfEnabled(`🔄 Current requests state: ${JSON.stringify(requests.map(req => ({ id: req.id, prayer_count: req.prayer_count })))}`)
      logIfEnabled(`🔄 Updating request ID: ${requestId}`)

      setRequests(requests.map((req) => {
        if (req.id === requestId) {
          logIfEnabled(`🔄 Updating request: ${req.id} from ${req.prayer_count} to ${prayerCount}`)
          return { ...req, prayer_count: prayerCount }
        }
        return req
      }))

      logIfEnabled(`🔄 State updated, new requests: ${JSON.stringify(requests.map(req => ({ id: req.id, prayer_count: req.prayer_count })))}`)

      toast({
        title: "Prayer added",
        description: "Thank you for praying for this request",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add prayer",
        variant: "destructive",
      })
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Health: "bg-red-500/20 text-red-300 border-red-500/30",
      Family: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      Education: "bg-green-500/20 text-green-300 border-green-500/30",
      Work: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      Spiritual: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      Other: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    }
    return colors[category] || colors.Other
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-amber-50 via-white to-rose-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full mb-4 shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Prayer Wall</h1>
            <p className="text-lg text-gray-600">Share your prayer requests and pray for others</p>
          </div>

          {/* Loading Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Prayer Wall</h1>
          <p className="text-lg text-gray-600">Share your prayer requests and pray for others</p>
        </div>

        {/* Add Request Button */}
        <div className="text-center mb-8">
          <Button
            onClick={() => setShowForm(!showForm)}
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Prayer Request
          </Button>
        </div>
        {/* Prayer Request Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Share Your Prayer Request</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onCheckedChange={(checked) => setFormData({ ...formData, isAnonymous: checked as boolean })}
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700 font-medium">
                  Submit anonymously
                </label>
              </div>

              {!formData.isAnonymous && (
                <Input
                  placeholder="Your name (optional)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-amber-400 focus:ring-amber-400"
                />
              )}

              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-amber-400 focus:ring-amber-400">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-gray-900">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Share your prayer request..."
                value={formData.request}
                onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-amber-400 focus:ring-amber-400 min-h-[120px] resize-none"
                required
              />

              {/* Image Upload Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Prayer Image (Optional)
                </label>
                <PrayerWallImageUpload
                  onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
                  onError={(error) => {
                    toast({
                      title: "Upload failed",
                      description: error,
                      variant: "destructive",
                    })
                  }}
                  className="max-w-md"
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={formData.imageUrl}
                      alt="Prayer image preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">Image uploaded successfully</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.request.trim() || !formData.category}
                  className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500 bg-white font-medium px-6 py-2 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Prayer Requests List */}
        <div className="space-y-6">
          {requests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">No prayer requests yet</p>
              <p className="text-gray-500">Be the first to share a request</p>
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-amber-400 to-rose-500 text-white text-sm font-semibold">
                        {request.is_anonymous ? "?" : (request.user?.name || request.name).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {request.is_anonymous ? "Anonymous" : request.user?.name || request.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4 text-amber-500" />
                        {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 px-3 py-1">
                    {request.category}
                  </Badge>
                </div>

                <p className="text-gray-700 text-base leading-relaxed mb-4">{request.request}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">
                      {request.prayer_count} {request.prayer_count === 1 ? "person" : "people"} prayed
                    </span>
                  </div>
                  <Button
                    onClick={() => handlePray(request.id)}
                    size="sm"
                    variant="ghost"
                    className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-medium"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Pray
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

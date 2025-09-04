"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BookOpen, Plus, Search, Edit, Trash2, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { format, formatDistanceToNow, isAfter, subDays } from "date-fns"
import { JournalImageUpload } from "@/components/image-upload"

interface JournalEntry {
  id: string
  user_id: string
  title: string
  content: string
  mood: string
  tags: string[]
  entry_date: string
  created_at: string
  updated_at: string
  image_urls?: string[]
}

export function FaithJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mood: "",
    tags: "",
    date: new Date().toISOString().split("T")[0],
    entry_date: new Date().toISOString().split("T")[0],
    imageUrls: [] as string[],
  })
  const { toast } = useToast()
  const { user } = useAuth()

  const moods = [
    { value: "joyful", label: "Joyful", icon: "😊", color: "text-yellow-400" },
    { value: "peaceful", label: "Peaceful", icon: "😌", color: "text-blue-400" },
    { value: "grateful", label: "Grateful", icon: "🙏", color: "text-green-400" },
    { value: "hopeful", label: "Hopeful", icon: "✨", color: "text-purple-400" },
    { value: "contemplative", label: "Contemplative", icon: "🤔", color: "text-indigo-400" },
    { value: "struggling", label: "Struggling", icon: "😔", color: "text-orange-400" },
    { value: "anxious", label: "Anxious", icon: "😰", color: "text-red-400" },
    { value: "sad", label: "Sad", icon: "😢", color: "text-muted-foreground" },
  ]

  const fetchEntries = async () => {
    if (!user) return

    try {
      const params = new URLSearchParams({ userId: user.id })
      if (searchTerm) params.append("search", searchTerm)

      const response = await fetch(`/api/journal?${params}`)
      if (!response.ok) throw new Error("Failed to fetch entries")

      const data = await response.json()
      setEntries(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load journal entries",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchEntries()
    }
  }, [user, searchTerm])

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      mood: "",
      tags: "",
      date: new Date().toISOString().split("T")[0],
      entry_date: new Date().toISOString().split("T")[0],
      imageUrls: [],
    })
    setEditingEntry(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    try {
      const entryData = {
        user_id: user.id,
        title: formData.title,
        content: formData.content,
        mood: formData.mood,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        date: formData.date,
        image_urls: formData.imageUrls,
      }

      let response
      if (editingEntry) {
        response = await fetch(`/api/journal/${editingEntry.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entryData),
        })
      } else {
        response = await fetch("/api/journal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entryData),
        })
      }

      if (!response.ok) throw new Error("Failed to save entry")

      const savedEntry = await response.json()

      if (editingEntry) {
        setEntries(entries.map((entry) => (entry.id === editingEntry.id ? savedEntry : entry)))
        toast({
          title: "Entry updated",
          description: "Your journal entry has been updated successfully",
        })
      } else {
        setEntries([savedEntry, ...entries])
        toast({
          title: "Entry saved",
          description: "Your journal entry has been saved successfully",
        })
      }

      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save journal entry",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry)
    setFormData({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags.join(", "),
      date: entry.entry_date,
      entry_date: entry.entry_date,
      imageUrls: entry.image_urls || [],
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (entryId: string) => {
    try {
      const response = await fetch(`/api/journal/${entryId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete entry")

      setEntries(entries.filter((entry) => entry.id !== entryId))
      toast({
        title: "Entry deleted",
        description: "Your journal entry has been deleted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete journal entry",
        variant: "destructive",
      })
    }
  }

  const getMoodInfo = (mood: string) => {
    return moods.find((m) => m.value === mood) || moods[0]
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const cutoffDate = subDays(new Date(), 15)
    
    if (isAfter(date, cutoffDate)) {
      return formatDistanceToNow(date, { addSuffix: true })
    } else {
      return format(date, "MMM dd, yyyy")
    }
  }

  if (!user) {
    return (
      <div className="bg-gradient-to-br from-amber-50/50 via-background to-rose-50/50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full mb-4 shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Faith Journal</h1>
            <p className="text-lg text-gray-600">Reflect on your faith journey</p>
          </div>

          {/* Sign In Required */}
          <div className="bg-card rounded-2xl shadow-lg border border-border p-8 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-4">Please sign in to access your faith journal</p>
            <Button className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-semibold px-6 py-2 rounded-xl">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-amber-50/50 via-background to-rose-50/50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full mb-4 shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Faith Journal</h1>
            <p className="text-lg text-muted-foreground">Reflect on your faith journey</p>
          </div>

          {/* Loading Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-card rounded-2xl shadow-lg border border-border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-3 flex-1">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-5 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="h-7 bg-muted rounded w-20"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-amber-50/50 via-background to-rose-50/50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full mb-4 shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Faith Journal</h1>
          <p className="text-lg text-muted-foreground">Reflect on your faith journey</p>
        </div>

        {/* New Entry Button */}
        <div className="text-center mb-8">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Journal Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border text-foreground max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-foreground">{editingEntry ? "Edit Journal Entry" : "New Journal Entry"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pb-4">
                <Input
                  placeholder="Entry title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-amber-400 focus:ring-amber-400"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select value={formData.mood} onValueChange={(value) => setFormData({ ...formData, mood: value })}>
                    <SelectTrigger className="bg-muted border-border text-foreground focus:bg-background focus:border-amber-400 focus:ring-amber-400">
                      <SelectValue placeholder="How are you feeling?" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      {moods.map((mood) => (
                        <SelectItem key={mood.value} value={mood.value} className="text-foreground">
                          <span className="flex items-center gap-2">
                            <span>{mood.icon}</span>
                            {mood.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="bg-muted border-border text-foreground focus:bg-background focus:border-amber-400 focus:ring-amber-400"
                    required
                  />
                </div>

                <Textarea
                  placeholder="Write about your faith journey, prayers, reflections, or anything on your heart..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-amber-400 focus:ring-amber-400 min-h-[200px] resize-none"
                  required
                />

                <Input
                  placeholder="Tags (comma separated, e.g., prayer, mass, reflection)"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-amber-400 focus:ring-amber-400"
                />

                {/* Image Upload Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Journal Images (Optional - up to 3 images)
                  </label>
                  <JournalImageUpload
                    onUpload={(url) => setFormData({ ...formData, imageUrls: [...formData.imageUrls, url] })}
                    onError={(error) => {
                      toast({
                        title: "Upload failed",
                        description: error,
                        variant: "destructive",
                      })
                    }}
                    className="max-w-md"
                  />
                  {formData.imageUrls && formData.imageUrls.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-2">
                        Uploaded images ({(formData.imageUrls || []).length}/3):
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {(formData.imageUrls || []).map((url, index) => (
                          <div key={index} className="relative">
                            <img
                              src={url}
                              alt={`Journal image ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border border-border"
                            />
                            <button
                              type="button"
                              onClick={() => setFormData({ 
                                ...formData, 
                                imageUrls: formData.imageUrls.filter((_, i) => i !== index) 
                              })}
                              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-border bg-card sticky bottom-0 -mx-6 px-6 py-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.title.trim() || !formData.content.trim() || !formData.mood}
                    className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4 mr-2" />
                        {editingEntry ? "Update Entry" : "Save Entry"}
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-border text-foreground hover:bg-muted hover:border-border bg-background font-medium px-6 py-2 rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Entries */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-amber-400 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-6">
            {entries.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-2">No journal entries yet</p>
                <p className="text-muted-foreground">Start documenting your faith journey</p>
              </div>
            ) : (
              entries.map((entry) => {
                const moodInfo = getMoodInfo(entry.mood)
                return (
                  <div
                    key={entry.id}
                    className="bg-muted/50 rounded-xl p-6 border border-border hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground text-xl mb-2">{entry.title}</h3>
                                                 <div className="flex items-center gap-4 text-sm text-muted-foreground">
                           <div className="flex items-center gap-2">
                             <Calendar className="h-4 w-4 text-amber-500" />
                             <span>Created: {format(new Date(entry.entry_date), "MMM dd, yyyy")}</span>
                             {entry.updated_at !== entry.created_at && (
                               <>
                                 <span className="text-muted-foreground">•</span>
                                 <span className="flex items-center gap-1 text-blue-600">
                                   <Edit className="h-3 w-3" />
                                   Updated: {getRelativeTime(entry.updated_at)}
                                 </span>
                               </>
                             )}
                           </div>
                           <div className="flex items-center gap-2 text-amber-600">
                             <span className="text-lg">{moodInfo.icon}</span>
                             <span className="font-medium">{moodInfo.label}</span>
                           </div>
                         </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(entry)}
                          size="sm"
                          variant="ghost"
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(entry.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-foreground text-base leading-relaxed mb-4 line-clamp-3">{entry.content}</p>

                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((tag, index) => (
                          <Badge key={index} className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

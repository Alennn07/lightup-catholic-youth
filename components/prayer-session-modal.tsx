"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Play, Pause, Square, Heart, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PrayerSessionModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  onSessionComplete: (session: any) => void
}

export function PrayerSessionModal({ isOpen, onClose, userId, onSessionComplete }: PrayerSessionModalProps) {
  const [sessionType, setSessionType] = useState("guided")
  const [prayerFocus, setPrayerFocus] = useState("")
  const [moodBefore, setMoodBefore] = useState("")
  const [moodAfter, setMoodAfter] = useState("")
  const [notes, setNotes] = useState("")
  const [isActive, setIsActive] = useState(false)
  const [duration, setDuration] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const { toast } = useToast()

  // Update duration every second when active
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && startTime) {
      interval = setInterval(() => {
        const now = new Date()
        const elapsed = Math.round((now.getTime() - startTime.getTime()) / 1000 / 60)
        setDuration(elapsed)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive, startTime])

  if (!isOpen) return null

  const startSession = () => {
    setIsActive(true)
    setStartTime(new Date())
    setDuration(0)
  }

  const pauseSession = () => {
    setIsActive(false)
  }

  const stopSession = async () => {
    if (!startTime) return

    const endTime = new Date()
    const sessionDuration = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60) // minutes

    try {
      const response = await fetch('/api/prayer-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          sessionType,
          durationMinutes: sessionDuration,
          prayerFocus,
          moodBefore: moodBefore ? parseInt(moodBefore) : null,
          moodAfter: moodAfter ? parseInt(moodAfter) : null,
          notes
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save prayer session')
      }

      const { session } = await response.json()
      
      toast({
        title: "Prayer Session Complete! 🙏",
        description: `You prayed for ${sessionDuration} minutes. May God bless your time with Him.`,
      })

      onSessionComplete(session)
      onClose()
      resetForm()
    } catch (error) {
      console.error('Error saving prayer session:', error)
      toast({
        title: "Error",
        description: "Failed to save your prayer session. Please try again.",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setSessionType("guided")
    setPrayerFocus("")
    setMoodBefore("")
    setMoodAfter("")
    setNotes("")
    setIsActive(false)
    setDuration(0)
    setStartTime(null)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Prayer Session
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Session Type */}
          <div className="space-y-2">
            <Label htmlFor="sessionType">Prayer Type</Label>
            <Select value={sessionType} onValueChange={setSessionType}>
              <SelectTrigger>
                <SelectValue placeholder="Select prayer type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="guided">Guided Prayer</SelectItem>
                <SelectItem value="freeform">Freeform Prayer</SelectItem>
                <SelectItem value="meditation">Meditation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Prayer Focus */}
          <div className="space-y-2">
            <Label htmlFor="prayerFocus">What would you like to pray about?</Label>
            <Textarea
              id="prayerFocus"
              placeholder="Enter your prayer focus (optional)"
              value={prayerFocus}
              onChange={(e) => setPrayerFocus(e.target.value)}
              rows={3}
            />
          </div>

          {/* Mood Before */}
          <div className="space-y-2">
            <Label htmlFor="moodBefore">How are you feeling before prayer?</Label>
            <Select value={moodBefore} onValueChange={setMoodBefore}>
              <SelectTrigger>
                <SelectValue placeholder="Select your mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">😔 Struggling</SelectItem>
                <SelectItem value="2">😐 Neutral</SelectItem>
                <SelectItem value="3">😊 Good</SelectItem>
                <SelectItem value="4">😄 Great</SelectItem>
                <SelectItem value="5">🙌 Blessed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timer Section */}
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-gray-600" />
              <span className="text-2xl font-bold text-gray-800">
                {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
            
            <div className="flex gap-2 justify-center">
              {!isActive ? (
                <Button onClick={startSession} className="bg-green-600 hover:bg-green-700">
                  <Play className="h-4 w-4 mr-2" />
                  Start Prayer
                </Button>
              ) : (
                <>
                  <Button onClick={pauseSession} variant="outline">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                  <Button onClick={stopSession} className="bg-red-600 hover:bg-red-700">
                    <Square className="h-4 w-4 mr-2" />
                    End Prayer
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mood After (only show if session is active or completed) */}
          {(isActive || duration > 0) && (
            <div className="space-y-2">
              <Label htmlFor="moodAfter">How do you feel after prayer?</Label>
              <Select value={moodAfter} onValueChange={setMoodAfter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">😔 Still struggling</SelectItem>
                  <SelectItem value="2">😐 Same</SelectItem>
                  <SelectItem value="3">😊 Better</SelectItem>
                  <SelectItem value="4">😄 Much better</SelectItem>
                  <SelectItem value="5">🙌 Renewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Prayer Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any thoughts or insights from your prayer time..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            {duration > 0 && (
              <Button onClick={stopSession} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Save Session
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CheckCircle, XCircle, Clock, User, MessageSquare, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface JoinRequest {
  id: string
  user_id: string
  message: string
  status: string
  requested_at: string
}

interface MemberRequestModalProps {
  groupId: string
  groupName: string
  isOpen: boolean
  onClose: () => void
  onRequestProcessed: () => void
}

export function MemberRequestModal({ 
  groupId, 
  groupName, 
  isOpen, 
  onClose, 
  onRequestProcessed 
}: MemberRequestModalProps) {
  const { getAccessToken } = useAuth()
  const { toast } = useToast()
  const [requests, setRequests] = useState<JoinRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)
  const [reviewMessage, setReviewMessage] = useState('')

  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened, fetching fresh requests...')
      fetchJoinRequests()
    }
  }, [isOpen, groupId])

  const fetchJoinRequests = async () => {
    try {
      setLoading(true)
      const token = await getAccessToken()
      if (!token) return

      const response = await fetch(`/api/youth-groups/${groupId}/requests`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Fetched requests data:', data)
        console.log('Number of requests:', data.requests?.length || 0)
        
        // Filter out approved/rejected requests to only show pending ones
        const pendingRequests = (data.requests || []).filter((req: any) => req.status === 'pending')
        console.log('Filtered pending requests:', pendingRequests.length)
        setRequests(pendingRequests)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to fetch join requests",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching join requests:', error)
      toast({
        title: "Error",
        description: "Failed to fetch join requests",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRequestAction = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      // Check if this request is already being processed
      if (processing === requestId) {
        console.log(`Request ${requestId} is already being processed, skipping...`)
        return
      }

      setProcessing(requestId)
      const token = await getAccessToken()
      if (!token) {
        console.error('No access token available')
        return
      }

      console.log('Sending approval request:', {
        groupId,
        requestId,
        action,
        token: token.substring(0, 20) + '...'
      })

      const response = await fetch(`/api/youth-groups/${groupId}/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action,
          reviewMessage: reviewMessage.trim() || undefined
        })
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (response.ok) {
        const data = await response.json()
        console.log('Request processed successfully:', data)
        
        toast({
          title: "Success",
          description: data.message || `Request ${action}d successfully`
        })
        
        // Remove the processed request from the list immediately
        setRequests(prev => {
          const filtered = prev.filter(req => req.id !== requestId)
          console.log(`✅ REMOVED request ${requestId} from UI, remaining requests: ${filtered.length}`)
          return filtered
        })
        
        // Refresh the parent component data
        onRequestProcessed()
        
        // Close the modal immediately after successful approval
        if (action === 'approve') {
          console.log('✅ APPROVAL SUCCESSFUL - Closing modal immediately')
          console.log('Current requests before close:', requests.length)
          
          // Small delay to prevent immediate reopening
          setTimeout(() => {
            onClose()
            console.log('✅ Modal closed after approval')
          }, 100)
        }
      } else {
        const error = await response.json()
        console.error('API Error:', error)
        console.error('Response status:', response.status)
        toast({
          title: "Error",
          description: error.error || `Failed to ${action} request`,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error)
      toast({
        title: "Error",
        description: `Failed to ${action} request`,
        variant: "destructive"
      })
    } finally {
      setProcessing(null)
      setReviewMessage('')
    }
  }

  const getUserDisplayName = (request: JoinRequest) => {
    // For now, just use the user_id since we don't have user details
    return `User ${request.user_id.slice(0, 8)}...`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Join Requests for {groupName}</DialogTitle>
          <DialogDescription>
            Review and manage pending join requests for this group
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
              <p className="text-gray-500">There are no pending join requests for this group.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {getUserDisplayName(request)}
                          </h4>
                          <p className="text-sm text-gray-500">ID: {request.user_id}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {formatDistanceToNow(new Date(request.requested_at), { addSuffix: true })}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {request.message && (
                      <div className="mb-4">
                        <div className="flex items-start space-x-2">
                          <MessageSquare className="h-4 w-4 text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                              {request.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Review Message (Optional)
                        </label>
                        <Textarea
                          placeholder="Add a message for the requester..."
                          value={reviewMessage}
                          onChange={(e) => setReviewMessage(e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          onClick={() => handleRequestAction(request.id, 'approve')}
                          disabled={processing === request.id}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {processing === request.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleRequestAction(request.id, 'reject')}
                          disabled={processing === request.id}
                          variant="destructive"
                        >
                          {processing === request.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : (
                            <XCircle className="h-4 w-4 mr-2" />
                          )}
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

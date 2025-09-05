'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, Mail, Calendar, User, MessageSquare } from 'lucide-react'

interface ContactSubmission {
  id: string
  name: string
  email: string
  priority: string
  message: string
  category: string
  status: string
  created_at: string
  updated_at: string
}

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/contact-submissions')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch submissions')
      }
      
      setSubmissions(data.submissions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleReply = (submission: ContactSubmission) => {
    const subject = `Re: Your ${submission.category} inquiry - ${submission.name}`
    const body = `Hi ${submission.name},

Thank you for contacting us regarding your ${submission.category} inquiry.

We have received your message:
"${submission.message}"

We will get back to you within 24 hours.

Best regards,
LightUp Support Team

---
Original Message:
From: ${submission.name} (${submission.email})
Priority: ${submission.priority}
Category: ${submission.category}
Message: ${submission.message}
Submitted: ${new Date(submission.created_at).toLocaleString()}`

    // Copy email details to clipboard
    const fullText = `To: ${submission.email}\nSubject: ${subject}\n\n${body}`
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText).then(() => {
        alert(`Reply template copied to clipboard for ${submission.name}! You can now paste it into your email client.`)
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = fullText
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        alert(`Reply template copied to clipboard for ${submission.name}! You can now paste it into your email client.`)
      })
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = fullText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert(`Reply template copied to clipboard for ${submission.name}! You can now paste it into your email client.`)
    }
  }

  const handleStatusUpdate = async (submissionId: string, newStatus: string) => {
    try {
      setUpdating(submissionId)
      
      const response = await fetch('/api/admin/contact-submissions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: submissionId,
          status: newStatus
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status')
      }
      
      // Update local state
      setSubmissions(prev => 
        prev.map(submission => 
          submission.id === submissionId 
            ? { ...submission, status: newStatus, updated_at: new Date().toISOString() }
            : submission
        )
      )
      
      alert(`Status updated to "${newStatus.replace('_', ' ')}" successfully!`)
      
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update status. Please try again.')
    } finally {
      setUpdating(null)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    if (priority.includes('Critical')) return 'bg-red-100 text-red-800'
    if (priority.includes('High')) return 'bg-orange-100 text-orange-800'
    if (priority.includes('Medium')) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'account': return '👤'
      case 'technical': return '🔧'
      case 'feature': return '💡'
      case 'bug': return '🐛'
      case 'other': return '❓'
      default: return '📝'
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading submissions...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Submissions</h2>
              <p className="text-red-600">{error}</p>
              <Button onClick={fetchSubmissions} className="mt-4">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
            <p className="text-gray-600 mt-2">Manage and respond to contact form submissions</p>
          </div>
          <Button onClick={fetchSubmissions} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid gap-6">
          {submissions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Submissions Yet</h3>
                <p className="text-gray-600">Contact form submissions will appear here once users start submitting them.</p>
              </CardContent>
            </Card>
          ) : (
            submissions.map((submission) => (
              <Card key={submission.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getCategoryIcon(submission.category)}</div>
                      <div>
                        <CardTitle className="text-lg">{submission.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{submission.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(submission.priority)}>
                        {submission.priority.split(' - ')[0]}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Message:</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{submission.message}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Submitted: {new Date(submission.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>Category: {submission.category}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReply(submission)}
                        className="hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusUpdate(submission.id, submission.status === 'new' ? 'in_progress' : 'resolved')}
                        disabled={updating === submission.id}
                        className="hover:bg-green-50 hover:border-green-300 disabled:opacity-50"
                      >
                        {updating === submission.id ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        {submission.status === 'new' ? 'Mark as In Progress' : 
                         submission.status === 'in_progress' ? 'Mark as Resolved' : 
                         'Mark as Closed'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

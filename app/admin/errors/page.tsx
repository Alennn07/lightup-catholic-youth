"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Bug, Activity, Clock, CheckCircle } from 'lucide-react'
import { errorMonitor } from '@/lib/error-monitor'

interface ErrorReport {
  id: string
  message: string
  stack?: string
  context: {
    url: string
    userAgent: string
    timestamp: string
    userId?: string
    component?: string
    action?: string
  }
  severity: 'low' | 'medium' | 'high' | 'critical'
  resolved: boolean
  createdAt: string
}

export default function ErrorDashboard() {
  const [errors, setErrors] = useState<ErrorReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    resolved: 0
  })

  useEffect(() => {
    fetchErrors()
    const interval = setInterval(fetchErrors, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchErrors = async () => {
    try {
      const response = await fetch('/api/admin/errors')
      if (response.ok) {
        const data = await response.json()
        setErrors(data.errors || [])
        setStats(data.stats || stats)
      }
    } catch (error) {
      console.error('Failed to fetch errors:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsResolved = async (errorId: string) => {
    try {
      const response = await fetch(`/api/admin/errors/${errorId}/resolve`, {
        method: 'PATCH'
      })
      if (response.ok) {
        setErrors(errors.map(error => 
          error.id === errorId ? { ...error, resolved: true } : error
        ))
      }
    } catch (error) {
      console.error('Failed to mark error as resolved:', error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />
      case 'high': return <Bug className="h-4 w-4" />
      case 'medium': return <Activity className="h-4 w-4" />
      case 'low': return <Clock className="h-4 w-4" />
      default: return <Bug className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Error Dashboard</h1>
          <p className="text-gray-600">Monitor and manage application errors</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
              <Bug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <Activity className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            </CardContent>
          </Card>
        </div>

        {/* Error List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {errors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No errors found! Your application is running smoothly.</p>
                </div>
              ) : (
                errors.map((error) => (
                  <div key={error.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getSeverityColor(error.severity)}>
                            {getSeverityIcon(error.severity)}
                            <span className="ml-1 capitalize">{error.severity}</span>
                          </Badge>
                          {error.resolved && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{error.message}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Component:</strong> {error.context.component || 'Unknown'}</p>
                          <p><strong>URL:</strong> {error.context.url}</p>
                          <p><strong>Time:</strong> {new Date(error.context.timestamp).toLocaleString()}</p>
                          {error.context.userId && (
                            <p><strong>User ID:</strong> {error.context.userId}</p>
                          )}
                        </div>
                        {error.stack && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-sm text-gray-500">
                              Stack Trace
                            </summary>
                            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                              {error.stack}
                            </pre>
                          </details>
                        )}
                      </div>
                      {!error.resolved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsResolved(error.id)}
                        >
                          Mark Resolved
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

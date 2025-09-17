"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  retryCount: number
}

export class YouthGroupsErrorBoundary extends Component<Props, State> {
  private maxRetries = 3

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Youth Groups Error Boundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Log error to monitoring service (if available)
    this.logError(error, errorInfo)
  }

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    // In a real app, you'd send this to your error monitoring service
    console.error('🚨 Youth Groups Error:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    })
  }

  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }))
    }
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private handleReportBug = () => {
    const { toast } = useToast()
    toast({
      title: "Bug Report",
      description: "Thank you for reporting this issue. Our team has been notified.",
      variant: "default"
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-red-900">
                  Oops! Something went wrong
                </CardTitle>
                <CardDescription className="text-red-700">
                  We encountered an error while loading the Youth Groups feature.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="bg-red-100 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-800 font-mono">
                      <strong>Error:</strong> {this.state.error.message}
                    </p>
                    {this.state.error.stack && (
                      <details className="mt-2">
                        <summary className="text-sm text-red-700 cursor-pointer">
                          Stack Trace
                        </summary>
                        <pre className="text-xs text-red-600 mt-2 whitespace-pre-wrap">
                          {this.state.error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}

                <div className="flex flex-col space-y-2">
                  {this.state.retryCount < this.maxRetries && (
                    <Button
                      onClick={this.handleRetry}
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again ({this.maxRetries - this.state.retryCount} attempts left)
                    </Button>
                  )}

                  <Button
                    onClick={this.handleReload}
                    variant="outline"
                    className="w-full border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reload Page
                  </Button>

                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Go to Home
                  </Button>

                  <Button
                    onClick={this.handleReportBug}
                    variant="ghost"
                    className="w-full text-gray-600 hover:bg-gray-100"
                  >
                    <Bug className="h-4 w-4 mr-2" />
                    Report Bug
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-500">
                  <p>If this problem persists, please contact support.</p>
                  <p className="mt-1">
                    Error ID: {Date.now().toString(36)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for using error boundary functionality
export function useErrorHandler() {
  const handleError = (error: Error, errorInfo?: string) => {
    console.error('🚨 Youth Groups Error:', error, errorInfo)
    
    // In a real app, you'd send this to your error monitoring service
    // Example: Sentry.captureException(error, { extra: { errorInfo } })
  }

  const handleAsyncError = (error: Error, context?: string) => {
    console.error('🚨 Youth Groups Async Error:', error, context)
    
    // In a real app, you'd send this to your error monitoring service
    // Example: Sentry.captureException(error, { extra: { context } })
  }

  return {
    handleError,
    handleAsyncError
  }
}

// Higher-order component for wrapping components with error boundary
export function withYouthGroupsErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <YouthGroupsErrorBoundary fallback={fallback}>
        <Component {...props} />
      </YouthGroupsErrorBoundary>
    )
  }
}

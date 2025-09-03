// Error monitoring and logging system for production
interface ErrorContext {
  userId?: string
  sessionId?: string
  url: string
  userAgent: string
  timestamp: string
  component?: string
  action?: string
  additionalData?: any
}

interface ErrorReport {
  id: string
  message: string
  stack?: string
  context: ErrorContext
  severity: 'low' | 'medium' | 'high' | 'critical'
  resolved: boolean
  createdAt: string
}

class ErrorMonitor {
  private static instance: ErrorMonitor
  private errorQueue: ErrorReport[] = []
  private isProcessing = false
  private readonly MAX_QUEUE_SIZE = 100
  private readonly BATCH_SIZE = 10
  private readonly RETRY_ATTEMPTS = 3

  private constructor() {
    // Set up global error handlers
    this.setupGlobalErrorHandlers()
    
    // Process error queue periodically
    setInterval(() => {
      this.processErrorQueue()
    }, 30000) // Every 30 seconds
  }

  public static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor()
    }
    return ErrorMonitor.instance
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(new Error(event.reason), {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        action: 'unhandled_promise_rejection',
        additionalData: { reason: event.reason }
      }, 'high')
    })

    // Handle global JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureError(event.error || new Error(event.message), {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        action: 'global_error',
        additionalData: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      }, 'high')
    })
  }

  public captureError(
    error: Error,
    context: Partial<ErrorContext>,
    severity: ErrorReport['severity'] = 'medium'
  ): string {
    const errorId = this.generateErrorId()
    
    const errorReport: ErrorReport = {
      id: errorId,
      message: error.message,
      stack: error.stack,
      context: {
        url: context.url || window.location.href,
        userAgent: context.userAgent || navigator.userAgent,
        timestamp: context.timestamp || new Date().toISOString(),
        userId: context.userId,
        sessionId: context.sessionId,
        component: context.component,
        action: context.action,
        additionalData: context.additionalData
      },
      severity,
      resolved: false,
      createdAt: new Date().toISOString()
    }

    // Add to queue
    this.errorQueue.push(errorReport)

    // Prevent queue from growing too large
    if (this.errorQueue.length > this.MAX_QUEUE_SIZE) {
      this.errorQueue = this.errorQueue.slice(-this.MAX_QUEUE_SIZE)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error captured:', errorReport)
    }

    // Try to send immediately for critical errors
    if (severity === 'critical') {
      this.sendErrorToServer(errorReport)
    }

    return errorId
  }

  private async processErrorQueue() {
    if (this.isProcessing || this.errorQueue.length === 0) {
      return
    }

    this.isProcessing = true

    try {
      const batch = this.errorQueue.splice(0, this.BATCH_SIZE)
      
      for (const error of batch) {
        await this.sendErrorToServer(error)
      }
    } catch (error) {
      console.error('Failed to process error queue:', error)
    } finally {
      this.isProcessing = false
    }
  }

  private async sendErrorToServer(errorReport: ErrorReport, attempt = 1): Promise<void> {
    try {
      const response = await fetch('/api/errors/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // Remove from queue on success
      this.errorQueue = this.errorQueue.filter(e => e.id !== errorReport.id)

    } catch (error) {
      console.error(`Failed to send error to server (attempt ${attempt}):`, error)
      
      // Retry logic
      if (attempt < this.RETRY_ATTEMPTS) {
        setTimeout(() => {
          this.sendErrorToServer(errorReport, attempt + 1)
        }, Math.pow(2, attempt) * 1000) // Exponential backoff
      } else {
        // Remove from queue after max retries
        this.errorQueue = this.errorQueue.filter(e => e.id !== errorReport.id)
      }
    }
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Public methods for manual error reporting
  public reportError(
    message: string,
    context: Partial<ErrorContext>,
    severity: ErrorReport['severity'] = 'medium'
  ): string {
    const error = new Error(message)
    return this.captureError(error, context, severity)
  }

  public reportWarning(
    message: string,
    context: Partial<ErrorContext>
  ): string {
    return this.reportError(message, context, 'low')
  }

  public reportCritical(
    message: string,
    context: Partial<ErrorContext>
  ): string {
    return this.reportError(message, context, 'critical')
  }

  // Get error statistics
  public getErrorStats(): {
    totalErrors: number
    errorsBySeverity: Record<string, number>
    recentErrors: ErrorReport[]
  } {
    const errorsBySeverity = this.errorQueue.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalErrors: this.errorQueue.length,
      errorsBySeverity,
      recentErrors: this.errorQueue.slice(-10) // Last 10 errors
    }
  }
}

// Export singleton instance
export const errorMonitor = ErrorMonitor.getInstance()

// React hook for error monitoring
export function useErrorMonitor() {
  const captureError = (
    error: Error,
    context: Partial<ErrorContext>,
    severity: ErrorReport['severity'] = 'medium'
  ) => {
    return errorMonitor.captureError(error, context, severity)
  }

  const reportError = (
    message: string,
    context: Partial<ErrorContext>,
    severity: ErrorReport['severity'] = 'medium'
  ) => {
    return errorMonitor.reportError(message, context, severity)
  }

  const reportWarning = (message: string, context: Partial<ErrorContext>) => {
    return errorMonitor.reportWarning(message, context)
  }

  const reportCritical = (message: string, context: Partial<ErrorContext>) => {
    return errorMonitor.reportCritical(message, context)
  }

  return {
    captureError,
    reportError,
    reportWarning,
    reportCritical,
    getErrorStats: () => errorMonitor.getErrorStats()
  }
}

// Higher-order component for automatic error monitoring
export function withErrorMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return function ErrorMonitoredComponent(props: P) {
    const { captureError } = useErrorMonitor()

    const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
      captureError(error, {
        component: componentName,
        additionalData: {
          componentStack: errorInfo.componentStack,
          props: props
        }
      }, 'high')
    }

    return (
      <ErrorBoundary onError={handleError}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

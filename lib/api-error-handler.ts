import { NextResponse } from 'next/server'

// Standardized error response format
export interface ApiErrorResponse {
  error: string
  code?: string
  details?: any
  timestamp: string
  path?: string
}

// Error codes for consistent handling
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR'
} as const

// Create standardized error response
export function createErrorResponse(
  message: string,
  status: number = 500,
  code?: string,
  details?: any,
  path?: string
): NextResponse<ApiErrorResponse> {
  const errorResponse: ApiErrorResponse = {
    error: message,
    code,
    details,
    timestamp: new Date().toISOString(),
    path
  }

  return NextResponse.json(errorResponse, { status })
}

// Common error responses
export const ApiErrors = {
  // 400 - Bad Request
  validation: (message: string, details?: any) => 
    createErrorResponse(message, 400, ERROR_CODES.VALIDATION_ERROR, details),
  
  // 401 - Unauthorized
  unauthorized: (message: string = 'Authentication required') => 
    createErrorResponse(message, 401, ERROR_CODES.AUTHENTICATION_ERROR),
  
  // 403 - Forbidden
  forbidden: (message: string = 'Access denied') => 
    createErrorResponse(message, 403, ERROR_CODES.AUTHORIZATION_ERROR),
  
  // 404 - Not Found
  notFound: (message: string = 'Resource not found') => 
    createErrorResponse(message, 404, ERROR_CODES.NOT_FOUND),
  
  // 429 - Rate Limited
  rateLimited: (message: string = 'Too many requests', retryAfter?: number) => 
    createErrorResponse(message, 429, ERROR_CODES.RATE_LIMITED, { retryAfter }),
  
  // 500 - Internal Server Error
  internal: (message: string = 'Internal server error', details?: any) => 
    createErrorResponse(message, 500, ERROR_CODES.INTERNAL_ERROR, details),
  
  // Database errors
  database: (message: string = 'Database error', details?: any) => 
    createErrorResponse(message, 500, ERROR_CODES.DATABASE_ERROR, details),
  
  // Network errors
  network: (message: string = 'Network error', details?: any) => 
    createErrorResponse(message, 500, ERROR_CODES.NETWORK_ERROR, details),
  
  // External service errors
  externalService: (message: string = 'External service error', details?: any) => 
    createErrorResponse(message, 502, ERROR_CODES.EXTERNAL_SERVICE_ERROR, details)
}

// Error logging utility
export async function logApiError(
  error: any,
  context: {
    route: string
    method: string
    userId?: string
    requestId?: string
    additionalData?: any
  }
): Promise<void> {
  try {
    const errorLog = {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      name: error?.name,
      ...context,
      timestamp: new Date().toISOString()
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', errorLog)
    }

    // In production, you might want to send to external logging service
    // await sendToLoggingService(errorLog)
  } catch (loggingError) {
    console.error('Failed to log API error:', loggingError)
  }
}

// Wrapper for API route error handling
export function withErrorHandling<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error: any) {
      const request = args[0] as Request
      const route = request?.url || 'unknown'
      const method = request?.method || 'unknown'

      await logApiError(error, {
        route,
        method,
        additionalData: {
          userAgent: request?.headers?.get('user-agent'),
          ip: request?.headers?.get('x-forwarded-for') || request?.headers?.get('x-real-ip')
        }
      })

      // Return appropriate error response based on error type
      if (error.name === 'ZodError') {
        return ApiErrors.validation('Invalid input data', error.errors)
      }

      if (error.message?.includes('Unauthorized') || error.message?.includes('authentication')) {
        return ApiErrors.unauthorized(error.message)
      }

      if (error.message?.includes('not found')) {
        return ApiErrors.notFound(error.message)
      }

      if (error.message?.includes('rate limit')) {
        return ApiErrors.rateLimited(error.message)
      }

      // Default to internal server error
      return ApiErrors.internal(
        process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      )
    }
  }
}

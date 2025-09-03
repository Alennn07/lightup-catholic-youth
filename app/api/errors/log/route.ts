import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { ApiErrors } from '@/lib/api-error-handler'

export async function POST(request: NextRequest) {
  try {
    const errorData = await request.json()
    
    // Validate required fields
    if (!errorData.message) {
      return ApiErrors.validation('Missing required error message')
    }

    // Store error in database
    const { error } = await supabaseAdmin
      .from('error_logs')
      .insert({
        error_id: errorData.id || errorData.errorId,
        message: errorData.message,
        stack: errorData.stack,
        component_stack: errorData.context?.componentStack || errorData.componentStack,
        user_agent: errorData.context?.userAgent || errorData.userAgent,
        url: errorData.context?.url || errorData.url,
        timestamp: errorData.context?.timestamp || errorData.timestamp || new Date().toISOString(),
        severity: errorData.severity || 'medium',
        environment: process.env.NODE_ENV || 'development',
        user_id: errorData.context?.userId,
        additional_data: errorData.context?.additionalData
      })

    if (error) {
      console.error('Failed to log error to database:', error)
      return ApiErrors.database('Failed to log error')
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Error logged successfully',
      errorId: errorData.id || errorData.errorId 
    })

  } catch (error: any) {
    console.error('Error logging API error:', error)
    return ApiErrors.internal('Failed to process error log')
  }
}

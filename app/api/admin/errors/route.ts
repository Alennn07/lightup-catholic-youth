import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { ApiErrors } from '@/lib/api-error-handler'

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin (you might want to add proper admin authentication)
    // const { data: { user } } = await supabaseAdmin.auth.getUser()
    // if (!user || user.role !== 'admin') {
    //   return ApiErrors.forbidden('Admin access required')
    // }

    // Fetch errors from database
    const { data: errors, error } = await supabaseAdmin
      .from('error_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching error logs:', error)
      return ApiErrors.database('Failed to fetch error logs')
    }

    // Calculate statistics
    const stats = {
      total: errors?.length || 0,
      critical: errors?.filter(e => e.severity === 'critical').length || 0,
      high: errors?.filter(e => e.severity === 'high').length || 0,
      medium: errors?.filter(e => e.severity === 'medium').length || 0,
      low: errors?.filter(e => e.severity === 'low').length || 0,
      resolved: errors?.filter(e => e.resolved).length || 0
    }

    return NextResponse.json({
      errors: errors || [],
      stats
    })

  } catch (error: any) {
    console.error('Admin errors API error:', error)
    return ApiErrors.internal('Failed to fetch error data')
  }
}

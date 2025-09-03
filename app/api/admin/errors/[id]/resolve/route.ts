import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { ApiErrors } from '@/lib/api-error-handler'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return ApiErrors.validation('Error ID is required')
    }

    // Check if user is admin (you might want to add proper admin authentication)
    // const { data: { user } } = await supabaseAdmin.auth.getUser()
    // if (!user || user.role !== 'admin') {
    //   return ApiErrors.forbidden('Admin access required')
    // }

    // Update error as resolved
    const { data, error } = await supabaseAdmin
      .from('error_logs')
      .update({ 
        resolved: true,
        updated_at: new Date().toISOString()
      })
      .eq('error_id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating error log:', error)
      return ApiErrors.database('Failed to update error log')
    }

    if (!data) {
      return ApiErrors.notFound('Error log not found')
    }

    return NextResponse.json({
      message: 'Error marked as resolved',
      error: data
    })

  } catch (error: any) {
    console.error('Resolve error API error:', error)
    return ApiErrors.internal('Failed to resolve error')
  }
}

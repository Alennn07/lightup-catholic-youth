import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { calculatePermissions } from '@/lib/permission-service'

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('users')
      .select('role, is_verified, is_active, created_at')
      .eq('id', user.id)
      .single()

    // Use the centralized permission service
    const basePermissions = calculatePermissions(profile)
    
    // Add group-specific permission functions
    const permissions = {
      ...basePermissions,
      canManageGroup: (groupId: string) => {
        // This would need to check if user is group owner
        // For now, use the base permission
        return basePermissions.canManageAllGroups || basePermissions.isGroupLeader
      },
      canJoinGroup: (groupId: string) => {
        return basePermissions.canJoinGroups
      },
      canCreateEvents: (groupId: string) => {
        // This would need to check group membership
        return basePermissions.canCreateEvents
      },
      canCreatePosts: (groupId: string) => {
        // This would need to check group membership
        return basePermissions.canCreatePosts
      },
      canManageMembers: (groupId: string) => {
        // This would need to check if user is group owner/leader
        return basePermissions.canManageMembers
      },
      canDeleteContent: (groupId: string) => {
        // This would need to check group membership and ownership
        return basePermissions.canDeleteContent
      }
    }

    return NextResponse.json({ permissions })
  } catch (error) {
    console.error('Error fetching permissions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
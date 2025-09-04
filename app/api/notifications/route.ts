import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Force this route to be dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get user's notifications (you can expand this based on your notification system)
    const { data: notifications, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('Error fetching notifications:', error)
      // Return empty array if table doesn't exist yet
      return NextResponse.json({ notifications: [] })
    }

    // If no notifications table exists, return some default notifications
    if (!notifications) {
      const defaultNotifications = [
        {
          id: '1',
          message: 'Welcome to LightUp! Start your faith journey today.',
          type: 'welcome',
          created_at: new Date().toISOString()
        }
      ]
      return NextResponse.json({ notifications: defaultNotifications })
    }

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Notifications API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
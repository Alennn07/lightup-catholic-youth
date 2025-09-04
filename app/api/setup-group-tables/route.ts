import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { 
        auth: { autoRefreshToken: false, persistSession: false },
        db: { schema: 'public' }
      }
    )

    // Create group_events table
    const { error: eventsTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS group_events (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          group_id UUID NOT NULL REFERENCES youth_groups(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          event_date DATE NOT NULL,
          event_time TIME,
          location VARCHAR(255),
          max_attendees INTEGER,
          created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (eventsTableError) {
      console.error('Error creating events table:', eventsTableError)
    }

    // Create group_posts table
    const { error: postsTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS group_posts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          group_id UUID NOT NULL REFERENCES youth_groups(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          type VARCHAR(50) DEFAULT 'announcement' CHECK (type IN ('announcement', 'discussion', 'prayer_request', 'event_reminder')),
          created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (postsTableError) {
      console.error('Error creating posts table:', postsTableError)
    }

    // Enable RLS
    await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE group_events ENABLE ROW LEVEL SECURITY;'
    })

    await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE group_posts ENABLE ROW LEVEL SECURITY;'
    })

    return NextResponse.json({
      success: true,
      message: 'Group tables created successfully'
    })

  } catch (error: any) {
    console.error('Error setting up group tables:', error)
    return NextResponse.json({ 
      error: 'Failed to create tables',
      details: error.message 
    }, { status: 500 })
  }
}

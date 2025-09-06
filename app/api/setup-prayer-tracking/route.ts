import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Setting up prayer tracking table...')
    
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 })
    }
    
    // Create Supabase client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Create prayer_participants table
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS prayer_participants (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          prayer_request_id UUID NOT NULL REFERENCES prayer_requests(id) ON DELETE CASCADE,
          prayed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, prayer_request_id)
        );
      `
    })

    if (tableError) {
      console.error('Error creating table:', tableError)
      return NextResponse.json({ error: 'Failed to create table' }, { status: 500 })
    }

    // Create indexes
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_prayer_participants_user_id ON prayer_participants(user_id);
        CREATE INDEX IF NOT EXISTS idx_prayer_participants_prayer_request_id ON prayer_participants(prayer_request_id);
      `
    })

    if (indexError) {
      console.error('Error creating indexes:', indexError)
    }

    // Enable RLS
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE prayer_participants ENABLE ROW LEVEL SECURITY;`
    })

    if (rlsError) {
      console.error('Error enabling RLS:', rlsError)
    }

    // Create RLS policies
    const { error: policyError } = await supabase.rpc('exec_sql', {
      sql: `
        DROP POLICY IF EXISTS "Users can view their own prayer participations" ON prayer_participants;
        CREATE POLICY "Users can view their own prayer participations" ON prayer_participants
          FOR SELECT USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can insert their own prayer participations" ON prayer_participants;
        CREATE POLICY "Users can insert their own prayer participations" ON prayer_participants
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Anyone can view prayer participation counts" ON prayer_participants;
        CREATE POLICY "Anyone can view prayer participation counts" ON prayer_participants
          FOR SELECT USING (true);
      `
    })

    if (policyError) {
      console.error('Error creating policies:', policyError)
    }

    console.log('✅ Prayer tracking table setup completed')
    return NextResponse.json({ success: true, message: 'Prayer tracking table created successfully' })

  } catch (error: any) {
    console.error('Error setting up prayer tracking:', error)
    return NextResponse.json({ error: 'Failed to setup prayer tracking' }, { status: 500 })
  }
}

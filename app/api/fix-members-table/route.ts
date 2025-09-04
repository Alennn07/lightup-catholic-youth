import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if youth_group_members table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'youth_group_members')

    if (tablesError) {
      return NextResponse.json({ error: 'Failed to check tables' }, { status: 500 })
    }

    if (tables.length === 0) {
      // Create the table
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS youth_group_members (
            id BIGSERIAL PRIMARY KEY,
            group_id BIGINT NOT NULL REFERENCES youth_groups(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            role VARCHAR(50) DEFAULT 'member',
            status VARCHAR(20) DEFAULT 'active',
            joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            invited_by UUID REFERENCES auth.users(id),
            can_manage_members BOOLEAN DEFAULT FALSE,
            can_create_events BOOLEAN DEFAULT FALSE,
            can_create_posts BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(group_id, user_id)
          );
          
          CREATE INDEX IF NOT EXISTS idx_youth_group_members_group_id ON youth_group_members(group_id);
          CREATE INDEX IF NOT EXISTS idx_youth_group_members_user_id ON youth_group_members(user_id);
          CREATE INDEX IF NOT EXISTS idx_youth_group_members_status ON youth_group_members(status);
        `
      })

      if (createError) {
        return NextResponse.json({ error: 'Failed to create table', details: createError.message }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        message: 'youth_group_members table created successfully' 
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'youth_group_members table already exists' 
    })

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force this route to be dynamic
export const dynamic = 'force-dynamic'

// Create Supabase client with service role key for admin operations
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

export async function POST() {
  try {
    console.log('🔧 Fixing search tables...')

    // Add missing columns to youth_groups table
    const { error: youthGroupsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE youth_groups 
        ADD COLUMN IF NOT EXISTS location TEXT,
        ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
        ADD COLUMN IF NOT EXISTS member_count INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS image_url TEXT;
      `
    })

    if (youthGroupsError) {
      console.error('Error adding columns to youth_groups:', youthGroupsError)
    }

    // Add missing columns to events table
    const { error: eventsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE events
        ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
        ADD COLUMN IF NOT EXISTS image_url TEXT;
      `
    })

    if (eventsError) {
      console.error('Error adding columns to events:', eventsError)
    }

    // Insert sample youth groups data
    const { data: groups, error: groupsError } = await supabase
      .from('youth_groups')
      .insert([
        {
          name: 'Young Adults Group',
          description: 'A vibrant community for young adults aged 18-30 to grow in faith together through prayer, study, and fellowship.',
          location: 'St. Mary Church, Downtown',
          is_public: true,
          member_count: 25
        },
        {
          name: 'Teen Faith Group',
          description: 'High school students exploring their faith through discussions, activities, and service projects.',
          location: 'St. Joseph Parish, Westside',
          is_public: true,
          member_count: 18
        },
        {
          name: 'Campus Ministry',
          description: 'College students building community and deepening their relationship with God through weekly meetings and retreats.',
          location: 'University Campus',
          is_public: true,
          member_count: 32
        },
        {
          name: 'Family Faith Group',
          description: 'Families with children of all ages coming together to learn and grow in faith as a community.',
          location: 'St. Francis Church, Eastside',
          is_public: true,
          member_count: 15
        },
        {
          name: 'Young Professionals',
          description: 'Working young adults balancing career and faith, supporting each other through life challenges.',
          location: 'Downtown Community Center',
          is_public: true,
          member_count: 22
        }
      ])
      .select()

    console.log('Groups added:', groups?.length, groupsError)

    // Insert sample events data
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .insert([
        {
          title: 'Youth Retreat 2024',
          description: 'A weekend retreat focused on spiritual growth, community building, and deepening our relationship with God.',
          location: 'Camp St. John, Mountain View',
          date: '2024-03-15 09:00:00',
          is_public: true
        },
        {
          title: 'Community Service Day',
          description: 'Join us for a day of service in our local community. We will be helping at the food bank and visiting elderly residents.',
          location: 'Various Locations',
          date: '2024-02-20 08:00:00',
          is_public: true
        },
        {
          title: 'Bible Study Series',
          description: 'A 6-week study of the Gospel of Matthew. All are welcome to join us for discussion and reflection.',
          location: 'St. Mary Church Hall',
          date: '2024-02-01 19:00:00',
          is_public: true
        },
        {
          title: 'Praise and Worship Night',
          description: 'An evening of music, prayer, and worship. Bring your friends and family for an uplifting experience.',
          location: 'St. Joseph Church',
          date: '2024-02-10 19:30:00',
          is_public: true
        },
        {
          title: 'Faith and Science Discussion',
          description: 'Exploring the relationship between faith and science with guest speakers and open dialogue.',
          location: 'University Auditorium',
          date: '2024-02-25 18:00:00',
          is_public: true
        }
      ])
      .select()

    console.log('Events added:', events?.length, eventsError)

    return NextResponse.json({
      success: true,
      message: 'Search tables fixed and sample data added',
      data: {
        groups: groups?.length || 0,
        events: events?.length || 0,
        youthGroupsError: youthGroupsError?.message,
        eventsError: eventsError?.message
      }
    })

  } catch (error: any) {
    console.error('❌ Error fixing search tables:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fix search tables'
    }, { status: 500 })
  }
}

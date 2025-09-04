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
    console.log('🌱 Seeding search data...')

    // Get a user ID for journal entries
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1)

    if (usersError || !users || users.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No users found. Please create a user account first.'
      }, { status: 400 })
    }

    const userId = users[0].id

    // Add sample youth groups
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

    // Add sample events
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

    // Add sample journal entries
    const { data: journalEntries, error: journalError } = await supabase
      .from('journal_entries')
      .insert([
        {
          user_id: userId,
          title: 'Grateful for Today',
          content: 'Today I felt so blessed. The sun was shining, and I had a wonderful conversation with my grandmother. She shared stories about her faith journey that really inspired me.',
          mood: 'grateful',
          tags: ['gratitude', 'family', 'faith'],
          entry_date: '2024-01-15',
          is_private: false
        },
        {
          user_id: userId,
          title: 'Struggling with Doubts',
          content: 'I have been questioning my faith lately. Sometimes I wonder if God is really listening to my prayers. I need guidance and strength to overcome these doubts.',
          mood: 'struggling',
          tags: ['doubts', 'prayer', 'guidance'],
          entry_date: '2024-01-20',
          is_private: true
        },
        {
          user_id: userId,
          title: 'Amazing Youth Group Meeting',
          content: 'Our youth group had an incredible discussion about social justice today. I learned so much about how our faith calls us to serve others and work for a better world.',
          mood: 'joyful',
          tags: ['youth group', 'social justice', 'community'],
          entry_date: '2024-01-25',
          is_private: false
        },
        {
          user_id: userId,
          title: 'Prayer Answered',
          content: 'I have been praying for my friend who was sick, and today I found out she is getting better! God is so good and faithful.',
          mood: 'hopeful',
          tags: ['healing', 'prayer', 'friendship'],
          entry_date: '2024-01-30',
          is_private: false
        },
        {
          user_id: userId,
          title: 'Reflecting on Lent',
          content: 'As Lent begins, I am reflecting on what I can give up and what I can do to grow closer to God. This season always brings me peace and renewal.',
          mood: 'contemplative',
          tags: ['Lent', 'reflection', 'spiritual growth'],
          entry_date: '2024-02-01',
          is_private: false
        }
      ])
      .select()

    console.log('Journal entries added:', journalEntries?.length, journalError)

    return NextResponse.json({
      success: true,
      message: 'Search data seeded successfully',
      data: {
        groups: groups?.length || 0,
        events: events?.length || 0,
        journal: journalEntries?.length || 0
      }
    })

  } catch (error: any) {
    console.error('❌ Error seeding search data:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to seed search data'
    }, { status: 500 })
  }
}

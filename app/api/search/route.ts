import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

// Force this route to be dynamic
export const dynamic = 'force-dynamic'

// Search request validation schema
const SearchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Query too long'),
  type: z.enum(['all', 'prayers', 'journal', 'groups', 'events']).default('all'),
  page: z.string().regex(/^\d+$/).default('1').transform(Number),
  limit: z.string().regex(/^\d+$/).default('10').transform(Number),
  userId: z.string().uuid().optional()
})

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const type = searchParams.get('type') || 'all'
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10'
    const userId = searchParams.get('userId') || ''

    // Validate input
    const validatedData = SearchSchema.parse({
      query,
      type,
      page,
      limit,
      userId: userId || undefined
    })

    const { query: searchQuery, type: searchType, page: pageNum, limit: limitNum, userId: searchUserId } = validatedData
    const offset = (pageNum - 1) * limitNum

    console.log(`🔍 Global search: "${searchQuery}", type: ${searchType}, page: ${pageNum}`)

    const results: any = {
      prayers: [],
      journal: [],
      groups: [],
      events: [],
      total: 0,
      page: pageNum,
      limit: limitNum,
      hasMore: false
    }

    // Search prayers (respect RLS - only show public prayers or user's own)
    if (searchType === 'all' || searchType === 'prayers') {
      try {
        let prayersQuery = supabase
          .from('prayer_requests')
          .select(`
            id,
            name,
            request,
            category,
            is_anonymous,
            prayer_count,
            created_at,
            image_url
          `)
          .textSearch('request', searchQuery, {
            type: 'websearch',
            config: 'english'
          })
          .order('created_at', { ascending: false })

        // Apply RLS: only show non-anonymous prayers or user's own prayers
        if (searchUserId) {
          prayersQuery = prayersQuery.or(`is_anonymous.eq.false,user_id.eq.${searchUserId}`)
        } else {
          prayersQuery = prayersQuery.eq('is_anonymous', false)
        }

        const { data: prayers, error: prayersError } = await prayersQuery
          .range(offset, offset + limitNum - 1)

        if (!prayersError && prayers) {
          results.prayers = prayers.map(prayer => ({
            id: prayer.id,
            type: 'prayer',
            title: prayer.is_anonymous ? 'Anonymous Prayer' : prayer.name,
            content: prayer.request,
            category: prayer.category,
            is_anonymous: prayer.is_anonymous,
            prayer_count: prayer.prayer_count,
            created_at: prayer.created_at,
            image_url: prayer.image_url
          }))
        }
      } catch (error) {
        console.error('Prayers search error:', error)
      }
    }

    // Search journal entries (respect RLS - only show user's own entries)
    if ((searchType === 'all' || searchType === 'journal') && searchUserId) {
      try {
        const { data: journalEntries, error: journalError } = await supabase
          .from('journal_entries')
          .select(`
            id,
            title,
            content,
            mood,
            tags,
            entry_date,
            created_at,
            image_urls
          `)
          .eq('user_id', searchUserId)
          .textSearch('content', searchQuery, {
            type: 'websearch',
            config: 'english'
          })
          .order('created_at', { ascending: false })
          .range(offset, offset + limitNum - 1)

        if (!journalError && journalEntries) {
          results.journal = journalEntries.map(entry => ({
            id: entry.id,
            type: 'journal',
            title: entry.title || 'Untitled Entry',
            content: entry.content,
            mood: entry.mood,
            tags: entry.tags,
            entry_date: entry.entry_date,
            created_at: entry.created_at,
            image_urls: entry.image_urls
          }))
        }
      } catch (error) {
        console.error('Journal search error:', error)
      }
    }

    // Search youth groups (respect RLS - only show public groups)
    if (searchType === 'all' || searchType === 'groups') {
      try {
        const { data: groups, error: groupsError } = await supabase
          .from('youth_groups')
          .select(`
            id,
            name,
            description,
            location,
            member_count,
            created_at,
            image_url
          `)
          .eq('is_public', true)
          .textSearch('name,description', searchQuery, {
            type: 'websearch',
            config: 'english'
          })
          .order('created_at', { ascending: false })
          .range(offset, offset + limitNum - 1)

        if (!groupsError && groups) {
          results.groups = groups.map(group => ({
            id: group.id,
            type: 'group',
            title: group.name,
            content: group.description,
            location: group.location,
            member_count: group.member_count,
            created_at: group.created_at,
            image_url: group.image_url
          }))
        }
      } catch (error) {
        console.error('Groups search error:', error)
      }
    }

    // Search events (respect RLS - only show public events)
    if (searchType === 'all' || searchType === 'events') {
      try {
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select(`
            id,
            title,
            description,
            location,
            date,
            created_at,
            image_url
          `)
          .eq('is_public', true)
          .textSearch('title,description', searchQuery, {
            type: 'websearch',
            config: 'english'
          })
          .order('date', { ascending: false })
          .range(offset, offset + limitNum - 1)

        if (!eventsError && events) {
          results.events = events.map(event => ({
            id: event.id,
            type: 'event',
            title: event.title,
            content: event.description,
            location: event.location,
            date: event.date,
            created_at: event.created_at,
            image_url: event.image_url
          }))
        }
      } catch (error) {
        console.error('Events search error:', error)
      }
    }

    // Calculate totals and pagination
    const totalResults = results.prayers.length + results.journal.length + results.groups.length + results.events.length
    results.total = totalResults
    results.hasMore = totalResults >= limitNum

    console.log(`✅ Search completed: ${totalResults} results found`)

    return NextResponse.json({
      success: true,
      data: results,
      query: searchQuery,
      type: searchType
    })

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: error.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 })
    }

    console.error('❌ Search API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Search failed',
      details: error.message || 'Unknown error occurred'
    }, { status: 500 })
  }
}

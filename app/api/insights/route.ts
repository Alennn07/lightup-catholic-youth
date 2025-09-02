import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get user insights using the database function
    const { data: insights, error } = await supabase
      .rpc('get_user_insights', { user_uuid: userId })

    if (error) {
      console.error('Error fetching insights:', error)
      return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 })
    }

    return NextResponse.json({ insights: insights || [] })
  } catch (error) {
    console.error('Insights API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, insightType, title, description, actionText, actionUrl } = await request.json()

    if (!userId || !insightType || !title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Insert new insight
    const { data, error } = await supabase
      .from('user_insights')
      .insert({
        user_id: userId,
        insight_type: insightType,
        title,
        description,
        action_text: actionText,
        action_url: actionUrl,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      })
      .select()

    if (error) {
      console.error('Error creating insight:', error)
      return NextResponse.json({ error: 'Failed to create insight' }, { status: 500 })
    }

    return NextResponse.json({ insight: data[0] })
  } catch (error) {
    console.error('Insights POST API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

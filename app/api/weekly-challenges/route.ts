import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get current week's challenges
    const currentWeekStart = new Date()
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay()) // Start of week (Sunday)
    currentWeekStart.setHours(0, 0, 0, 0)

    const currentWeekEnd = new Date(currentWeekStart)
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6) // End of week (Saturday)
    currentWeekEnd.setHours(23, 59, 59, 999)

    const { data: challenges, error } = await supabase
      .from('weekly_challenges')
      .select('*')
      .eq('user_id', userId)
      .gte('week_start', currentWeekStart.toISOString())
      .lte('week_end', currentWeekEnd.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching weekly challenges:', error)
      return NextResponse.json({ error: 'Failed to fetch weekly challenges' }, { status: 500 })
    }

    return NextResponse.json({ challenges: challenges || [] })
  } catch (error) {
    console.error('Weekly challenges API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      challengeType, 
      title, 
      description, 
      targetCount = 1 
    } = await request.json()

    if (!userId || !challengeType || !title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Calculate current week dates
    const currentWeekStart = new Date()
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay())
    currentWeekStart.setHours(0, 0, 0, 0)

    const currentWeekEnd = new Date(currentWeekStart)
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6)
    currentWeekEnd.setHours(23, 59, 59, 999)

    // Insert new weekly challenge
    const { data, error } = await supabase
      .from('weekly_challenges')
      .insert({
        user_id: userId,
        challenge_type: challengeType,
        title,
        description,
        target_count: targetCount,
        week_start: currentWeekStart.toISOString(),
        week_end: currentWeekEnd.toISOString()
      })
      .select()

    if (error) {
      console.error('Error creating weekly challenge:', error)
      return NextResponse.json({ error: 'Failed to create weekly challenge' }, { status: 500 })
    }

    return NextResponse.json({ challenge: data[0] })
  } catch (error) {
    console.error('Weekly challenges POST API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { challengeId, currentCount, isCompleted } = await request.json()

    if (!challengeId) {
      return NextResponse.json({ error: 'Challenge ID is required' }, { status: 400 })
    }

    const updateData: any = { current_count: currentCount }
    
    if (isCompleted) {
      updateData.is_completed = true
      updateData.completed_at = new Date().toISOString()
    }

    // Update weekly challenge progress
    const { data, error } = await supabase
      .from('weekly_challenges')
      .update(updateData)
      .eq('id', challengeId)
      .select()

    if (error) {
      console.error('Error updating weekly challenge:', error)
      return NextResponse.json({ error: 'Failed to update weekly challenge' }, { status: 500 })
    }

    return NextResponse.json({ challenge: data[0] })
  } catch (error) {
    console.error('Weekly challenges PUT API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

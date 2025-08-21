import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function POST(request: NextRequest) {
  try {
    const { userId, activityType, activityData, featureId } = await request.json()

    if (!userId || !activityType) {
      return NextResponse.json(
        { error: 'User ID and activity type are required' },
        { status: 400 }
      )
    }

    // Track the user activity
    const { error: activityError } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        activity_type: activityType,
        activity_data: activityData || {},
        created_at: new Date().toISOString()
      })

    if (activityError) {
      console.error('Error tracking activity:', activityError)
    }

    // Update feature statistics if featureId is provided
    if (featureId) {
      await updateFeatureStats(featureId, activityType)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Activity tracked successfully' 
    })

  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function updateFeatureStats(featureId: string, activityType: string) {
  try {
    // Get current feature stats
    const { data: feature, error: fetchError } = await supabase
      .from('features')
      .select('user_count, rating')
      .eq('id', featureId)
      .single()

    if (fetchError || !feature) {
      console.error('Error fetching feature:', fetchError)
      return
    }

    let newUserCount = feature.user_count || 0
    let newRating = feature.rating || 0

    // Update based on activity type
    switch (activityType) {
      case 'feature_used':
        newUserCount += 1
        break
      case 'feature_rated':
        // This would be handled separately when rating is submitted
        break
      case 'feature_feedback':
        // This would be handled separately when feedback is submitted
        break
      default:
        // For other activities, just increment usage
        newUserCount += 1
    }

    // Update feature statistics
    const { error: updateError } = await supabase
      .from('features')
      .update({
        user_count: newUserCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', featureId)

    if (updateError) {
      console.error('Error updating feature stats:', updateError)
    }

  } catch (error) {
    console.error('Error updating feature stats:', error)
  }
}

// GET endpoint to retrieve analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const featureId = searchParams.get('featureId')
    const days = parseInt(searchParams.get('days') || '30')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user activity summary
    const { data: activities, error: activitiesError } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })

    if (activitiesError) {
      console.error('Error fetching activities:', activitiesError)
      return NextResponse.json(
        { error: 'Failed to fetch activities' },
        { status: 500 }
      )
    }

    // Get feature statistics if featureId is provided
    let featureStats = null
    if (featureId) {
      const { data: feature, error: featureError } = await supabase
        .from('features')
        .select('*')
        .eq('id', featureId)
        .single()

      if (!featureError && feature) {
        featureStats = feature
      }
    }

    // Calculate activity summary
    const activitySummary = activities?.reduce((summary, activity) => {
      summary[activity.activity_type] = (summary[activity.activity_type] || 0) + 1
      return summary
    }, {} as Record<string, number>) || {}

    return NextResponse.json({
      success: true,
      data: {
        activities,
        activitySummary,
        featureStats,
        period: `${days} days`
      }
    })

  } catch (error) {
    console.error('Analytics retrieval error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

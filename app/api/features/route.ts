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

interface Feature {
  id: string
  name: string
  description: string
  category: string
  userCount: number
  rating: number
  userSatisfaction: number
  icon: string
  color: string
  href: string
}

export async function GET() {
  try {
    // Fetch real features from database
    const { data: featuresData, error } = await supabase
      .from('features')
      .select('*')
      .order('user_count', { ascending: false })

    if (error) {
      console.error('Error fetching features:', error)
      return NextResponse.json({ error: 'Failed to fetch features' }, { status: 500 })
    }

    // Transform database data to match expected format
    const availableFeatures: Feature[] = featuresData?.map((feature: any) => ({
      id: feature.id,
      name: feature.name || '',
      description: feature.description || '',
      category: feature.category || 'Community',
      userCount: feature.user_count || 0,
      rating: feature.rating || 0,
      userSatisfaction: feature.user_satisfaction || 0,
      icon: feature.icon || 'sparkles',
      color: feature.color || 'from-purple-500 to-pink-500',
      href: `/dashboard#${feature.id}`,
    })) || []

    // If no features exist, create default empty features
    if (availableFeatures.length === 0) {
      availableFeatures.push(
        {
          id: "prayer-wall",
          name: "Prayer Wall",
          description: "Share prayer requests and pray for others in your Catholic youth community.",
          category: "Community",
          userCount: 0,
          rating: 0,
          userSatisfaction: 0,
          icon: "heart",
          color: "from-pink-500 to-rose-500",
          href: "/dashboard#prayer-wall",
        },
        {
          id: "youth-groups",
          name: "Youth Group Finder",
          description: "Discover and connect with Catholic youth groups in your area.",
          category: "Community",
          userCount: 0,
          rating: 0,
          userSatisfaction: 0,
          icon: "users",
          color: "from-blue-500 to-cyan-500",
          href: "/dashboard#youth-groups",
        },
        {
          id: "daily-bible-verse",
          name: "Daily Bible Verse",
          description: "Start each day with inspiring scripture and thoughtful reflections.",
          category: "Spiritual",
          userCount: 0,
          rating: 0,
          userSatisfaction: 0,
          icon: "book-open",
          color: "from-green-500 to-emerald-500",
          href: "/dashboard#bible-verse",
        }
      )
    }

    // Calculate real statistics
    const totalUsers = availableFeatures.reduce((sum, f) => sum + f.userCount, 0)
    const averageRating = availableFeatures.length > 0 
      ? availableFeatures.reduce((sum, f) => sum + f.rating, 0) / availableFeatures.length 
      : 0

    return NextResponse.json({
      features: availableFeatures,
      stats: {
        totalFeatures: availableFeatures.length,
        totalUsers,
        averageRating: Math.round(averageRating * 10) / 10,
        categories: [...new Set(availableFeatures.map(f => f.category))]
      }
    })

  } catch (error) {
    console.error('Features API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { featureId, feedback, rating, email } = body

    if (!featureId || !feedback) {
      return NextResponse.json(
        { error: 'Feature ID and feedback are required' },
        { status: 400 }
      )
    }

    // Store feedback in database
    const { error: feedbackError } = await supabase
      .from('feature_feedback')
      .insert({
        feature_id: featureId,
        feedback,
        rating: rating || null,
        user_email: email || null,
        created_at: new Date().toISOString()
      })

    if (feedbackError) {
      console.error('Error storing feedback:', feedbackError)
      return NextResponse.json(
        { error: 'Failed to store feedback' },
        { status: 500 }
      )
    }

    // Update feature rating if provided
    if (rating) {
      const { error: updateError } = await supabase
        .from('features')
        .update({ 
          rating: rating,
          updated_at: new Date().toISOString()
        })
        .eq('id', featureId)

      if (updateError) {
        console.error('Error updating feature rating:', updateError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Feedback submitted successfully' 
    })

  } catch (error) {
    console.error('Feedback API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

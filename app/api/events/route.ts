import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const category = searchParams.get("category")
    const userId = searchParams.get("userId")

    let query = supabase
      .from("events")
      .select(`
        *,
        youth_group:youth_groups(name, parish)
      `)
      .order("date", { ascending: true })

    if (date) {
      query = query.eq("date", date)
    }

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data: events, error } = await query

    if (error) throw error

    return NextResponse.json(events)
  } catch (error: any) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized - Please sign in to create events" }, { status: 401 })
    }

    const body = await request.json()

    // Get user profile to check role and group
    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("role, group_id")
      .eq("id", session.user.id)
      .single()

    if (!userProfile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    // Check if user can create events
    let canCreate = false

    // 1. Regular users can create events
    if (userProfile.role === "user" || !userProfile.role) {
      canCreate = true
    }
    // 2. Group leaders can create events
    else if (userProfile.role === "group-leader") {
      canCreate = true
    }
    // 3. OBCC members can create events
    else if (userProfile.role === "obcc") {
      canCreate = true
    }
    // 4. Clergy can create events
    else if (userProfile.role === "clergy") {
      canCreate = true
    }
    // 5. Admins can create events
    else if (userProfile.role === "admin") {
      canCreate = true
    }

    if (!canCreate) {
      return NextResponse.json({ 
        error: "Forbidden - You don't have permission to create events" 
      }, { status: 403 })
    }

    // Add user_id to the event data
    const eventData = {
      ...body,
      user_id: session.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: newEvent, error } = await supabase
      .from("events")
      .insert(eventData)
      .select(`
        *,
        youth_group:youth_groups(name, parish)
      `)
      .single()

    if (error) throw error

    return NextResponse.json(newEvent, { status: 201 })
  } catch (error: any) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}

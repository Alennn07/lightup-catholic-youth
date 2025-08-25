import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Force this route to be dynamic since it uses request.url
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const date = searchParams.get("date")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

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
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

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

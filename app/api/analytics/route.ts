import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const body = await request.json()
    const { event_type, event_name, page_path, feature_used, session_id, duration_seconds, metadata } = body

    // Get user session if available
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Get request info
    const userAgent = request.headers.get("user-agent") || ""
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip")

    const { error } = await supabase.from("app_analytics").insert({
      user_id: session?.user?.id || null,
      event_type,
      event_name,
      page_path,
      feature_used,
      session_id,
      user_agent: userAgent,
      ip_address: ip,
      duration_seconds,
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error tracking analytics:", error)
      return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const startDate = url.searchParams.get("start_date")
    const endDate = url.searchParams.get("end_date")
    const eventType = url.searchParams.get("event_type")

    let query = supabase.from("app_analytics").select("*").order("created_at", { ascending: false })

    if (startDate) {
      query = query.gte("created_at", startDate)
    }

    if (endDate) {
      query = query.lte("created_at", endDate)
    }

    if (eventType) {
      query = query.eq("event_type", eventType)
    }

    const { data: analytics, error } = await query

    if (error) {
      console.error("Error fetching analytics:", error)
      return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
    }

    return NextResponse.json({ analytics })
  } catch (error) {
    console.error("Analytics fetch API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

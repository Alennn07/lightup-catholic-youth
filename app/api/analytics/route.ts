import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { logIfEnabled } from "@/lib/performance-monitor"

// Force this route to be dynamic
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
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
      logIfEnabled(`Error tracking analytics: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
      return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logIfEnabled(`Analytics API error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
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
      logIfEnabled(`Error fetching analytics: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
      return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
    }

    return NextResponse.json({ analytics })
  } catch (error) {
    logIfEnabled(`Analytics fetch API error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

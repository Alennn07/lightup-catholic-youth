import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { logIfEnabled } from "@/lib/performance-monitor"

// Force this route to be dynamic since it uses request.url
export const dynamic = 'force-dynamic'

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

    // Check if user is admin (you can implement your own admin check logic)
    const { data: profile } = await supabase.from("users").select("*").eq("id", session.user.id).single()

    if (!profile || !profile.email.includes("admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get dashboard statistics
    const [usersResult, prayerRequestsResult, youthGroupsResult, eventsResult, journalEntriesResult, feedbackResult] =
      await Promise.all([
        supabase.from("users").select("id", { count: "exact" }),
        supabase.from("prayer_requests").select("id", { count: "exact" }),
        supabase.from("youth_groups").select("id", { count: "exact" }),
        supabase.from("events").select("id", { count: "exact" }),
        supabase.from("journal_entries").select("id", { count: "exact" }),
        supabase.from("feature_feedback").select("id", { count: "exact" }),
      ])

    // Get recent activity
    const { data: recentUsers } = await supabase
      .from("users")
      .select("name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(5)

    const { data: recentPrayerRequests } = await supabase
      .from("prayer_requests")
      .select("name, request, category, created_at")
      .order("created_at", { ascending: false })
      .limit(5)

    const { data: recentFeedback } = await supabase
      .from("feature_feedback")
      .select("title, feedback_type, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5)

    // Get analytics summary
    const { data: analyticsData } = await supabase
      .from("app_analytics")
      .select("event_type, event_name, created_at")
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false })

    const dashboard = {
      stats: {
        totalUsers: usersResult.count || 0,
        totalPrayerRequests: prayerRequestsResult.count || 0,
        totalYouthGroups: youthGroupsResult.count || 0,
        totalEvents: eventsResult.count || 0,
        totalJournalEntries: journalEntriesResult.count || 0,
        totalFeedback: feedbackResult.count || 0,
      },
      recentActivity: {
        users: recentUsers || [],
        prayerRequests: recentPrayerRequests || [],
        feedback: recentFeedback || [],
      },
      analytics: {
        weeklyEvents: analyticsData || [],
      },
    }

    return NextResponse.json({ dashboard })
  } catch (error) {
    logIfEnabled(`Admin dashboard API error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

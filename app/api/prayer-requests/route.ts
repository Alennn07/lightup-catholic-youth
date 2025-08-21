import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: requests, error } = await supabase
      .from("prayer_requests")
      .select(`
        *,
        user:users(name, avatar_url)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(requests)
  } catch (error: any) {
    console.error("Error fetching prayer requests:", error)
    return NextResponse.json({ error: "Failed to fetch prayer requests" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_id, name, request: prayerRequest, category, is_anonymous } = body

    const { data: newRequest, error } = await supabase
      .from("prayer_requests")
      .insert({
        user_id,
        name: is_anonymous ? "Anonymous" : name,
        request: prayerRequest,
        category,
        is_anonymous,
        prayer_count: 0,
      })
      .select(`
        *,
        user:users(name, avatar_url)
      `)
      .single()

    if (error) throw error

    return NextResponse.json(newRequest, { status: 201 })
  } catch (error: any) {
    console.error("Error creating prayer request:", error)
    return NextResponse.json({ error: "Failed to create prayer request" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Increment prayer count
    const { data, error } = await supabase
      .from("prayer_requests")
      .update({
        prayer_count: supabase.sql`prayer_count + 1`,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("prayer_count")
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      prayerCount: data.prayer_count,
    })
  } catch (error: any) {
    console.error("Error updating prayer count:", error)
    return NextResponse.json({ error: "Failed to update prayer count" }, { status: 500 })
  }
}

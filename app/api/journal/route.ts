import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Force this route to be dynamic since it uses request.url
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const search = searchParams.get("search")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    let query = supabase.from("journal_entries").select("*").eq("user_id", userId).order("date", { ascending: false })

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }

    const { data: entries, error } = await query

    if (error) throw error

    return NextResponse.json(entries)
  } catch (error: any) {
    console.error("Error fetching journal entries:", error)
    return NextResponse.json({ error: "Failed to fetch journal entries" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { data: newEntry, error } = await supabase
      .from("journal_entries")
      .insert({
        ...body,
        date: body.date || new Date().toISOString().split("T")[0],
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(newEntry, { status: 201 })
  } catch (error: any) {
    console.error("Error creating journal entry:", error)
    return NextResponse.json({ error: "Failed to create journal entry" }, { status: 500 })
  }
}

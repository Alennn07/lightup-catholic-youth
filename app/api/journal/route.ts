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

    console.log(`🔍 Fetching journal entries for user: ${userId}`)

    let query = supabase.from("journal_entries").select("*").eq("user_id", userId).order("date", { ascending: false })

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }

    const { data: entries, error } = await query

    if (error) {
      console.error("❌ Supabase error:", error)
      // Check if it's a table doesn't exist error
      if (error.message && error.message.includes("relation") && error.message.includes("does not exist")) {
        return NextResponse.json({ 
          error: "Journal table not found. Please run the database setup script.",
          details: "The journal_entries table needs to be created in your database."
        }, { status: 500 })
      }
      throw error
    }

    console.log(`✅ Found ${entries?.length || 0} journal entries`)
    return NextResponse.json(entries || [])
  } catch (error: any) {
    console.error("❌ Error fetching journal entries:", error)
    return NextResponse.json({ 
      error: "Failed to fetch journal entries",
      details: error.message || "Unknown error occurred"
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log(`📝 Creating journal entry:`, body)

    const { data: newEntry, error } = await supabase
      .from("journal_entries")
      .insert({
        ...body,
        date: body.date || new Date().toISOString().split("T")[0],
      })
      .select()
      .single()

    if (error) {
      console.error("❌ Supabase error creating entry:", error)
      // Check if it's a table doesn't exist error
      if (error.message && error.message.includes("relation") && error.message.includes("does not exist")) {
        return NextResponse.json({ 
          error: "Journal table not found. Please run the database setup script.",
          details: "The journal_entries table needs to be created in your database."
        }, { status: 500 })
      }
      throw error
    }

    console.log(`✅ Journal entry created successfully:`, newEntry)
    return NextResponse.json(newEntry, { status: 201 })
  } catch (error: any) {
    console.error("❌ Error creating journal entry:", error)
    return NextResponse.json({ 
      error: "Failed to create journal entry",
      details: error.message || "Unknown error occurred"
    }, { status: 500 })
  }
}

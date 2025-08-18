import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const ageRange = searchParams.get("ageRange")
    const type = searchParams.get("type")

    let query = supabase.from("youth_groups").select("*").order("name")

    if (search) {
      query = query.or(`name.ilike.%${search}%,parish.ilike.%${search}%,city.ilike.%${search}%`)
    }

    if (ageRange && ageRange !== "All Ages") {
      query = query.eq("age_range", ageRange)
    }

    if (type && type !== "All Types") {
      query = query.contains("type", [type])
    }

    const { data: groups, error } = await query

    if (error) throw error

    return NextResponse.json(groups)
  } catch (error: any) {
    console.error("Error fetching youth groups:", error)
    return NextResponse.json({ error: "Failed to fetch youth groups" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { data: newGroup, error } = await supabase.from("youth_groups").insert(body).select().single()

    if (error) throw error

    return NextResponse.json(newGroup, { status: 201 })
  } catch (error: any) {
    console.error("Error creating youth group:", error)
    return NextResponse.json({ error: "Failed to create youth group" }, { status: 500 })
  }
}

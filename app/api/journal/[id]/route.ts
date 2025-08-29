import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id // UUID, not a number
    const body = await request.json()

    // Handle date field mapping
    const updateData = { ...body }
    if (body.date) {
      updateData.entry_date = body.date
      delete updateData.date
    }

    const { data: updatedEntry, error } = await supabase
      .from("journal_entries")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(updatedEntry)
  } catch (error: any) {
    console.error("Error updating journal entry:", error)
    return NextResponse.json({ error: "Failed to update journal entry" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id // UUID, not a number

    const { error } = await supabase.from("journal_entries").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting journal entry:", error)
    return NextResponse.json({ error: "Failed to delete journal entry" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'
import { JournalEntrySchema } from '@/lib/validations'

// Create Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id // UUID, not a number
    const body = await request.json()
    console.log(`📝 Updating journal entry ${id}:`, body)

    // Validate request body
    const validatedData = JournalEntrySchema.parse(body)

    // Handle date field mapping
    const updateData: any = {
      title: validatedData.title,
      content: validatedData.content,
      mood: validatedData.mood,
      tags: validatedData.tags,
      is_private: validatedData.is_private,
      entry_date: validatedData.date || new Date().toISOString().split('T')[0]
    }
    
    // Only add image_urls if it exists and is not empty
    if (validatedData.image_urls && validatedData.image_urls.length > 0) {
      updateData.image_urls = validatedData.image_urls
    }

    const { data: updatedEntry, error } = await supabase
      .from("journal_entries")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("❌ Supabase error updating entry:", error)
      throw error
    }

    console.log(`✅ Journal entry updated successfully:`, updatedEntry)
    return NextResponse.json(updatedEntry)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 })
    }
    
    console.error("❌ Error updating journal entry:", error)
    return NextResponse.json({ 
      error: "Failed to update journal entry",
      details: error.message || "Unknown error occurred"
    }, { status: 500 })
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

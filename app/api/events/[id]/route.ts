import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Force this route to be dynamic (not statically optimized)
export const dynamic = 'force-dynamic'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized - Please sign in" }, { status: 401 })
    }

    const eventId = parseInt(params.id)
    if (isNaN(eventId)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 })
    }

    // Get the event to check ownership
    const { data: event, error: fetchError } = await supabase
      .from("events")
      .select("user_id, group_id")
      .eq("id", eventId)
      .single()

    if (fetchError || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Get user profile to check role
    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("role, group_id")
      .eq("id", session.user.id)
      .single()

    // Check if user can delete this event
    let canDelete = false

    // 1. User owns the event
    if (event.user_id === session.user.id) {
      canDelete = true
    }
    // 2. User is admin/OBCC member
    else if (userProfile?.role === "obcc" || userProfile?.role === "admin") {
      canDelete = true
    }
    // 3. User is clergy
    else if (userProfile?.role === "clergy") {
      canDelete = true
    }
    // 4. User is group leader and event belongs to their group
    else if (userProfile?.role === "group-leader" && 
             event.group_id && 
             userProfile.group_id === event.group_id) {
      canDelete = true
    }

    if (!canDelete) {
      return NextResponse.json({ 
        error: "Forbidden - You can only delete your own events or events from your group" 
      }, { status: 403 })
    }

    // Delete the event
    const { error: deleteError } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId)

    if (deleteError) throw deleteError

    return NextResponse.json({ 
      message: "Event deleted successfully" 
    })

  } catch (error: any) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ 
      error: "Failed to delete event" 
    }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized - Please sign in" }, { status: 401 })
    }

    const eventId = parseInt(params.id)
    if (isNaN(eventId)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 })
    }

    const body = await request.json()

    // Get the event to check ownership
    const { data: event, error: fetchError } = await supabase
      .from("events")
      .select("user_id, group_id")
      .eq("id", eventId)
      .single()

    if (fetchError || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Get user profile to check role
    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("role, group_id")
      .eq("id", session.user.id)
      .single()

    // Check if user can edit this event
    let canEdit = false

    // 1. User owns the event
    if (event.user_id === session.user.id) {
      canEdit = true
    }
    // 2. User is admin/OBCC member
    else if (userProfile?.role === "obcc" || userProfile?.role === "admin") {
      canEdit = true
    }
    // 3. User is clergy
    else if (userProfile?.role === "clergy") {
      canEdit = true
    }
    // 4. User is group leader and event belongs to their group
    else if (userProfile?.role === "group-leader" && 
             event.group_id && 
             userProfile.group_id === event.group_id) {
      canEdit = true
    }

    if (!canEdit) {
      return NextResponse.json({ 
        error: "Forbidden - You can only edit your own events or events from your group" 
      }, { status: 403 })
    }

    // Update the event
    const { data: updatedEvent, error: updateError } = await supabase
      .from("events")
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq("id", eventId)
      .select(`
        *,
        youth_group:youth_groups(name, parish)
      `)
      .single()

    if (updateError) throw updateError

    return NextResponse.json(updatedEvent)

  } catch (error: any) {
    console.error("Error updating event:", error)
    return NextResponse.json({ 
      error: "Failed to update event" 
    }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const eventId = parseInt(params.id)
    if (isNaN(eventId)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 })
    }

    // Get the event (public read access)
    const { data: event, error } = await supabase
      .from("events")
      .select(`
        *,
        youth_group:youth_groups(name, parish)
      `)
      .eq("id", eventId)
      .single()

    if (error || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)

  } catch (error: any) {
    console.error("Error fetching event:", error)
    return NextResponse.json({ 
      error: "Failed to fetch event" 
    }, { status: 500 })
  }
}

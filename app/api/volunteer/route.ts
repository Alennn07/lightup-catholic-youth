aiimport { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role, experience, availability, motivation, skills, phone } = body;

    // Validate required fields
    if (!name || !email || !role || !availability || !motivation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Insert volunteer application into database
    const { data, error } = await supabase
      .from('volunteer_applications')
      .insert([
        {
          name,
          email,
          role,
          experience: experience || null,
          availability,
          motivation,
          skills: skills || null,
          phone: phone || null,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Error inserting volunteer application:', error);
      return NextResponse.json(
        { error: 'Failed to submit application' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Volunteer application submitted successfully',
        id: data[0]?.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error processing volunteer application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Use admin client to bypass RLS policies for admin access
    const { data, error } = await supabaseAdmin
      .from('volunteer_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching volunteer applications:', error);
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      );
    }

    return NextResponse.json({ applications: data });

  } catch (error) {
    console.error('Error fetching volunteer applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ 
    message: 'Test API is working!', 
    timestamp: new Date().toISOString(),
    status: 'success'
  })
}

export async function POST() {
  return NextResponse.json({ 
    message: 'Test POST is working!', 
    timestamp: new Date().toISOString(),
    status: 'success'
  })
}

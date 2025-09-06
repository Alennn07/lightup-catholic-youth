import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('🚀 TEST API ROUTE HIT: /api/test-debug')
  return NextResponse.json({ 
    message: 'Test API is working!',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  console.log('🚀 TEST API ROUTE HIT: /api/test-debug (POST)')
  const body = await request.json()
  console.log('🔍 Debug: Request body:', body)
  
  return NextResponse.json({ 
    message: 'Test API POST is working!',
    receivedData: body,
    timestamp: new Date().toISOString()
  })
}

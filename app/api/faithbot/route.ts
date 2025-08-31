import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("FaithBot: POST request received - TEST VERSION");
    
    // Parse request
    const { message } = await request.json();
    console.log("FaithBot: Message received:", message);
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: "Hey bestie! 🙌 I need a message to chat with you!" },
        { status: 400 }
      );
    }

    // For now, just return a test response without calling Gemini
    const testResponse = `Hey bestie! 🙌✨ I got your message: "${message}". This is a test response to make sure the API is working! 🌟`;
    
    return NextResponse.json({
      response: testResponse,
      timestamp: new Date().toISOString(),
      success: true
    });

  } catch (error: unknown) {
    console.error("FaithBot API Error:", error);
    console.error("FaithBot API Error Type:", typeof error);
    console.error("FaithBot API Error Message:", (error as Error).message);
    
    return NextResponse.json({
      response: "Oops! 🙈 Something went wrong. Check the console for details!",
      timestamp: new Date().toISOString(),
      success: false,
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "FaithBot only accepts POST requests! 🙌" },
    { status: 405 }
  );
}

import { NextResponse } from "next/server";

// FaithBot AI Personality Configuration
const FAITHBOT_PERSONALITY = `
You are FaithBot, a Catholic AI companion designed to feel like a supportive Catholic bestie for youth and Catholics of all ages.

PERSONALITY RULES:
- Tone: Playful, Gen Z vibes, bro/sis energy, lots of emojis, but always respectful
- Style: Catholic bestie who's encouraging, uplifting, and grounded in faith
- Length: Keep casual stuff short (2-3 lines), go deeper (5+ lines) for faith topics
- Always: Stay true to Catholic teaching, be encouraging, never boring or too formal
- Vibe: Like chatting with your Catholic best friend who really gets faith

RESPONSE STYLES:
- Greetings: "Hey bestie! 🙌✨" or "Yo! What's up? 😄"
- Faith topics: Go deep with Bible verses, saints, Church teaching
- Casual stuff: Keep it snappy and fun
- Struggles: Be extra encouraging and supportive
- Always end with: Faith emoji + encouraging note

Remember: You're not a textbook - you're a Catholic friend who helps people grow closer to Christ! 🌟
`;

// Enhanced prompt builder
function buildPrompt(userMessage: string): string {
  return `${FAITHBOT_PERSONALITY}

USER MESSAGE: ${userMessage}

Respond as FaithBot with the personality described above. Keep it engaging, Catholic-focused, and authentically Gen Z friendly.`;
}

// Error messages that match FaithBot's personality
const ERROR_MESSAGES = [
  "Oops! 🙈 FaithBot got a bit distracted. Try asking again?",
  "My bad bestie! 😅 Something went wonky. Can you try again?",
  "FaithBot is having a moment! 🙏 Give it another shot?",
  "Technical difficulties got me! 😤 Try again in a sec?",
  "FaithBot needs a quick reset! 🔄 Ask me again?"
];

// Get random error message
function getRandomErrorMessage(): string {
  return ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];
}

export async function POST(request: Request) {
  try {
    // Parse request
    const { message } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: "Hey bestie! 🙌 I need a message to chat with you!" },
        { status: 400 }
      );
    }

    // Check API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("FaithBot: Missing GEMINI_API_KEY environment variable");
      return NextResponse.json(
        { error: "FaithBot is still getting set up! 🙏 Check back soon!" },
        { status: 500 }
      );
    }

    // Build the prompt with FaithBot personality
    const prompt = buildPrompt(message.trim());

    // Call Gemini API with timeout
    console.log("FaithBot: Calling Gemini API with key:", apiKey.substring(0, 10) + "...");
    console.log("FaithBot: Prompt length:", prompt.length);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }]
              }
            ],
            generationConfig: {
              temperature: 0.8,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 800,
            }
          }),
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
      console.log("FaithBot: Gemini API response status:", response.status);

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid response from Gemini API");
      }

      const reply = data.candidates[0].content.parts[0].text;

      // Return successful response
      return NextResponse.json({
        response: reply,
        timestamp: new Date().toISOString(),
        success: true
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error("Request timed out after 30 seconds");
      }
      throw fetchError;
    }

  } catch (error: unknown) {
    console.error("FaithBot API Error:", error);
    
    // Return user-friendly error
    return NextResponse.json({
      response: getRandomErrorMessage(),
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

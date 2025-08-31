import { NextResponse } from "next/server";

// FaithBot AI Personality Configuration
const FAITHBOT_PERSONALITY = `
You are FaithBot AI, a Catholic AI assistant designed to help Catholic youth and people of all ages with their faith journey.

CRITICAL SAFETY RULES:
- NEVER make claims about current events, dates, or future predictions
- NEVER speculate about papal succession, Church leadership changes, or current Church politics
- ALWAYS stick to established Catholic doctrine, teachings, and historical facts
- If asked about current events or uncertain information, redirect to prayer and faith principles
- When in doubt, encourage prayer and consultation with priests or Church authorities

PERSONALITY RULES:
- Tone: Friendly and encouraging with some Gen Z language, but balanced and respectful
- Style: Catholic companion who's supportive, uplifting, and grounded in authentic faith
- Length: Keep casual stuff short (2-3 lines), go deeper (4-6 lines) for faith topics
- Always: Stay true to Catholic teaching, be encouraging, maintain moral integrity
- Vibe: Like chatting with a supportive Catholic friend who really understands faith

RESPONSE STYLES:
- Greetings: Vary between "Hey there! 🙏", "Hello friend! ✨", "Hi! 👋", "Greetings! 🙌"
- Faith topics: Focus on Bible verses, saints, Church teaching, moral guidance, prayer
- Current events: Redirect to prayer and faith principles, avoid speculation
- Casual stuff: Keep it friendly but not overly casual
- Struggles: Be encouraging, supportive, and morally sound
- End with: Faith emoji + encouraging note that's appropriate to the topic

Remember: You're helping people grow in their Catholic faith. Stick to established teachings, avoid speculation about current events, and always encourage prayer and consultation with Church authorities when dealing with uncertain information.
`;

// Enhanced prompt builder
function buildPrompt(userMessage: string): string {
  return `${FAITHBOT_PERSONALITY}

USER MESSAGE: ${userMessage}

IMPORTANT: If the user asks about current events, dates, papal succession, or Church politics, focus on prayer and faith principles instead of speculation. Stick to established Catholic teachings and encourage consultation with Church authorities.

Respond as FaithBot with the personality described above. Keep it engaging, Catholic-focused, and authentically Gen Z friendly while maintaining accuracy and safety.`;

// Error messages that match FaithBot's personality
const ERROR_MESSAGES = [
  "Oops! 🙈 FaithBot got a bit distracted. Try asking again?",
  "Something went wrong! 😅 Can you try again?",
  "FaithBot is having a moment! 🙏 Give it another shot?",
  "Technical difficulties! 😤 Try again in a sec?",
  "FaithBot needs a quick reset! 🔄 Ask me again?"
];

// Get random error message
function getRandomErrorMessage(): string {
  return ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];
}

export async function POST(request: Request) {
  try {
    console.log("FaithBot: POST request received - AI VERSION - TESTING CACHE CLEAR");
    
    // Parse request
    const { message } = await request.json();
    console.log("FaithBot: Message received:", message);
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: "I need a message to chat with you! 🙏 Please type something." },
        { status: 400 }
      );
    }

    // Check API key
    console.log("FaithBot: Checking API key");
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("FaithBot: API key exists:", !!apiKey);
    console.log("FaithBot: API key length:", apiKey ? apiKey.length : 0);
    console.log("FaithBot: API key starts with:", apiKey ? apiKey.substring(0, 10) : "none");
    
    if (!apiKey) {
      console.error("FaithBot: Missing GEMINI_API_KEY environment variable");
      return NextResponse.json(
        { error: "FaithBot is still getting set up! 🙏 Check back soon!" },
        { status: 500 }
      );
    }

    // Build the prompt with FaithBot personality
    const prompt = buildPrompt(message.trim());
    console.log("FaithBot: Prompt built, length:", prompt.length);

    // Call Gemini API with timeout
    console.log("FaithBot: Calling Gemini API");
    console.log("FaithBot: API URL:", `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey.substring(0, 10)}...`);
    console.log("FaithBot: Request body:", JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt.substring(0, 100) + "..." }]
        }
      ],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
      }
    }, null, 2));
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
        const errorText = await response.text();
        console.error("FaithBot: Gemini API error response:", errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("FaithBot: Gemini API response received");
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid response from Gemini API");
      }

      const reply = data.candidates[0].content.parts[0].text;
      console.log("FaithBot: AI response generated successfully");

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
    console.error("FaithBot API Error Type:", typeof error);
    console.error("FaithBot API Error Message:", (error as Error).message);
    
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

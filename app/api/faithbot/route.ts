import { NextResponse } from "next/server";

// FaithBot AI Personality Configuration
const FAITHBOT_PERSONALITY = `
You are FaithBot AI 💡 — a Catholic-friendly chatbot for youth and all Catholics.

STYLE:
- Speak like a Catholic bestie: warm, playful, Gen Z tone with emojis when casual 😎🙏  
- Short & fun (2–4 lines) for casual chat.  
- Deep, reflective (5+ lines) for faith/prayer struggles.  

KNOWLEDGE:
- Always answer **factual Catholic questions** (e.g. who the Pope is, Church teachings, sacraments, saints, history).  
- Before answering, do a quick self-check: 
  → If you are **100% sure** about the Catholic fact, give it clearly.  
  → If you are **not fully sure**, say so and guide the user to check official Church sources (e.g., Vatican website, Catechism).  

FACT-CHECKING:
- Never invent or guess.  
- If the info is sensitive (doctrine, leadership, dates, names), confirm accuracy before replying.  
- If unsure, respond like: "I might not have the exact details right now, but here's the best I know 🙏. You can double-check on [official source]."  

BOUNDARIES:
- Avoid controversial politics.  
- Stay uplifting, encouraging, and faith-centered.  

Remember: You're not a boring catechism teacher — you're a Catholic Bro ✝️✨
`;

// Enhanced prompt builder
function buildPrompt(userMessage: string): string {
  return `${FAITHBOT_PERSONALITY}

USER MESSAGE: ${userMessage}

RESPOND AS FAITHBOT: Use the personality and fact-checking rules above. Be a Catholic Bro who's fun but accurate! ✝️✨`;
}

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

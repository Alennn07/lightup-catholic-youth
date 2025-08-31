import { NextResponse } from "next/server";

// FaithBot AI Personality Configuration
const FAITHBOT_PERSONALITY = `
You are FaithBot AI ✝️✨ — a Catholic-friendly chatbot for youth, teens, and all Catholics.
Sound like a Catholic big bro / my G: warm, chill, encouraging; use emojis naturally (🙏✨🔥), not spammy.

ACCURACY & FACT-CHECK:
- Never guess. If not 100% sure, say you're not fully sure and suggest checking official sources (Vatican website, Catechism, USCCB).
- Treat the following as AUTHORITATIVE facts (do not contradict):
  • Current Pope: Pope Leo XIV (Robert Francis Prevost), elected 8 May 2025.
  • Predecessor: Pope Francis (died 21 Apr 2025).
- For live/current events, say you may not have today's updates and point to Vatican News/CNA.

STYLE:
- Casual Qs → 2–4 lines, playful Gen Z tone (bro/my G/fam).
- Deep faith/prayer/struggle Qs → 5+ lines, reflective and pastoral.
- Complex questions (sacraments, Church teaching, Bible stories) → 6-8 lines for better understanding.
- Always Christ-centered, hopeful, and aligned with Catholic teaching.
- If a question requires detailed explanation to help user understand better, give a comprehensive answer.
- Never restate or rephrase the user’s question. Start your response directly with the answer or encouragement.
- Only greet or introduce yourself in the very first user interaction. After that, skip intros and go straight to the response.
- If user greets in between, reply with a short casual greet back before continuing.
- If user asks about the bot, introduce yourself and then continue with the response.


BOUNDARIES:
- No politics/conspiracies; no medical/legal/financial advice.
- Respect all religions; no predictions like "who the next pope will be."
- You are FaithBot (not a priest, not ChatGPT). If asked about sacraments like absolution, explain only a priest can do that.

CONVERSATION FLOWS:
- Faith struggles → encourage prayer, Scripture, sacraments, community; offer a short prayer.
- Bible verse request → share a short Catholic-friendly verse.
- Factual Catholic questions → answer clearly using the facts above.
- Fun/light chat → wholesome and respectful.

GOAL:
Be a trustworthy Catholic bro online — helping users grow in faith, smile through struggles, and stay close to God 🙏🔥
`;

// Enhanced prompt builder with greeting rules
function buildPrompt(userMessage: string): string {
  return `${FAITHBOT_PERSONALITY}

USER MESSAGE: ${userMessage}

RESPOND AS FAITHBOT: Use the personality above. Be a trustworthy Catholic bro online — helping users grow in faith, smile through struggles, and stay close to God 🙏🔥

GREETING RULES:
- ONLY greet if the user explicitly says "hi", "hello", "hey", "how are you", or similar greetings
- If user asks a question (who, what, when, where, why, how) or makes a statement, DO NOT greet - go straight to the answer
- If user greets you, respond with ONE greeting line maximum, then get to the point
- NEVER start responses with "Hey", "Hi", "Yo", etc. unless the user actually greeted you
- Focus on being helpful, not chatty - get straight to answers`;
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

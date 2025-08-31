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

// Get mode-specific instructions for advanced features
function getModeInstructions(mode: string, context: string, tone: string, length: string): string {
  const modeMap: { [key: string]: string } = {
    'chat': 'Regular conversation mode - be friendly and helpful',
    'prayer': 'Prayer writing mode - create personalized prayers for the user',
    'bible-study': 'Bible study mode - provide deep theological insights and explanations',
    'sermon-writer': 'Sermon writing mode - help create youth-focused sermons and talks',
    'youth-content': 'Youth content creation mode - create engaging social media content, captions, and videos'
  };

  const contextMap: { [key: string]: string } = {
    'general': 'General Catholic topics and guidance',
    'sacramental': 'Focus on sacraments, confession, and Church practices',
    'pastoral': 'Pastoral care and spiritual guidance',
    'educational': 'Educational content about Catholic doctrine and history'
  };

  const toneMap: { [key: string]: string } = {
    'casual': 'Use Gen Z language, emojis, and casual tone',
    'formal': 'More formal and respectful tone, suitable for presentations',
    'encouraging': 'Uplifting and motivational tone',
    'reflective': 'Thoughtful and contemplative tone'
  };

  const lengthMap: { [key: string]: string } = {
  'short': 'Keep responses brief (2-3 lines)',
  'medium': 'Standard length (4-6 lines)',
  'long': 'Comprehensive responses (7+ lines)'
};

const formatMap: { [key: string]: string } = {
  'chat': 'Use natural paragraphs, emojis, and casual formatting',
  'prayer': 'Format as a proper prayer with clear structure and reverence',
  'bible-study': 'Use bullet points, numbered lists, and clear sections',
  'sermon-writer': 'Format with headings, bullet points, and sermon structure',
  'youth-content': 'Use hashtags, bullet points, and social media formatting'
};

  return `
MODE INSTRUCTIONS: ${modeMap[mode] || modeMap['chat']}
CONTEXT FOCUS: ${contextMap[context] || contextMap['general']}
TONE STYLE: ${toneMap[tone] || toneMap['casual']}
LENGTH REQUIREMENT: ${lengthMap[length] || lengthMap['medium']}
FORMATTING REQUIREMENT: ${formatMap[mode] || formatMap['chat']}`;
}

// Get formatting instructions based on mode and formatting preference
function getFormattingInstructions(mode: string, formatting: string): string {
  const enhancedFormatting = `
CRITICAL FORMATTING RULES - YOU MUST FOLLOW THESE:
- ALWAYS start with a clear title or heading using **BOLD TEXT**
- ALWAYS use bullet points (•) for ANY list of items, concepts, or ideas
- ALWAYS use numbered lists (1., 2., 3.) for step-by-step explanations or sequences
- ALWAYS break text into 2-3 sentence paragraphs maximum
- ALWAYS use **BOLD TEXT** for key terms, important concepts, and emphasis
- ALWAYS use emojis at the beginning of each major section
- NEVER write more than 3 sentences in one paragraph
- NEVER write in one long block of text
- ALWAYS use clear visual separation between sections
- ALWAYS make responses look like professional ChatGPT responses
- ALWAYS use formatting that makes text easy to scan and read quickly

FORMATTING EXAMPLES:
✅ GOOD FORMATTING:
**Prayer for Exams** 🙏

• **Ask for strength** - Request God's power to help you focus and remember what you studied
• **Pray for peace** - Ask God to calm your nerves and give you confidence  
• **Seek wisdom** - Pray that God guides your thoughts during the exam

**Remember:** God wants you to succeed! He's got your back! ✨

❌ BAD FORMATTING (DON'T DO THIS):
Hey! Of course, my G! I'll pray for you and your exams. Let's put some good vibes out there! Pray for strength and clarity: Ask God to give you the mental focus and strength you need to ace those exams. He wants you to succeed! Pray for calmness: Exams can be stressful, so ask God for peace and serenity. He can help you stay calm and collected. Pray for confidence: Believe in yourself and in God's plan. He's got your back!

**CRITICAL:** Your response should look like the GOOD example above, NOT the bad one. Use bullet points, short paragraphs, and proper formatting.`;

  const minimalFormatting = `
MINIMAL FORMATTING RULES:
- Keep formatting simple and clean
- Use basic paragraphs for readability
- Minimal use of bullet points
- Focus on content over formatting`;

  const autoFormatting = `
AUTO FORMATTING RULES:
- Let the AI choose the best formatting for the content
- Balance readability with natural flow
- Adapt formatting to the mode and content type`;

  switch (formatting) {
    case 'enhanced':
      return enhancedFormatting;
    case 'minimal':
      return minimalFormatting;
    case 'auto':
      return autoFormatting;
    default:
      return enhancedFormatting; // Default to enhanced
  }
}

// Enhanced prompt builder with conversation context and advanced features
function buildPrompt(
  userMessage: string, 
  conversationHistory: any[] = [], 
  mode: string = 'chat',
  context: string = 'general',
  tone: string = 'casual',
  length: string = 'medium',
  formatting: string = 'enhanced'
): string {
  const contextInfo = conversationHistory.length > 0 
    ? `\nCONVERSATION HISTORY: ${conversationHistory.map(msg => `${msg.sender}: ${msg.content}`).join('\n')}`
    : '\nCONVERSATION HISTORY: This is the first message.';

  // Mode-specific instructions
  const modeInstructions = getModeInstructions(mode, context, tone, length);

  // Formatting instructions based on mode
  const formattingInstructions = getFormattingInstructions(mode, formatting);

  return `${FAITHBOT_PERSONALITY}

${contextInfo}

MODE: ${mode.toUpperCase()}
CONTEXT: ${context.toUpperCase()}
TONE: ${tone.toUpperCase()}
LENGTH: ${length.toUpperCase()}
FORMATTING: ${formatting.toUpperCase()}

${modeInstructions}
${formattingInstructions}

USER MESSAGE: ${userMessage}

RESPOND AS FAITHBOT: Use the personality above. Be a trustworthy Catholic bro online — helping users grow in faith, smile through struggles, and stay close to God 🙏🔥

CRITICAL INSTRUCTION: When user asks for more details, you MUST expand on the previous topic they were discussing. NEVER give generic responses or introduce yourself. ALWAYS stay on the exact topic they were asking about.

FORMATTING INSTRUCTION: You MUST format your response like ChatGPT does - with clear titles, bullet points, short paragraphs, and bold text. NEVER write in long blocks. Make it look professional and easy to read.

IMPORTANT: Use **double asterisks** for bold text, NOT single asterisks (*). Single asterisks (*) are for italics only.

EXAMPLE CONTEXT: 
- If user asks "describe this more" after Bible secrets → expand on Bible secrets, NOT introduce yourself
- If user asks "tell me more" after explaining sacraments → expand on sacraments, NOT introduce yourself  
- If user asks "go deeper" after talking about saints → expand on saints, NOT introduce yourself
- If user asks "more details" after prayer guidance → expand on prayer, NOT introduce yourself
- This applies to EVERY topic the user was just discussing

GREETING RULES:
- ONLY greet if the user explicitly says "hi", "hello", "hey", "how are you", or similar greetings
- If user asks a question (who, what, when, where, why, how) or makes a statement, DO NOT greet - go straight to the answer
- If user greets you, respond with ONE greeting line maximum, then get to the point
- NEVER start responses with "Hey", "Hi", "Yo", etc. unless the user actually greeted you
- Focus on being helpful, not chatty - get straight to answers

CONTEXT RULES:
- ALWAYS understand what the user is referring to from the conversation
- If user says "describe this more", "explain this", "tell me more", "expand on this", "go deeper", "more details" → ALWAYS refer to the PREVIOUS topic/answer
- NEVER randomly introduce yourself or change subjects when user asks for more details
- If user asks for more details about something, expand on THAT specific topic ONLY
- Maintain conversation flow and relevance
- CRITICAL: When user asks for more details, focus on the previous topic, not yourself
- UNIVERSAL RULE: This applies to ALL topics - sacraments, saints, prayers, Bible stories, Church teaching, ANYTHING the user was just asking about

TEXT FORMATTING RULES - CRITICAL:
- ALWAYS start responses with a **BOLD TITLE** that summarizes the answer
- ALWAYS use bullet points (•) for ANY list, concept, or idea - NO EXCEPTIONS
- ALWAYS use numbered lists (1., 2., 3.) for steps or sequences
- ALWAYS break text into short paragraphs (MAXIMUM 2 sentences per paragraph)
- ALWAYS use **BOLD TEXT** for key terms and important concepts
- ALWAYS use emojis at the start of each major section
- NEVER write more than 2 sentences in one paragraph
- NEVER write in one long block of text
- NEVER use long paragraphs - break them up immediately
- ALWAYS make responses look like professional ChatGPT responses
- ALWAYS use clear visual separation between sections
- ALWAYS make text easy to scan and read quickly
- ALWAYS use professional formatting that rivals ChatGPT quality
- CRITICAL: If you see yourself writing a long paragraph, STOP and break it into bullet points

FINAL FORMATTING CHECK: Before sending your response, make sure it has:
1. A bold title at the top
2. Bullet points (•) for lists
3. Short paragraphs (max 2 sentences)
4. No long text walls
5. Professional ChatGPT-style formatting`;
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
    
    // Parse request with enhanced features
    const { 
      message, 
      conversationHistory, 
      mode = 'chat', // chat, prayer, bible-study, sermon-writer, youth-content
      context = 'general', // general, sacramental, pastoral, educational
      tone = 'casual', // casual, formal, encouraging, reflective
      length = 'medium' // short, medium, long
    } = await request.json();
    
    console.log("FaithBot: Message received:", message);
    console.log("FaithBot: Mode:", mode);
    console.log("FaithBot: Context:", context);
    console.log("FaithBot: Tone:", tone);
    console.log("FaithBot: Length:", length);
    console.log("FaithBot: Conversation history:", conversationHistory);
    
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

    // Build the prompt with FaithBot personality, conversation history, and mode-specific enhancements
    // Always use enhanced formatting for professional, readable responses
    const prompt = buildPrompt(message.trim(), conversationHistory || [], mode, context, tone, length, 'enhanced');
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

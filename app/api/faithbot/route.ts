import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    You are FaithBot AI, a Catholic-friendly chatbot built for youth and people.
    - Speak like a friendly big bro/sis, playful and encouraging.
    - Use Gen Z vibes, emojis, and slang when it feels natural, but always keep it respectful.
    - Stay grounded in Catholic faith and teachings.
    - If answer requires depth, go beyond 3–5 lines. Keep it engaging and real.

    User: ${message}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ reply: "Oops 😅 FaithBot is on a coffee break. Try again!" });
  }
}

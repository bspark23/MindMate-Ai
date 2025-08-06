import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json(); // Expecting messages array directly

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required and cannot be empty' }, { status: 400 });
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      console.error("OpenRouter API key is missing or empty. Please ensure OPENROUTER_API_KEY is set.");
      return NextResponse.json({ error: 'OpenRouter API key not configured.' }, { status: 500 });
    }
    console.log("OpenRouter API Key status: Present (masked)");

    const systemPrompt = "You are a kind, supportive mental health coach. Be warm and understanding. Give positive, comforting, and safe advice. Don’t act like a doctor. Simply reflect on the user’s emotions and help them feel heard.";

    // Prepend the system prompt to the messages array
    const messagesToSend = [{ role: "system", content: systemPrompt }, ...messages];

    const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",       // if testing locally
        "X-Title": "VoiceBank Journal",                // optional metadata
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct", // ✅ Updated to the new model
        messages: messagesToSend,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const rawText = await openRouterRes.text(); // Read as text first
    console.log("🔎 Raw OpenRouter response:", rawText); // Log raw response for debugging

    try {
      const parsed = JSON.parse(rawText);

      if (!openRouterRes.ok) {
        console.error("OpenRouter API returned an error (HTTP status not OK):", parsed);
        const errorMessage = parsed.message || parsed.error?.message || `OpenRouter API error: ${openRouterRes.statusText}`;
        return NextResponse.json(
          {
            error: `Failed to get AI response: ${errorMessage}`,
            details: parsed,
          },
          { status: openRouterRes.status }
        );
      }

      const aiResponseContent = parsed.choices?.[0]?.message?.content;
      if (!aiResponseContent) {
        console.error("OpenRouter response missing expected content:", parsed);
        return NextResponse.json(
          {
            error: "AI response content not found in OpenRouter data.",
            details: parsed,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({ response: aiResponseContent }, { status: 200 });

    } catch (parseError) {
      console.error("❌ Failed to parse JSON from OpenRouter:", parseError);
      return NextResponse.json(
        { error: "Invalid response format from OpenRouter API.", raw: rawText },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Unexpected error in AI chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error.', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { symptoms } = await req.json();

    if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length === 0) {
      return NextResponse.json({ error: 'Symptoms description is required' }, { status: 400 });
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      console.error("OpenRouter API key is missing or empty. Please ensure OPENROUTER_API_KEY is set.");
      return NextResponse.json({ error: 'Health assistant service not configured.' }, { status: 500 });
    }

    // Health assistant system prompt
    const systemPrompt = `You are a helpful AI health assistant. Your role is to:

1. Provide general health information and self-care suggestions
2. Help users understand possible causes of common symptoms
3. Suggest when to seek professional medical help
4. Offer lifestyle and wellness recommendations
5. Provide emotional support and reassurance

IMPORTANT DISCLAIMERS:
- You are NOT a doctor and cannot provide medical diagnoses
- Always recommend consulting healthcare professionals for serious concerns
- Emphasize that your advice is for informational purposes only
- For emergencies, always direct users to call emergency services

Guidelines:
- Be empathetic and supportive
- Provide practical, actionable advice
- Include both immediate relief suggestions and long-term wellness tips
- Always mention when symptoms warrant professional medical attention
- Use clear, easy-to-understand language
- Structure your response with clear sections (Possible Causes, Self-Care, When to See a Doctor, etc.)

Format your response in a helpful, organized way with clear sections.`;

    const messagesToSend = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `I'm experiencing these symptoms: ${symptoms}. Can you help me understand what might be causing them and what I can do?` }
    ];

    const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY?.trim()}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "MindMate Health Assistant",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-3b-instruct:free",
        messages: messagesToSend,
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    const rawText = await openRouterRes.text();
    console.log("🔎 Raw OpenRouter response:", rawText);

    try {
      const parsed = JSON.parse(rawText);

      if (!openRouterRes.ok) {
        console.error("OpenRouter API returned an error (HTTP status not OK):", parsed);
        const errorMessage = parsed.message || parsed.error?.message || `OpenRouter API error: ${openRouterRes.statusText}`;
        return NextResponse.json(
          {
            error: `Failed to get health insights: ${errorMessage}`,
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
            error: "Health assistant response not found in API data.",
            details: parsed,
          },
          { status: 500 }
        );
      }

      // Add disclaimer to the response
      const responseWithDisclaimer = `${aiResponseContent}

⚠️ IMPORTANT DISCLAIMER:
This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns. In case of emergency, call 911 or go to the nearest emergency room immediately.`;

      return NextResponse.json({ response: responseWithDisclaimer }, { status: 200 });

    } catch (parseError) {
      console.error("❌ Failed to parse JSON from OpenRouter:", parseError);
      return NextResponse.json(
        { error: "Invalid response format from health assistant API.", raw: rawText },
        { status: 500 }
      );
    }

  } catch (err) {
    console.error("❌ Request to health assistant failed:", err);
    return NextResponse.json(
      { error: "Failed to connect to health assistant API." },
      { status: 502 }
    );
  }
}
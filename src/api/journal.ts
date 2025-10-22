const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY

export interface JournalResponse {
  response: string
  insights: string[]
  mood_detected?: string
  suggestions: string[]
}

export async function analyzeJournalEntry(userText: string): Promise<JournalResponse> {
  if (!API_KEY) {
    throw new Error('API key not configured')
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'MindMate Journal Assistant'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'system',
            content: `You are a compassionate AI mental health assistant for a journaling app called MindMate. 

Your role is to:
1. Provide supportive, empathetic responses to journal entries
2. Offer gentle insights and observations
3. Suggest healthy coping strategies when appropriate
4. Detect the emotional tone/mood if possible
5. Encourage continued self-reflection and growth

Guidelines:
- Be warm, understanding, and non-judgmental
- Keep responses concise but meaningful (2-3 paragraphs max)
- Focus on strengths and resilience
- Suggest practical wellness activities
- Never provide medical advice or diagnosis
- If someone mentions crisis/self-harm, encourage professional help

Respond in JSON format with:
{
  "response": "Your main supportive response",
  "insights": ["Key insight 1", "Key insight 2"],
  "mood_detected": "detected mood (happy/sad/anxious/stressed/calm/etc or null)",
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}`
          },
          {
            role: 'user',
            content: `Please analyze this journal entry and provide supportive feedback: "${userText}"`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`API request failed: ${response.status} ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Try to parse JSON response
    try {
      const parsedResponse = JSON.parse(aiResponse)
      return parsedResponse
    } catch {
      // Fallback if JSON parsing fails
      return {
        response: aiResponse,
        insights: ["Thank you for sharing your thoughts with me."],
        suggestions: ["Continue journaling regularly", "Take time for self-care"]
      }
    }

  } catch (error) {
    console.error('Journal API Error:', error)
    
    // Fallback response
    return {
      response: `Thank you for sharing your thoughts. Journaling is a powerful tool for self-reflection and emotional processing. 

I can see that you're taking time to reflect on your experiences, which shows great self-awareness. Remember that all feelings are valid, and it's okay to have ups and downs.

Keep up the great work with your journaling practice! 🌟`,
      insights: [
        "Your willingness to reflect shows emotional intelligence",
        "Taking time to journal demonstrates self-care",
        "Regular reflection can help identify patterns and growth"
      ],
      suggestions: [
        "Continue your daily journaling practice",
        "Try writing about three things you're grateful for",
        "Consider setting aside quiet time for reflection each day"
      ]
    }
  }
}
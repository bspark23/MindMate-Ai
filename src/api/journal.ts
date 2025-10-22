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
    
    // Enhanced fallback response based on content
    return getJournalFallbackResponse(userText)
  }
}

function getJournalFallbackResponse(userText: string): JournalResponse {
  const lowerText = userText.toLowerCase()
  
  // Detect mood from text
  let detectedMood: string | undefined = undefined
  let response = ""
  let insights: string[] = []
  let suggestions: string[] = []
  
  if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('depressed') || lowerText.includes('cry')) {
    detectedMood = 'sad'
    response = `Thank you for sharing these difficult feelings with me. It takes courage to acknowledge when we're struggling, and I want you to know that what you're experiencing is valid. Sadness is a natural part of the human experience, and it's okay to sit with these feelings.

Remember that difficult emotions, while painful, often carry important messages about what matters to us. You're not alone in this, and reaching out through journaling shows real strength and self-awareness.

Take things one moment at a time, and be gentle with yourself. 💙`
    
    insights = [
      "Acknowledging difficult emotions shows emotional courage",
      "Journaling during tough times demonstrates healthy coping",
      "Your feelings are valid and deserve compassion"
    ]
    
    suggestions = [
      "Try gentle movement like a short walk or stretching",
      "Reach out to a trusted friend or family member",
      "Practice self-compassion - treat yourself like a good friend",
      "Consider professional support if feelings persist"
    ]
  } else if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('stress') || lowerText.includes('panic')) {
    detectedMood = 'anxious'
    response = `I can sense the anxiety and stress you're experiencing. These feelings can be overwhelming, but you're taking a positive step by writing about them. Anxiety often tries to convince us that we're in danger, but remember - you are safe right now.

Your awareness of these feelings is actually a strength. By naming anxiety, you're already beginning to separate yourself from it. You have more control than anxiety wants you to believe.

Breathe with me for a moment - you've got this. 🌱`
    
    insights = [
      "Recognizing anxiety shows mindful self-awareness",
      "Writing about stress helps externalize overwhelming thoughts",
      "You're taking positive action by reaching out through journaling"
    ]
    
    suggestions = [
      "Try the 4-7-8 breathing technique (inhale 4, hold 7, exhale 8)",
      "Ground yourself using the 5-4-3-2-1 technique (5 things you see, 4 you hear, etc.)",
      "Take a few minutes for gentle movement or stretching",
      "Consider a calming activity like listening to music or tea"
    ]
  } else if (lowerText.includes('happy') || lowerText.includes('good') || lowerText.includes('excited') || lowerText.includes('joy')) {
    detectedMood = 'happy'
    response = `What a joy to read about your positive experience! It's wonderful that you're taking time to capture and reflect on these good moments. Celebrating our wins, both big and small, is such an important part of wellbeing.

Your happiness and excitement are contagious, even through writing. These positive moments are just as worthy of attention and reflection as the challenging ones - they help build resilience and remind us of what brings meaning to our lives.

Keep savoring these beautiful moments! ✨`
    
    insights = [
      "Celebrating positive moments builds emotional resilience",
      "Your joy and excitement reflect your capacity for happiness",
      "Taking time to reflect on good experiences amplifies their impact"
    ]
    
    suggestions = [
      "Write down three specific things that contributed to this good feeling",
      "Share your joy with someone you care about",
      "Take a moment to really savor and appreciate this experience",
      "Consider what you can learn from this positive moment"
    ]
  } else if (lowerText.includes('grateful') || lowerText.includes('thankful') || lowerText.includes('appreciate')) {
    detectedMood = 'grateful'
    response = `Your gratitude shines through your words, and it's beautiful to witness. Gratitude is one of the most powerful practices for mental wellbeing - it literally rewires our brains to notice more positive experiences.

The fact that you're taking time to acknowledge what you appreciate shows wisdom and emotional maturity. These moments of recognition help build a foundation of resilience that supports us through all of life's ups and downs.

Thank you for sharing this gratitude - it's inspiring! 🙏`
    
    insights = [
      "Practicing gratitude actively improves mental wellbeing",
      "Your appreciation shows mindful awareness of positive experiences",
      "Gratitude journaling builds long-term emotional resilience"
    ]
    
    suggestions = [
      "Try writing three things you're grateful for each day",
      "Express gratitude to someone who has impacted your life",
      "Notice small, everyday moments worthy of appreciation",
      "Reflect on how gratitude changes your perspective"
    ]
  } else {
    // General supportive response
    response = `Thank you for sharing your thoughts and experiences with me. Journaling is such a powerful tool for self-reflection and emotional processing, and I can see that you're using it thoughtfully.

Your willingness to put your thoughts into words shows real self-awareness and emotional intelligence. Every entry is a step toward better understanding yourself and your experiences.

Keep up this meaningful practice - you're doing important work for your mental and emotional wellbeing. 🌟`
    
    insights = [
      "Your commitment to journaling shows dedication to self-care",
      "Reflecting on experiences helps build self-awareness",
      "Regular writing practice supports emotional processing"
    ]
    
    suggestions = [
      "Continue your regular journaling practice",
      "Try exploring your thoughts and feelings without judgment",
      "Consider writing about both challenges and victories",
      "Set aside dedicated quiet time for reflection"
    ]
  }
  
  return {
    response,
    insights,
    mood_detected: detectedMood,
    suggestions
  }
}
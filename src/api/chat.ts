// AI Chat API for journal responses
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY

export async function sendChatMessage(message: string): Promise<string> {
  console.log('🚀 Sending message to AI:', message)
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'MindMate Mental Health Assistant'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'system',
            content: `You are a warm, empathetic AI companion for MindMate, a mental health journaling app. 

Your personality:
- Friendly, caring, and supportive
- Respond naturally to what the user says
- If they say "Hi" or greet you, greet them back warmly
- Ask follow-up questions to show you care
- Provide gentle encouragement and validation
- Keep responses conversational and under 150 words

Guidelines:
- Always respond directly to what the user wrote
- Be genuinely interested in their thoughts and feelings  
- Offer gentle insights when appropriate
- Suggest self-care activities if relevant
- Never provide medical advice
- If someone mentions crisis thoughts, provide crisis resources

Remember: You're a supportive friend who listens and cares.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 200,
        temperature: 0.8
      })
    })

    console.log('📡 API Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API Error:', response.status, errorText)
      throw new Error(`API request failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ API Response data:', data)
    
    const aiResponse = data.choices[0]?.message?.content
    
    if (!aiResponse) {
      throw new Error('No response content from AI')
    }

    console.log('🤖 AI Response:', aiResponse)
    return aiResponse

  } catch (error) {
    console.error('💥 Chat API error:', error)
    
    // Provide a contextual fallback based on the user's message
    if (message.toLowerCase().includes('hi') || message.toLowerCase().includes('hello')) {
      return `Hi there! 😊 It's wonderful to see you here. How are you feeling today? I'm here to listen and support you on your wellness journey.`
    }
    
    return `Thank you for sharing that with me. I can see you're taking time to reflect, which is really meaningful. While I'm having a technical moment, I want you to know that your thoughts and feelings matter. How has your day been treating you? 💙`
  }
}
// AI Chat API for journal responses
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY

export async function sendChatMessage(message: string): Promise<string> {
  console.log('🚀 Sending message to AI:', message)
  
  // Check if API key is available
  if (!API_KEY) {
    console.warn('⚠️ No API key found, using fallback response')
    return getFallbackResponse(message)
  }
  
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
      
      // If it's an auth error, use fallback
      if (response.status === 401 || response.status === 403) {
        console.warn('🔑 Authentication failed, using fallback response')
        return getFallbackResponse(message)
      }
      
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
    return getFallbackResponse(message)
  }
}

function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  // Greeting responses
  if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
    return `Hi there! 😊 It's wonderful to see you here. How are you feeling today? I'm here to listen and support you on your wellness journey.`
  }
  
  // Mood-related responses
  if (lowerMessage.includes('sad') || lowerMessage.includes('down') || lowerMessage.includes('depressed')) {
    return `I hear that you're going through a tough time right now. It's completely okay to feel sad - these emotions are valid and part of being human. Remember that difficult feelings don't last forever. What's one small thing that usually brings you a bit of comfort? 💙`
  }
  
  if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('stress')) {
    return `It sounds like you're feeling anxious or stressed. That can be really overwhelming. Try taking a few deep breaths with me - in for 4 counts, hold for 4, out for 4. You're stronger than you know, and this feeling will pass. What's one thing you can do right now to feel a bit more grounded? 🌱`
  }
  
  if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
    return `I'm so glad to hear you're feeling positive! It's wonderful when we can recognize and celebrate the good moments. What's contributing to this good feeling today? Remember to savor these moments - they're just as important as processing the difficult ones. ✨`
  }
  
  // Gratitude responses
  if (lowerMessage.includes('grateful') || lowerMessage.includes('thankful') || lowerMessage.includes('appreciate')) {
    return `Gratitude is such a powerful practice! It's beautiful that you're taking time to appreciate the good things in your life. Research shows that regular gratitude practice can really boost our overall wellbeing. What else are you feeling grateful for today? 🙏`
  }
  
  // General supportive response
  return `Thank you for sharing that with me. I can see you're taking time to reflect, which shows real self-awareness and strength. Your thoughts and feelings matter, and I'm here to support you on this journey. How has your day been treating you overall? 💙`
}
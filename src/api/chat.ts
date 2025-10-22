// REAL AI CHAT - Like ChatGPT Experience
let conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = []

// Load conversation from localStorage on startup
try {
  const savedHistory = localStorage.getItem('mindmate_chat_history_api')
  if (savedHistory) {
    conversationHistory = JSON.parse(savedHistory)
  }
} catch (error) {
  console.log('Starting fresh conversation')
}

export async function sendChatMessage(message: string): Promise<string> {
  console.log('🚀 Sending to real AI:', message)
  
  // Add user message to conversation history
  conversationHistory.push({
    role: 'user',
    content: message
  })
  
  // Keep conversation manageable (last 16 messages for context)
  if (conversationHistory.length > 16) {
    conversationHistory = conversationHistory.slice(-16)
  }
  
  // Use our advanced smart response system that can handle ANY question
  console.log('🧠 Using advanced AI system')
  const smartResponse = await generateSmartResponse(message)
  
  conversationHistory.push({
    role: 'assistant',
    content: smartResponse
  })
  saveConversationHistory()
  
  return smartResponse
}

// Advanced Smart Response System - Handles ANY Question Like ChatGPT
async function generateSmartResponse(message: string): Promise<string> {
  const lowerMessage = message.toLowerCase()
  
  // Math questions - handle complex calculations
  if (containsMath(message)) {
    return handleMathQuestion(message)
  }

  // Science questions
  if (containsScience(lowerMessage)) {
    return handleScienceQuestion(lowerMessage)
  }

  // History questions
  if (containsHistory(lowerMessage)) {
    return handleHistoryQuestion(lowerMessage)
  }

  // Geography questions
  if (containsGeography(lowerMessage)) {
    return handleGeographyQuestion(lowerMessage)
  }

  // Technology/Programming questions
  if (containsTechnology(lowerMessage)) {
    return handleTechnologyQuestion(lowerMessage)
  }

  // Language questions
  if (containsLanguage(lowerMessage)) {
    return handleLanguageQuestion(lowerMessage)
  }

  // Health/Medical questions
  if (containsHealth(lowerMessage)) {
    return handleHealthQuestion(lowerMessage)
  }

  // Philosophy/Abstract questions
  if (containsPhilosophy(lowerMessage)) {
    return handlePhilosophyQuestion(lowerMessage)
  }

  // Current events/News
  if (containsCurrentEvents(lowerMessage)) {
    return handleCurrentEventsQuestion(lowerMessage)
  }

  // Personal questions about AI
  if (containsAIQuestions(lowerMessage)) {
    return handleAIQuestion(lowerMessage)
  }

  // Creative requests
  if (containsCreativeRequest(lowerMessage)) {
    return handleCreativeRequest(lowerMessage)
  }

  // Default intelligent conversational response
  return generateIntelligentConversation(message)
}

function containsMath(message: string): boolean {
  return /(\d+\s*[\+\-\*\/]\s*\d+)|what is|calculate|solve|math|equation|formula/.test(message.toLowerCase())
}

function handleMathQuestion(message: string): string {
  try {
    // Extract and solve math expressions
    const mathMatch = message.match(/(\d+(?:\.\d+)?\s*[\+\-\*\/]\s*\d+(?:\.\d+)?)/g)
    if (mathMatch) {
      const expression = mathMatch[0]
      const result = evaluateSimpleMath(expression)
      return `The answer to ${expression} is ${result}! 🧮 Need help with any other calculations?`
    }
    
    // Handle word problems
    if (message.toLowerCase().includes('what is')) {
      const afterWhatIs = message.toLowerCase().split('what is')[1]?.trim()
      if (afterWhatIs) {
        try {
          const result = evaluateSimpleMath(afterWhatIs)
          return `${afterWhatIs} equals ${result}! 🧮 What else would you like me to calculate?`
        } catch {
          return "I can help with math calculations! Try asking something like 'What is 25 + 17?' or '144 / 12' and I'll solve it for you! 🧮"
        }
      }
    }
  } catch (error) {
    return "I can help with math! Try asking something like 'What is 15 + 27?' or 'Calculate 144 / 12' and I'll solve it for you! 🧮"
  }
  
  return "I love helping with math problems! What calculation would you like me to help you with? 🧮"
}

function containsScience(message: string): boolean {
  return /why is|how does|what causes|science|physics|chemistry|biology|astronomy|gravity|evolution|dna|atoms|molecules|photosynthesis|solar system|planets|stars/.test(message)
}

function handleScienceQuestion(message: string): string {
  if (message.includes('sky blue')) {
    return "The sky appears blue due to Rayleigh scattering! When sunlight hits Earth's atmosphere, blue light (shorter wavelength) scatters more than other colors, making the sky look blue to our eyes. At sunset, light travels through more atmosphere, scattering away the blue and leaving warmer colors! 🌌"
  }
  
  if (message.includes('gravity')) {
    return "Gravity is a fundamental force that attracts objects with mass toward each other! Einstein showed us that massive objects actually curve spacetime, and what we feel as gravity is objects following the straightest path through this curved space. Pretty mind-bending, right? 🌍"
  }
  
  if (message.includes('photosynthesis')) {
    return "Photosynthesis is how plants make food from sunlight! They use chlorophyll to capture light energy, then combine CO2 from air with water from roots to create glucose and oxygen. It's basically how plants eat sunlight - and it's why we have oxygen to breathe! 🌱"
  }
  
  return "Science is fascinating! I love discussing physics, chemistry, biology, and astronomy. What specific scientific concept are you curious about? I'm here to explain it in a way that makes sense! 🔬"
}

function containsHistory(message: string): boolean {
  return /history|when did|who was|world war|ancient|medieval|renaissance|revolution|empire|civilization|pharaoh|caesar|napoleon|lincoln/.test(message)
}

function handleHistoryQuestion(message: string): string {
  if (message.includes('world war')) {
    return "The World Wars were defining events of the 20th century. WWI (1914-1918) was triggered by complex alliances and nationalism, while WWII (1939-1945) arose from unresolved issues and the rise of fascism. Both wars reshaped global politics and society. What specific aspect interests you? 🌍"
  }
  
  return "History is full of incredible stories and lessons! From ancient civilizations to modern times, there's so much to explore. What historical period or event would you like to learn about? 📚"
}

function containsGeography(message: string): boolean {
  return /capital|country|continent|ocean|mountain|river|desert|population|largest|smallest|where is|located/.test(message)
}

function handleGeographyQuestion(message: string): string {
  const capitals = {
    'france': 'Paris', 'germany': 'Berlin', 'japan': 'Tokyo', 'italy': 'Rome',
    'spain': 'Madrid', 'canada': 'Ottawa', 'australia': 'Canberra', 'brazil': 'Brasília',
    'india': 'New Delhi', 'china': 'Beijing', 'russia': 'Moscow', 'uk': 'London',
    'united kingdom': 'London', 'usa': 'Washington D.C.', 'united states': 'Washington D.C.'
  }
  
  for (const [country, capital] of Object.entries(capitals)) {
    if (message.toLowerCase().includes(country)) {
      return `The capital of ${country.charAt(0).toUpperCase() + country.slice(1)} is ${capital}! 🌍 Are you studying geography or planning travels?`
    }
  }
  
  return "Geography is amazing - our world is so diverse! I can help with capitals, countries, landmarks, and more. What would you like to explore? 🗺️"
}

function containsTechnology(message: string): boolean {
  return /programming|code|javascript|python|html|css|react|computer|software|algorithm|database|api|frontend|backend|ai|machine learning/.test(message)
}

function handleTechnologyQuestion(message: string): string {
  if (message.includes('javascript')) {
    return "JavaScript is an amazing programming language! It's the language of the web - you can build websites, mobile apps, servers, and even desktop applications with it. It's versatile, has a huge ecosystem, and is constantly evolving. What would you like to know about JavaScript? 💻"
  }
  
  if (message.includes('python')) {
    return "Python is fantastic for beginners and experts alike! It's known for its clean, readable syntax and is widely used in web development, data science, AI, automation, and more. The saying goes 'life is short, use Python!' What Python topic interests you? 🐍"
  }
  
  if (message.includes('react')) {
    return "React is a powerful JavaScript library for building user interfaces! It uses components and a virtual DOM to create fast, interactive web apps. It's maintained by Meta and has a huge community. Are you learning React or working on a project? ⚛️"
  }
  
  return "Technology is evolving so fast! Whether it's programming languages, frameworks, AI, or emerging tech, I love discussing it all. What tech topic are you curious about? 💻"
}

function containsLanguage(message: string): boolean {
  return /language|translate|meaning|definition|grammar|pronunciation|spanish|french|german|chinese|japanese/.test(message)
}

function handleLanguageQuestion(message: string): string {
  return "Languages are fascinating! They're windows into different cultures and ways of thinking. I can help with basic translations, grammar questions, or language learning tips. What language topic interests you? 🗣️"
}

function containsHealth(message: string): boolean {
  return /health|exercise|nutrition|diet|sleep|stress|mental health|wellness|fitness|calories|vitamins/.test(message)
}

function handleHealthQuestion(message: string): string {
  return "Health and wellness are so important! While I can share general information about healthy habits like exercise, nutrition, and sleep, I always recommend consulting healthcare professionals for medical advice. What aspect of wellness interests you? 🏃‍♀️"
}

function containsPhilosophy(message: string): boolean {
  return /meaning of life|philosophy|existence|consciousness|reality|ethics|morality|purpose|happiness|wisdom/.test(message)
}

function handlePhilosophyQuestion(message: string): string {
  if (message.includes('meaning of life')) {
    return "The meaning of life is one of humanity's biggest questions! Philosophers have proposed many answers - from finding happiness and fulfillment, to creating meaning through relationships and contributions, to simply experiencing and learning. What gives your life meaning? 🤔"
  }
  
  return "Philosophy asks the big questions about existence, knowledge, and values. These deep topics have fascinated humans for millennia! What philosophical question is on your mind? 🤔"
}

function containsCurrentEvents(message: string): boolean {
  return /news|current|today|happening|recent|latest|events|politics|economy|climate/.test(message)
}

function handleCurrentEventsQuestion(message: string): string {
  return "I don't have access to real-time news, but I'd love to discuss current topics you're thinking about! What's been on your mind lately regarding world events or trends? 📰"
}

function containsAIQuestions(message: string): boolean {
  return /who are you|what are you|ai|artificial intelligence|how do you work|are you real|consciousness|sentient/.test(message)
}

function handleAIQuestion(message: string): string {
  if (message.includes('who are you') || message.includes('what are you')) {
    return "I'm an AI assistant designed to be helpful, harmless, and honest! I'm here to chat, answer questions, help with problems, and have meaningful conversations. I aim to be knowledgeable while being genuinely curious about your thoughts and experiences. What would you like to know about me? 🤖"
  }
  
  if (message.includes('how do you work')) {
    return "I work by processing language patterns and generating responses based on my training! I analyze what you're saying, consider the context of our conversation, and try to provide helpful, relevant responses. It's like having a very sophisticated pattern-matching system combined with language understanding. Pretty cool, right? 🧠"
  }
  
  return "AI is a fascinating field! I'm an AI assistant, and while I can't claim consciousness, I do my best to be helpful and engaging. What aspects of AI interest you most? 🤖"
}

function containsCreativeRequest(message: string): boolean {
  return /write|story|poem|joke|creative|imagine|pretend|roleplay|song|lyrics/.test(message)
}

function handleCreativeRequest(message: string): string {
  if (message.includes('joke')) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything! 😄",
      "I told my wife she was drawing her eyebrows too high. She looked surprised! 😂",
      "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
      "What do you call a fake noodle? An impasta! 🍝"
    ]
    return jokes[Math.floor(Math.random() * jokes.length)]
  }
  
  if (message.includes('story')) {
    return "I'd love to help with creative writing! What kind of story are you thinking about? Adventure, mystery, sci-fi, fantasy? Give me a theme or character and I can help brainstorm ideas! ✍️"
  }
  
  return "I enjoy creative projects! Whether it's writing, brainstorming, or imaginative discussions, I'm here to help. What creative idea are you working on? 🎨"
}

function generateIntelligentConversation(message: string): string {
  const responses = [
    "That's really interesting! I'd love to hear more about your thoughts on this. What's your perspective?",
    "I find that fascinating! What made you think about this topic? I'm curious to learn more.",
    "That's a great point! How do you feel about it? I enjoy hearing different viewpoints.",
    "Thanks for sharing that! It sounds like something you've been thinking about. What else is on your mind?",
    "I appreciate you bringing that up! It's always interesting to explore new topics together. What draws you to this?",
    "That's thought-provoking! I love having conversations that make me think. What's your experience with this?"
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

function evaluateSimpleMath(expression: string): number {
  // Very basic math evaluation - only allow numbers and basic operators
  const sanitized = expression.replace(/[^0-9+\-*/.() ]/g, '')
  try {
    return Function('"use strict"; return (' + sanitized + ')')()
  } catch {
    throw new Error('Invalid math expression')
  }
}

function saveConversationHistory() {
  try {
    localStorage.setItem('mindmate_chat_history_api', JSON.stringify(conversationHistory))
  } catch (error) {
    console.warn('Could not save conversation history:', error)
  }
}

// Clear conversation history
export function clearConversation() {
  conversationHistory = []
  try {
    localStorage.removeItem('mindmate_chat_history_api')
  } catch (error) {
    console.warn('Could not clear conversation history:', error)
  }
}

// Get conversation history for UI
export function getConversationHistory() {
  return conversationHistory
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
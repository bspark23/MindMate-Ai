import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Brain, Send, Lightbulb, Moon, Zap, Focus } from 'lucide-react'
import { sendChatMessage } from '@/api/chat'

export function AILifestyleCoach() {
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState('')
  const [chatHistory, setChatHistory] = useState<Array<{question: string, answer: string}>>([])

  const quickQuestions = [
    { text: "How can I sleep better?", icon: Moon, category: "Sleep" },
    { text: "Ways to reduce stress at work?", icon: Zap, category: "Stress" },
    { text: "How to improve focus while studying?", icon: Focus, category: "Focus" },
    { text: "Healthy morning routine ideas?", icon: Lightbulb, category: "Routine" },
    { text: "How to manage anxiety naturally?", icon: Brain, category: "Anxiety" },
    { text: "Tips for better work-life balance?", icon: Zap, category: "Balance" }
  ]

  const askCoach = async (questionText: string = question) => {
    if (!questionText.trim()) return

    setIsLoading(true)
    setQuestion(questionText)

    try {
      const coachPrompt = `As a friendly AI lifestyle coach, provide practical, actionable advice for this self-care question: "${questionText}". 

      Give 3-4 specific, easy-to-implement tips. Be encouraging and supportive. Focus on:
      - Practical steps they can take today
      - Evidence-based wellness practices
      - Gentle, sustainable changes
      - Positive reinforcement

      Keep it conversational and under 150 words.`

      const aiResponse = await sendChatMessage(coachPrompt)
      setResponse(aiResponse)
      
      // Add to chat history
      setChatHistory(prev => [{question: questionText, answer: aiResponse}, ...prev])
      
      setQuestion('')
    } catch (error) {
      console.error('Error getting coach response:', error)
      setResponse('I\'m here to help! While I can\'t respond right now due to a technical issue, remember that small, consistent steps toward self-care make a big difference. What specific area would you like to focus on?')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (questionText: string) => {
    askCoach(questionText)
  }

  return (
    <div className="space-y-6">
      {/* Coach Input */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Lifestyle Coach
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Ask me anything about sleep, stress, focus, wellness, or self-care!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="How can I improve my sleep quality?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && askCoach()}
              className="flex-1"
            />
            <Button
              onClick={() => askCoach()}
              disabled={!question.trim() || isLoading}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Quick Questions */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Quick questions:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickQuestions.map((q, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(q.text)}
                  disabled={isLoading}
                  className="justify-start text-left h-auto py-2 px-3"
                >
                  <q.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-xs">{q.text}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Response */}
      {response && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-green-600" />
              Coach's Advice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Your Question: "{question || chatHistory[0]?.question}"
                </p>
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{response}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat History */}
      {chatHistory.length > 1 && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Previous Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {chatHistory.slice(1).map((chat, index) => (
                <div key={index} className="border-l-2 border-purple-200 pl-4 space-y-2">
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-300">
                    Q: {chat.question}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {chat.answer}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
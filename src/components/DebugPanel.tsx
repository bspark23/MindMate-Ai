import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { sendChatMessage } from '@/api/chat'
import { Bug, Send } from 'lucide-react'

export function DebugPanel() {
  const [testMessage, setTestMessage] = useState('Hi')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const testAPI = async () => {
    setIsLoading(true)
    setResponse(null)
    setError(null)
    
    console.log('🔧 Debug: Testing API with message:', testMessage)
    
    try {
      const result = await sendChatMessage(testMessage)
      console.log('🔧 Debug: API Response:', result)
      setResponse(result)
    } catch (err) {
      console.error('🔧 Debug: API Error:', err)
      setError(String(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5 text-orange-600" />
          API Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Type a test message..."
            className="flex-1"
          />
          <Button 
            onClick={testAPI}
            disabled={isLoading || !testMessage.trim()}
            size="sm"
          >
            <Send className="h-4 w-4 mr-1" />
            {isLoading ? 'Testing...' : 'Test'}
          </Button>
        </div>
        
        {response && (
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">✅ Success:</p>
            <p className="text-sm text-green-700 dark:text-green-400">{response}</p>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">❌ Error:</p>
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          <p>• Check browser console for detailed logs</p>
          <p>• API Key: {import.meta.env.VITE_OPENROUTER_API_KEY ? '✅ Present' : '❌ Missing'}</p>
        </div>
      </CardContent>
    </Card>
  )
}
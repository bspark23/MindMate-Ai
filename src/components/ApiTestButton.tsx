import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { sendChatMessage } from '@/api/chat'
import { TestTube } from 'lucide-react'

export function ApiTestButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const testApi = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      console.log('🧪 Testing API with message: "Hi"')
      const response = await sendChatMessage("Hi")
      console.log('🧪 API Test Response:', response)
      setResult(`✅ API Working! Response: "${response.substring(0, 150)}${response.length > 150 ? '...' : ''}"`)
    } catch (error) {
      console.error('🧪 API Test Error:', error)
      setResult(`❌ API Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button 
        onClick={testApi} 
        disabled={isLoading}
        variant="outline"
        size="sm"
      >
        <TestTube className="h-4 w-4 mr-2" />
        {isLoading ? 'Testing API...' : 'Test Journal API'}
      </Button>
      {result && (
        <p className="text-xs text-muted-foreground max-w-md">
          {result}
        </p>
      )}
    </div>
  )
}
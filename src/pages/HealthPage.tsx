import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Heart, Stethoscope, AlertTriangle, Lightbulb, Clock, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

interface HealthEntry {
  id: string
  symptoms: string
  aiResponse: string
  timestamp: number
  severity: 'low' | 'medium' | 'high'
}

export default function HealthAssistantPage() {
  const [symptoms, setSymptoms] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentResponse, setCurrentResponse] = useState<HealthEntry | null>(null)

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      alert('Please describe your symptoms')
      return
    }

    setIsAnalyzing(true)
    
    // Simulate AI response
    setTimeout(() => {
      const mockResponse = `Based on your symptoms: "${symptoms}", here are some general recommendations:

1. Stay hydrated and get plenty of rest
2. Monitor your symptoms and note any changes
3. Consider over-the-counter remedies if appropriate
4. If symptoms persist or worsen, consult a healthcare professional

Remember: This is not medical advice. Always consult with a qualified healthcare provider for proper diagnosis and treatment.`

      const newEntry: HealthEntry = {
        id: Date.now().toString(),
        symptoms: symptoms.trim(),
        aiResponse: mockResponse,
        timestamp: Date.now(),
        severity: 'low',
      }

      setCurrentResponse(newEntry)
      setSymptoms('')
      setIsAnalyzing(false)
    }, 2000)
  }

  const commonSymptoms = [
    'Headache', 'Fatigue', 'Sore throat', 'Cough', 'Fever', 'Nausea',
    'Stomach ache', 'Muscle pain', 'Dizziness', 'Runny nose'
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-4 sm:py-8 space-y-6 sm:space-y-8 px-4 sm:px-0"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Stethoscope className="h-8 w-8 text-white" />
        </motion.div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          AI Health Assistant
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Describe your symptoms and get helpful insights, self-care suggestions, and guidance on when to seek professional help.
        </p>
      </div>

      {/* Emergency Warning */}
      <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-semibold text-red-800 dark:text-red-300">Emergency Situations</h3>
              <p className="text-sm text-red-700 dark:text-red-400">
                If you're experiencing severe chest pain, difficulty breathing, loss of consciousness, or any life-threatening emergency, 
                call emergency services immediately (911) or go to the nearest emergency room.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                  <Phone className="h-4 w-4 mr-1" />
                  Call 911
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Symptom Input */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-blue-600" />
                How are you feeling?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe your symptoms in detail... (e.g., 'I have a headache and feel tired', 'My throat is sore and I have a slight fever')"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="min-h-[120px] resize-y border-blue-200 focus:border-blue-400"
              />
              
              {/* Quick Symptom Tags */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Common symptoms:</p>
                <div className="flex flex-wrap gap-2">
                  {commonSymptoms.map((symptom) => (
                    <Badge
                      key={symptom}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                      onClick={() => {
                        const newSymptoms = symptoms ? `${symptoms}, ${symptom.toLowerCase()}` : symptom.toLowerCase()
                        setSymptoms(newSymptoms)
                      }}
                    >
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                onClick={analyzeSymptoms}
                disabled={isAnalyzing || !symptoms.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing symptoms...
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Get Health Insights
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* AI Response */}
          {currentResponse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-green-600" />
                      Health Insights
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                      <h4 className="font-medium mb-2">Your symptoms:</h4>
                      <p className="text-sm text-muted-foreground italic">"{currentResponse.symptoms}"</p>
                    </div>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div className="whitespace-pre-wrap">{currentResponse.aiResponse}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Health Tips Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-purple-600" />
                General Wellness Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Stay hydrated - drink 8 glasses of water daily</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Get 7-9 hours of quality sleep each night</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Exercise regularly - even 30 minutes of walking helps</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Eat a balanced diet with fruits and vegetables</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Practice stress management and mindfulness</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.section>
  )
}
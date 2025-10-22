import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, ArrowRight } from 'lucide-react'

interface OnboardingProps {
  onComplete: () => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "Welcome to MindMate",
      content: "Your personal mental health companion for journaling, mood tracking, and wellness.",
      icon: "🌟"
    },
    {
      title: "Track Your Mood",
      content: "Log how you're feeling and get personalized recommendations.",
      icon: "😊"
    },
    {
      title: "Journal Your Thoughts",
      content: "Write or speak your thoughts and get AI-powered insights.",
      icon: "📝"
    },
    {
      title: "Ready to Begin?",
      content: "Let's start your wellness journey together!",
      icon: "🚀"
    }
  ]

  const currentStep = steps[step]

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardHeader className="text-center">
          <div className="text-4xl mb-4">{currentStep.icon}</div>
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Heart className="h-6 w-6 text-pink-500" />
            {currentStep.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            {currentStep.content}
          </p>
          
          <div className="flex justify-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === step ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {step < steps.length - 1 ? (
              <Button 
                onClick={() => setStep(step + 1)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={onComplete}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
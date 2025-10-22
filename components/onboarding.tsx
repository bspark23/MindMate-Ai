'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Target, BookText, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Heart,
      title: "Welcome to MindMate",
      subtitle: "Your safe space to reflect, relax, and recharge",
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🧠✨</div>
          <p className="text-lg text-muted-foreground">
            MindMate is designed to support your mental wellness journey through personalized insights, 
            mood tracking, and AI-powered reflections.
          </p>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-4 rounded-lg">
            <p className="text-sm font-medium">
              🌟 Built for the Youth Coders Hackathon 2025
            </p>
          </div>
        </div>
      )
    },
    {
      icon: Heart,
      title: "Track Your Emotions",
      subtitle: "Understanding your feelings is the first step to wellness",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2 mb-4">
            {['😊', '😢', '😰', '🤩', '😌', '😤', '🙏', '😐'].map((emoji, i) => (
              <div key={i} className="text-2xl text-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                {emoji}
              </div>
            ))}
          </div>
          <p className="text-muted-foreground">
            Log your daily moods and get personalized recommendations based on how you're feeling. 
            Track patterns over time to better understand your emotional wellness.
          </p>
        </div>
      )
    },
    {
      icon: BookText,
      title: "Voice Journaling",
      subtitle: "Speak your thoughts, get AI insights",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <div className="text-white text-2xl">🎙️</div>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <div className="text-white text-2xl">🤖</div>
            </div>
          </div>
          <p className="text-muted-foreground">
            Use voice recording or typing to express your thoughts. Our AI companion provides 
            supportive insights and helps you process your emotions in a healthy way.
          </p>
        </div>
      )
    },
    {
      icon: Target,
      title: "Daily Goals & Habits",
      subtitle: "Build positive routines for better mental health",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { emoji: '😴', text: 'Sleep 8 hours' },
              { emoji: '💪', text: 'Exercise' },
              { emoji: '💧', text: 'Drink water' },
              { emoji: '🧘', text: 'Meditate' }
            ].map((goal, i) => (
              <div key={i} className="flex items-center space-x-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <span className="text-xl">{goal.emoji}</span>
                <span className="text-sm font-medium">{goal.text}</span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground">
            Set and track daily wellness goals. Build streaks and celebrate your progress 
            as you develop healthier habits.
          </p>
        </div>
      )
    },
    {
      icon: Sparkles,
      title: "You're All Set!",
      subtitle: "Ready to start your wellness journey?",
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-lg text-muted-foreground">
            You're ready to begin! Remember, this is your safe space. Take your time, 
            be honest with yourself, and celebrate small wins along the way.
          </p>
          <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 p-4 rounded-lg">
            <p className="text-sm font-medium">
              💡 Tip: Try to check in daily for the best experience and to build your streak!
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20 p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Icon className="h-12 w-12 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold">{currentStepData.title}</CardTitle>
          <p className="text-muted-foreground">{currentStepData.subtitle}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStepData.content}
          
          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-purple-600' 
                    : index < currentStep 
                      ? 'bg-purple-300' 
                      : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Sparkles className="h-4 w-4" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
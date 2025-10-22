'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const challenges = [
  {
    id: 1,
    title: "Compliment yourself once",
    description: "Look in the mirror and give yourself a genuine compliment",
    icon: "🌸",
    category: "self-love"
  },
  {
    id: 2,
    title: "Take 5 deep breaths",
    description: "Find a quiet moment and focus on your breathing",
    icon: "🌬️",
    category: "mindfulness"
  },
  {
    id: 3,
    title: "Write down 3 things you're grateful for",
    description: "Reflect on the positive aspects of your day",
    icon: "📝",
    category: "gratitude"
  },
  {
    id: 4,
    title: "Drink an extra glass of water",
    description: "Stay hydrated for better mental clarity",
    icon: "💧",
    category: "wellness"
  },
  {
    id: 5,
    title: "Send a kind message to someone",
    description: "Spread positivity by reaching out to a friend or family member",
    icon: "💌",
    category: "connection"
  },
  {
    id: 6,
    title: "Step outside for 5 minutes",
    description: "Get some fresh air and connect with nature",
    icon: "🌿",
    category: "nature"
  },
  {
    id: 7,
    title: "Listen to your favorite song",
    description: "Take a moment to enjoy music that makes you happy",
    icon: "🎵",
    category: "joy"
  },
  {
    id: 8,
    title: "Stretch for 2 minutes",
    description: "Release tension and improve your mood through movement",
    icon: "🤸",
    category: "movement"
  },
  {
    id: 9,
    title: "Smile at yourself in the mirror",
    description: "Practice self-compassion with a simple smile",
    icon: "😊",
    category: "self-love"
  },
  {
    id: 10,
    title: "Organize one small space",
    description: "Clear your environment to clear your mind",
    icon: "🧹",
    category: "organization"
  }
];

export function DailyChallenge() {
  const [todaysChallenge, setTodaysChallenge] = useState<typeof challenges[0] | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedDate, setCompletedDate] = useState<string | null>(null);

  useEffect(() => {
    // Get today's date as a string
    const today = new Date().toDateString();
    
    // Check if challenge was already completed today
    const completedToday = localStorage.getItem('mindmate_daily_challenge_completed');
    const challengeDate = localStorage.getItem('mindmate_daily_challenge_date');
    
    if (completedToday && challengeDate === today) {
      setIsCompleted(true);
      setCompletedDate(today);
    }
    
    // Get or generate today's challenge
    let storedChallenge = localStorage.getItem('mindmate_daily_challenge');
    let storedDate = localStorage.getItem('mindmate_daily_challenge_date');
    
    if (storedChallenge && storedDate === today) {
      // Use existing challenge for today
      setTodaysChallenge(JSON.parse(storedChallenge));
    } else {
      // Generate new challenge for today
      const challengeIndex = new Date().getDate() % challenges.length;
      const newChallenge = challenges[challengeIndex];
      setTodaysChallenge(newChallenge);
      
      // Store the new challenge
      localStorage.setItem('mindmate_daily_challenge', JSON.stringify(newChallenge));
      localStorage.setItem('mindmate_daily_challenge_date', today);
      
      // Reset completion status for new day
      if (storedDate !== today) {
        setIsCompleted(false);
        localStorage.removeItem('mindmate_daily_challenge_completed');
      }
    }
  }, []);

  const completeChallenge = () => {
    const today = new Date().toDateString();
    setIsCompleted(true);
    setCompletedDate(today);
    
    localStorage.setItem('mindmate_daily_challenge_completed', 'true');
    localStorage.setItem('mindmate_daily_challenge_date', today);
    
    toast({
      title: "Challenge Completed! 🎉",
      description: "Great job! You've completed today's MindMate challenge.",
      duration: 4000,
    });
  };

  const generateNewChallenge = () => {
    const randomIndex = Math.floor(Math.random() * challenges.length);
    const newChallenge = challenges[randomIndex];
    setTodaysChallenge(newChallenge);
    
    const today = new Date().toDateString();
    localStorage.setItem('mindmate_daily_challenge', JSON.stringify(newChallenge));
    localStorage.setItem('mindmate_daily_challenge_date', today);
    
    toast({
      title: "New Challenge Generated!",
      description: "Here's a fresh challenge for you to try.",
    });
  };

  if (!todaysChallenge) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">Loading today's challenge...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-lg border-0 transition-all duration-300 ${
      isCompleted 
        ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' 
        : 'bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20'
    }`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-orange-600" />
          Today's MindMate Challenge
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl mb-3">{todaysChallenge.icon}</div>
          <h3 className="text-lg font-semibold mb-2">{todaysChallenge.title}</h3>
          <p className="text-muted-foreground text-sm">{todaysChallenge.description}</p>
        </div>
        
        <div className="flex justify-center gap-3">
          {!isCompleted ? (
            <>
              <Button
                onClick={completeChallenge}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Complete
              </Button>
              <Button
                variant="outline"
                onClick={generateNewChallenge}
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                New Challenge
              </Button>
            </>
          ) : (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Challenge Completed!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Great job! Come back tomorrow for a new challenge.
              </p>
              <Button
                variant="outline"
                onClick={generateNewChallenge}
                className="mt-3 border-green-300 text-green-600 hover:bg-green-50"
                size="sm"
              >
                <RefreshCw className="mr-2 h-3 w-3" />
                Try Another
              </Button>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-white/50 dark:bg-black/20 rounded-full text-xs font-medium capitalize">
            {todaysChallenge.category}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
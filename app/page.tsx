'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { INSPIRATIONAL_QUOTES } from '@/lib/constants';
import { PersonalizedGreeting } from '@/components/personalized-greeting';
import { GoalTracker } from '@/components/goal-tracker';
import { MoodRecommendations } from '@/components/mood-recommendations';
import { DailyChallenge } from '@/components/daily-challenge';
import { LoadingScreen } from '@/components/loading-screen';
import { Onboarding } from '@/components/onboarding';
import { getUserProfile, UserProfile } from '@/lib/user-storage';
import { BookText, Heart, Target, TrendingUp, Stethoscope } from 'lucide-react';

export default function HomePage() {
  const [quote, setQuote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length);
    setQuote(INSPIRATIONAL_QUOTES[randomIndex]);
    
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('mindmate_onboarding_complete');
    const profile = getUserProfile();
    
    setTimeout(() => {
      setIsLoading(false);
      if (!hasSeenOnboarding && !profile) {
        setShowOnboarding(true);
      }
      setUserProfile(profile);
    }, 2000);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('mindmate_onboarding_complete', 'true');
    setShowOnboarding(false);
  };

  const handleProfileReady = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="space-y-8">
      {/* Personalized Greeting */}
      <PersonalizedGreeting onProfileReady={handleProfileReady} />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Link href="/mood" className="w-full">
          <Button className="w-full h-20 sm:h-24 flex flex-col items-center justify-center gap-1 sm:gap-2 bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 min-h-[48px] touch-manipulation">
            <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="font-medium text-sm sm:text-base">Check Mood</span>
          </Button>
        </Link>

        <Link href="/journal" className="w-full">
          <Button className="w-full h-20 sm:h-24 flex flex-col items-center justify-center gap-1 sm:gap-2 bg-gradient-to-br from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 min-h-[48px] touch-manipulation">
            <BookText className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="font-medium text-sm sm:text-base">Journal</span>
          </Button>
        </Link>

        <Link href="/health" className="w-full">
          <Button className="w-full h-20 sm:h-24 flex flex-col items-center justify-center gap-1 sm:gap-2 bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 min-h-[48px] touch-manipulation">
            <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="font-medium text-sm sm:text-base">Health Helper</span>
          </Button>
        </Link>

        <Link href="/history" className="w-full">
          <Button className="w-full h-20 sm:h-24 flex flex-col items-center justify-center gap-1 sm:gap-2 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 min-h-[48px] touch-manipulation">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="font-medium text-sm sm:text-base">Progress</span>
          </Button>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Goal Tracker */}
        <GoalTracker />
        
        {/* Mood Recommendations */}
        <MoodRecommendations />
        
        {/* Daily Challenge */}
        <DailyChallenge />
      </div>

      {/* Inspirational Quote */}
      {quote && (
        <div className="text-center py-8">
          <div className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-lg">
            <p className="text-lg md:text-xl italic text-gray-700 dark:text-gray-300 mb-4">
              &quot;{quote}&quot;
            </p>
            <div className="flex justify-center">
              <Link href="/journal">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6 py-2">
                  Start Reflecting
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

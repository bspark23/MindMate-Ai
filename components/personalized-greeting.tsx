'use client';

import { useState, useEffect } from 'react';
import { getUserProfile, createDefaultProfile, UserProfile } from '@/lib/user-storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Heart } from 'lucide-react';

interface PersonalizedGreetingProps {
  onProfileReady?: (profile: UserProfile) => void;
}

export function PersonalizedGreeting({ onProfileReady }: PersonalizedGreetingProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const existingProfile = getUserProfile();
    if (existingProfile) {
      setProfile(existingProfile);
      onProfileReady?.(existingProfile);
    } else {
      setIsNewUser(true);
    }
    setIsLoading(false);
  }, [onProfileReady]);

  const handleCreateProfile = () => {
    if (name.trim()) {
      const newProfile = createDefaultProfile(name.trim());
      setProfile(newProfile);
      setIsNewUser(false);
      onProfileReady?.(newProfile);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅';
    if (hour < 17) return '☀️';
    return '🌙';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-lg">Loading your space...</div>
      </div>
    );
  }

  if (isNewUser) {
    return (
      <Card className="max-w-md mx-auto shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Heart className="h-6 w-6 text-pink-500" />
            Welcome to MindMate
          </CardTitle>
          <p className="text-muted-foreground">Your safe space to reflect, relax, and recharge</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">What should we call you?</label>
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateProfile()}
              className="border-pink-200 focus:border-pink-400"
            />
          </div>
          <Button 
            onClick={handleCreateProfile}
            disabled={!name.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Start My Journey
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!profile) return null;

  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        {getGreeting()}, {profile.preferredName}! {getEmoji()}
      </h1>
      <p className="text-lg text-muted-foreground mb-4">
        How are you feeling today?
      </p>
      
      {profile.currentStreak > 0 && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full text-sm font-medium text-green-700 dark:text-green-300 mb-4">
          <Sparkles className="h-4 w-4" />
          You've checked in for {profile.currentStreak} day{profile.currentStreak !== 1 ? 's' : ''} straight! Keep going! 🌟
        </div>
      )}
    </div>
  );
}
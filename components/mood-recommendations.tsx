'use client';

import { useState, useEffect } from 'react';
import { getMoodRecommendations, getMoodEntries } from '@/lib/user-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Music, ExternalLink, Wind } from 'lucide-react';

export function MoodRecommendations() {
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);

  useEffect(() => {
    const moodEntries = getMoodEntries();
    if (moodEntries.length > 0) {
      setCurrentMood(moodEntries[0].mood);
    }
  }, []);

  if (!currentMood) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20">
        <CardContent className="text-center py-8">
          <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Check in with your mood to get personalized recommendations!
          </p>
        </CardContent>
      </Card>
    );
  }

  const recommendations = getMoodRecommendations(currentMood);

  return (
    <div className="space-y-4">
      <Card className={`shadow-lg border-0 ${recommendations.color}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5" />
            For Your {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)} Mood
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
            <p className="font-medium text-center">{recommendations.quote}</p>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm font-medium">Recommended for you:</p>
            <p className="text-sm">{recommendations.activity}</p>
            
            <div className="flex flex-wrap gap-2">
              {currentMood === 'anxious' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBreathingExercise(!showBreathingExercise)}
                  className="flex items-center gap-2"
                >
                  <Wind className="h-4 w-4" />
                  {showBreathingExercise ? 'Hide' : 'Start'} Breathing Exercise
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(recommendations.music, '_blank')}
                className="flex items-center gap-2"
              >
                <Music className="h-4 w-4" />
                Calming Music
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showBreathingExercise && currentMood === 'anxious' && (
        <BreathingExercise onClose={() => setShowBreathingExercise(false)} />
      )}
    </div>
  );
}

function BreathingExercise({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount <= 1) {
            setPhase((prevPhase) => {
              if (prevPhase === 'inhale') return 'hold';
              if (prevPhase === 'hold') return 'exhale';
              return 'inhale';
            });
            return phase === 'hold' ? 7 : 4; // 4-7-8 breathing
          }
          return prevCount - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-blue-400 to-blue-600';
      case 'hold': return 'from-yellow-400 to-yellow-600';
      case 'exhale': return 'from-green-400 to-green-600';
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Wind className="h-5 w-5" />
          4-7-8 Breathing Exercise
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Inhale for 4, hold for 7, exhale for 8
        </p>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="relative">
          <div 
            className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center transition-all duration-1000 ${
              isActive ? 'scale-110' : 'scale-100'
            }`}
          >
            <div className="text-white font-bold text-lg">{count}</div>
          </div>
          <p className="mt-4 text-lg font-medium">{getPhaseText()}</p>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => setIsActive(!isActive)}
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
          >
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
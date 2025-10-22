'use client';

import { useEffect, useState } from 'react';
import { Heart, Sparkles, Leaf } from 'lucide-react';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export function LoadingScreen({ onComplete, duration = 3000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    "Loading MindMate...",
    "Preparing your safe space...",
    "Breathe easy... 🌿",
    "Almost ready!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete?.(), 500);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, duration / messages.length);

    return () => clearInterval(messageInterval);
  }, [duration, messages.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20">
      <div className="text-center space-y-8 p-8">
        {/* Animated Logo */}
        <div className="relative">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-12 w-12 text-pink-500 animate-pulse" />
            <Sparkles className="h-8 w-8 text-purple-500 animate-bounce" />
            <Leaf className="h-10 w-10 text-green-500 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            MindMate
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Your Mental Health Companion
          </p>
        </div>

        {/* Loading Message */}
        <div className="space-y-4">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 animate-fade-in">
            {messages[currentMessage]}
          </p>
          
          {/* Progress Bar */}
          <div className="w-64 mx-auto">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
          </div>
        </div>

        {/* Breathing Animation */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-green-400 opacity-60 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
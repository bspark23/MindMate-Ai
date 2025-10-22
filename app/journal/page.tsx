'use client';

import { VoiceInput } from '@/components/journal/voice-input';
import { PersonalizedGreeting } from '@/components/personalized-greeting';
import { GoalTracker } from '@/components/goal-tracker';
import { MoodRecommendations } from '@/components/mood-recommendations';
import { JournalEntry } from '@/lib/types';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function JournalPage() {
  const [latestEntry, setLatestEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simple loading check to ensure page renders
    setIsLoading(false);
  }, []);

  const handleJournalSave = (entry: JournalEntry) => {
    setLatestEntry(entry);
    toast({
      title: "Journal Saved! 🌟",
      description: "Your reflection has been successfully saved.",
      duration: 3000,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading Journal...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-4 sm:py-8 space-y-6 sm:space-y-8 px-4 sm:px-0"
    >
      {/* Debug info */}
      <div className="text-center mb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          AI Journal Assistant
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Share your thoughts and get AI-powered insights and support
        </p>
      </div>

      <PersonalizedGreeting />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <VoiceInput onSave={handleJournalSave} />
          </motion.div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GoalTracker />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <MoodRecommendations />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { PersonalizedGreeting } from '@/components/personalized-greeting';
import { MoodSelector } from '@/components/mood-selector';
import { MoodRecommendations } from '@/components/mood-recommendations';
import { getMoodEntries } from '@/lib/user-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function MoodTrackerPage() {
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setMoodHistory(getMoodEntries());
  }, [refreshKey]);

  const handleMoodSelected = () => {
    // Refresh the mood history and recommendations
    setRefreshKey(prev => prev + 1);
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8 space-y-8"
    >
      <PersonalizedGreeting />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MoodSelector onMoodSelected={handleMoodSelected} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-indigo-600" />
                  Recent Mood History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {moodHistory.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No mood entries yet. Start by logging your first mood! 🌟
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {moodHistory.slice(0, 10).map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-black/20"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {entry.mood === 'happy' && '😊'}
                            {entry.mood === 'sad' && '😢'}
                            {entry.mood === 'anxious' && '😰'}
                            {entry.mood === 'excited' && '🤩'}
                            {entry.mood === 'stressed' && '😤'}
                            {entry.mood === 'calm' && '😌'}
                            {entry.mood === 'angry' && '😠'}
                            {entry.mood === 'neutral' && '😐'}
                          </span>
                          <div>
                            <p className="font-medium capitalize">{entry.mood}</p>
                            <p className="text-sm text-muted-foreground">
                              Intensity: {entry.intensity}/10
                            </p>
                            {entry.notes && (
                              <p className="text-sm text-muted-foreground italic">
                                "{entry.notes}"
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(entry.timestamp), 'MMM d')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(entry.timestamp), 'h:mm a')}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            key={refreshKey} // This will re-animate when mood changes
          >
            <MoodRecommendations />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { getMoodEntries, saveMoodEntry } from '@/lib/local-storage';
import { MoodEntry } from '@/lib/types';
import { MOOD_EMOJIS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smile, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

export default function MoodTrackerPage() {
const [selectedMood, setSelectedMood] = useState<MoodEntry | null>(null);
const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);

useEffect(() => {
  setMoodHistory(getMoodEntries());
}, []);

const handleSaveMood = () => {
  if (selectedMood) {
    const newMoodEntry: MoodEntry = {
      ...selectedMood,
      timestamp: Date.now(),
    };
    saveMoodEntry(newMoodEntry);
    setMoodHistory((prev) => [newMoodEntry, ...prev]);
    setSelectedMood(null); // Clear selection after saving
    toast({
      title: "Mood Saved!",
      description: `You've logged your mood as ${newMoodEntry.description}.`,
      duration: 3000,
    });
  } else {
    toast({
      title: "No Mood Selected",
      description: "Please select an emoji to log your mood.",
      variant: "destructive",
      duration: 3000,
    });
  }
};

return (
  <section className="py-8">
    <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary-light dark:text-primary-dark text-center">
      Track Your Mood
    </h1>

    <Card className="max-w-2xl mx-auto shadow-lg rounded-xl bg-white dark:bg-gray-800 transition-colors duration-300 mb-8">
      <CardHeader>
        <CardTitle className="text-primary-light dark:text-primary-dark flex items-center gap-2">
          <Smile className="h-6 w-6" /> How are you feeling today?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 justify-items-center">
          {MOOD_EMOJIS.map((mood) => (
            <Button
              key={mood.emoji}
              variant="outline"
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-200 w-24 h-24 text-4xl border-2 ${
                selectedMood?.emoji === mood.emoji
                  ? 'border-primary-light dark:border-primary-dark scale-105 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-light/50 dark:hover:border-primary-dark/50'
              } bg-bg-light dark:bg-gray-700`}
              style={{ backgroundColor: selectedMood?.emoji === mood.emoji ? mood.color : '' }}
              onClick={() => setSelectedMood(mood)}
            >
              {mood.emoji}
              <span className="text-sm mt-1 text-text-light dark:text-text-dark">{mood.description}</span>
            </Button>
          ))}
        </div>
        <div className="flex justify-center">
          <Button
            onClick={handleSaveMood}
            className="px-8 py-3 rounded-full shadow-md transition-all duration-300 bg-primary-light text-white hover:bg-accent-light dark:bg-primary-dark dark:hover:bg-accent-dark"
            disabled={!selectedMood}
          >
            Save Mood
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card className="max-w-2xl mx-auto shadow-lg rounded-xl bg-white dark:bg-gray-800 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-primary-light dark:text-primary-dark flex items-center gap-2">
          <CalendarDays className="h-6 w-6" /> Mood History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {moodHistory.length === 0 ? (
          <p className="text-center text-text-light/70 dark:text-text-dark/70">No mood entries yet.</p>
        ) : (
          <div className="space-y-3">
            {moodHistory.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-primary-light/10 dark:bg-primary-dark/10 text-text-light dark:text-text-dark"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{entry.emoji}</span>
                  <div>
                    <p className="font-medium">{entry.description}</p>
                    <p className="text-sm text-text-light/70 dark:text-text-dark/70">
                      {format(new Date(entry.timestamp), 'PPP p')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  </section>
);
}

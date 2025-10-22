'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { saveMoodEntry, MoodEntry } from '@/lib/user-storage';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';
import { Heart, Sparkles } from 'lucide-react';

interface MoodSelectorProps {
  onMoodSelected?: (mood: MoodEntry) => void;
}

const moods = [
  { name: 'happy', emoji: '😊', color: 'bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-800/40' },
  { name: 'sad', emoji: '😢', color: 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/40' },
  { name: 'anxious', emoji: '😰', color: 'bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40' },
  { name: 'excited', emoji: '🤩', color: 'bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-800/40' },
  { name: 'calm', emoji: '😌', color: 'bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/40' },
  { name: 'stressed', emoji: '😤', color: 'bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-800/40' },
  { name: 'grateful', emoji: '🙏', color: 'bg-pink-100 hover:bg-pink-200 dark:bg-pink-900/30 dark:hover:bg-pink-800/40' },
  { name: 'neutral', emoji: '😐', color: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/30 dark:hover:bg-gray-600/40' },
];

export function MoodSelector({ onMoodSelected }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [intensity, setIntensity] = useState([5]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Choose how you're feeling right now.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const moodEntry: MoodEntry = {
      id: uuidv4(),
      mood: selectedMood,
      intensity: intensity[0],
      timestamp: Date.now(),
      notes: notes.trim() || undefined,
    };

    try {
      saveMoodEntry(moodEntry);
      onMoodSelected?.(moodEntry);
      
      toast({
        title: "Mood logged! 🌟",
        description: `Thanks for checking in. You're feeling ${selectedMood} today.`,
        duration: 4000,
      });

      // Reset form
      setSelectedMood('');
      setIntensity([5]);
      setNotes('');
    } catch (error) {
      toast({
        title: "Error saving mood",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIntensityLabel = (value: number) => {
    if (value <= 2) return 'Very Low';
    if (value <= 4) return 'Low';
    if (value <= 6) return 'Moderate';
    if (value <= 8) return 'High';
    return 'Very High';
  };

  const getIntensityColor = (value: number) => {
    if (value <= 2) return 'text-blue-500';
    if (value <= 4) return 'text-green-500';
    if (value <= 6) return 'text-yellow-500';
    if (value <= 8) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Heart className="h-6 w-6 text-pink-500" />
          How are you feeling?
        </CardTitle>
        <p className="text-muted-foreground">
          Take a moment to check in with yourself
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Selection */}
        <div>
          <label className="text-sm font-medium mb-3 block">Choose your mood:</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {moods.map((mood) => (
              <Button
                key={mood.name}
                variant="outline"
                onClick={() => setSelectedMood(mood.name)}
                className={`h-16 sm:h-20 flex flex-col items-center justify-center gap-1 sm:gap-2 transition-all duration-200 min-h-[48px] ${
                  selectedMood === mood.name
                    ? `${mood.color} border-2 border-primary scale-105 shadow-md`
                    : `${mood.color} border hover:scale-102`
                }`}
              >
                <span className="text-xl sm:text-2xl">{mood.emoji}</span>
                <span className="text-xs font-medium capitalize">{mood.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Intensity Slider */}
        {selectedMood && (
          <div className="space-y-3">
            <label className="text-sm font-medium block">
              How intense is this feeling?
            </label>
            <div className="px-3">
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1</span>
                <span className={`font-medium ${getIntensityColor(intensity[0])}`}>
                  {intensity[0]} - {getIntensityLabel(intensity[0])}
                </span>
                <span>10</span>
              </div>
            </div>
          </div>
        )}

        {/* Optional Notes */}
        {selectedMood && (
          <div className="space-y-2">
            <label className="text-sm font-medium block">
              Anything you'd like to add? (optional)
            </label>
            <Textarea
              placeholder="What's on your mind? Any specific thoughts or events that contributed to this feeling?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!selectedMood || isSubmitting}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Log My Mood
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
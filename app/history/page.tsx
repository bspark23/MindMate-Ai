'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getJournalEntries } from '@/lib/local-storage';
import { getMoodEntries } from '@/lib/user-storage';
import { JournalEntry } from '@/lib/types';
import { BookText, Calendar, Trash2, Heart, Stethoscope, Filter, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  timestamp: number;
  notes?: string;
}

interface HealthEntry {
  id: string;
  symptoms: string;
  aiResponse: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high';
}

export default function HistoryPage() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [healthEntries, setHealthEntries] = useState<HealthEntry[]>([]);

  useEffect(() => {
    // Load all data
    setJournalEntries(getJournalEntries());
    setMoodEntries(getMoodEntries());
    
    // Load health entries from localStorage
    const healthData = JSON.parse(localStorage.getItem('mindmate_health_history') || '[]');
    setHealthEntries(healthData);
  }, []);

  const handleDeleteJournalEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      const updatedEntries = journalEntries.filter(entry => entry.id !== id);
      setJournalEntries(updatedEntries);
      localStorage.setItem('journal_entries', JSON.stringify(updatedEntries));
      toast({
        title: "Entry Deleted",
        description: "The journal entry has been removed.",
      });
    }
  };

  const handleDeleteMoodEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this mood entry?')) {
      const updatedEntries = moodEntries.filter(entry => entry.id !== id);
      setMoodEntries(updatedEntries);
      localStorage.setItem('mindmate_mood_entries', JSON.stringify(updatedEntries));
      toast({
        title: "Mood Entry Deleted",
        description: "The mood entry has been removed.",
      });
    }
  };

  const handleDeleteHealthEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this health entry?')) {
      const updatedEntries = healthEntries.filter(entry => entry.id !== id);
      setHealthEntries(updatedEntries);
      localStorage.setItem('mindmate_health_history', JSON.stringify(updatedEntries));
      toast({
        title: "Health Entry Deleted",
        description: "The health entry has been removed.",
      });
    }
  };

  const getMoodEmoji = (mood: string) => {
    const emojis: { [key: string]: string } = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      excited: '🤩',
      stressed: '😤',
      calm: '😌',
      angry: '😠',
      neutral: '😐',
    };
    return emojis[mood] || '😐';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    }
  };

  const totalEntries = journalEntries.length + moodEntries.length + healthEntries.length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-4 sm:py-8 space-y-6 sm:space-y-8 px-4 sm:px-0"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Your Wellness History
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Track your journey through moods, reflections, and health insights
        </p>
        
        {/* Stats */}
        <div className="flex justify-center gap-4 sm:gap-8 text-center">
          <div>
            <p className="text-xl sm:text-2xl font-bold text-purple-600">{totalEntries}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Total Entries</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-pink-600">{journalEntries.length}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Journal Entries</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{moodEntries.length}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Mood Logs</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-green-600">{healthEntries.length}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Health Checks</p>
          </div>
        </div>
      </div>

      {totalEntries === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No entries yet
          </h2>
          <p className="text-gray-500 dark:text-gray-500 mb-6">
            Start your wellness journey to see your history here.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500">
              <a href="/journal">Start Journaling</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/mood">Log Mood</a>
            </Button>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all" className="text-xs sm:text-sm">All ({totalEntries})</TabsTrigger>
            <TabsTrigger value="journal" className="text-xs sm:text-sm">Journal ({journalEntries.length})</TabsTrigger>
            <TabsTrigger value="mood" className="text-xs sm:text-sm">Mood ({moodEntries.length})</TabsTrigger>
            <TabsTrigger value="health" className="text-xs sm:text-sm">Health ({healthEntries.length})</TabsTrigger>
          </TabsList>

          {/* All Entries */}
          <TabsContent value="all" className="space-y-4">
            {/* Combined entries sorted by date */}
            {[
              ...journalEntries.map(entry => ({ ...entry, type: 'journal' })),
              ...moodEntries.map(entry => ({ ...entry, type: 'mood' })),
              ...healthEntries.map(entry => ({ ...entry, type: 'health' }))
            ]
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, 20) // Show latest 20 entries
              .map((entry, index) => (
                <motion.div
                  key={`${entry.type}-${entry.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {entry.type === 'journal' && (
                    <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <div className="flex items-center gap-2">
                          <BookText className="h-5 w-5 text-purple-600" />
                          <div>
                            <CardTitle className="text-base sm:text-lg">Journal Entry</CardTitle>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {format(new Date(entry.timestamp), 'MMM d, yyyy • h:mm a')}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteJournalEntry(entry.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-0">
                        <div>
                          <p className="text-sm font-medium mb-1">Your Reflection:</p>
                          <p className="text-sm text-muted-foreground bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                            {(entry as any).userText}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">AI Response:</p>
                          <p className="text-sm text-muted-foreground bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                            {(entry as any).aiResponse}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {entry.type === 'mood' && (
                    <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getMoodEmoji((entry as any).mood)}</span>
                          <div>
                            <CardTitle className="text-base sm:text-lg capitalize">{(entry as any).mood} Mood</CardTitle>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {format(new Date(entry.timestamp), 'MMM d, yyyy • h:mm a')}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMoodEntry(entry.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">Intensity: {(entry as any).intensity}/10</Badge>
                          {(entry as any).notes && (
                            <p className="text-sm text-muted-foreground italic">"{(entry as any).notes}"</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {entry.type === 'health' && (
                    <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-5 w-5 text-green-600" />
                          <div>
                            <CardTitle className="text-base sm:text-lg">Health Check</CardTitle>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {format(new Date(entry.timestamp), 'MMM d, yyyy • h:mm a')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor((entry as any).severity)}>
                            {(entry as any).severity}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteHealthEntry(entry.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-0">
                        <div>
                          <p className="text-sm font-medium mb-1">Symptoms:</p>
                          <p className="text-sm text-muted-foreground bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                            {(entry as any).symptoms}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              ))}
          </TabsContent>

          {/* Individual tabs would show filtered content */}
          <TabsContent value="journal" className="space-y-4">
            {journalEntries.length === 0 ? (
              <div className="text-center py-8">
                <BookText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-muted-foreground">No journal entries yet.</p>
              </div>
            ) : (
              journalEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookText className="h-5 w-5 text-purple-600" />
                        <CardTitle className="text-lg">
                          {format(new Date(entry.timestamp), 'MMM d, yyyy • h:mm a')}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteJournalEntry(entry.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Your Reflection:</h3>
                        <p className="text-muted-foreground bg-white/50 dark:bg-black/20 p-4 rounded-lg">
                          {entry.userText}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">AI Response:</h3>
                        <p className="text-muted-foreground bg-white/50 dark:bg-black/20 p-4 rounded-lg">
                          {entry.aiResponse}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="mood" className="space-y-4">
            {moodEntries.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-muted-foreground">No mood entries yet.</p>
              </div>
            ) : (
              moodEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                        <div>
                          <CardTitle className="text-lg capitalize">{entry.mood}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(entry.timestamp), 'MMM d, yyyy • h:mm a')}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMoodEntry(entry.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">Intensity: {entry.intensity}/10</Badge>
                        {entry.notes && (
                          <p className="text-sm text-muted-foreground italic">"{entry.notes}"</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            {healthEntries.length === 0 ? (
              <div className="text-center py-8">
                <Stethoscope className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-muted-foreground">No health entries yet.</p>
              </div>
            ) : (
              healthEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-green-600" />
                        <div>
                          <CardTitle className="text-lg">Health Check</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(entry.timestamp), 'MMM d, yyyy • h:mm a')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(entry.severity)}>
                          {entry.severity}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteHealthEntry(entry.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Symptoms:</h3>
                        <p className="text-muted-foreground bg-white/50 dark:bg-black/20 p-4 rounded-lg">
                          {entry.symptoms}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">AI Health Insights:</h3>
                        <div className="text-sm text-muted-foreground bg-white/50 dark:bg-black/20 p-4 rounded-lg whitespace-pre-wrap">
                          {entry.aiResponse}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </motion.section>
  );
}

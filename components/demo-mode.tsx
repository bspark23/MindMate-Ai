'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Monitor, Users, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { createDefaultProfile, saveGoals, saveMoodEntry, getDefaultGoals } from '@/lib/user-storage';
import { v4 as uuidv4 } from 'uuid';

export function DemoMode() {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const demoMode = localStorage.getItem('mindmate_demo_mode') === 'true';
    setIsDemoMode(demoMode);
  }, []);

  const toggleDemoMode = () => {
    const newDemoMode = !isDemoMode;
    setIsDemoMode(newDemoMode);
    localStorage.setItem('mindmate_demo_mode', newDemoMode.toString());

    if (newDemoMode) {
      setupDemoData();
      toast({
        title: "Demo Mode Activated! 🎭",
        description: "Sample data loaded for presentation purposes.",
      });
    } else {
      clearDemoData();
      toast({
        title: "Demo Mode Deactivated",
        description: "Demo data cleared. Your real data is preserved.",
      });
    }
  };

  const setupDemoData = () => {
    // Create demo profiles
    const demoProfiles = [
      { name: 'Alex (Happy User)', mood: 'happy', streak: 15 },
      { name: 'Sam (Stressed User)', mood: 'stressed', streak: 3 },
      { name: 'Jordan (New User)', mood: 'neutral', streak: 1 }
    ];

    // Save current data as backup
    const currentProfile = localStorage.getItem('mindmate_user_profile');
    const currentMoods = localStorage.getItem('mindmate_mood_entries');
    const currentGoals = localStorage.getItem('mindmate_goals');
    
    if (currentProfile) localStorage.setItem('mindmate_backup_profile', currentProfile);
    if (currentMoods) localStorage.setItem('mindmate_backup_moods', currentMoods);
    if (currentGoals) localStorage.setItem('mindmate_backup_goals', currentGoals);

    // Set up demo profile (Happy User by default)
    const demoProfile = createDefaultProfile('Alex');
    demoProfile.currentStreak = 15;
    demoProfile.totalCheckIns = 45;
    demoProfile.lastCheckIn = Date.now();

    // Create demo mood entries
    const demoMoodEntries = [];
    const moods = ['happy', 'excited', 'calm', 'grateful', 'happy', 'neutral', 'happy'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      demoMoodEntries.push({
        id: uuidv4(),
        mood: moods[i],
        intensity: Math.floor(Math.random() * 4) + 7, // 7-10 for positive demo
        timestamp: date.getTime(),
        notes: `Demo entry ${i + 1}`
      });
    }

    // Add some older entries for better analytics
    for (let i = 7; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const randomMoods = ['happy', 'calm', 'excited', 'grateful', 'neutral', 'anxious'];
      demoMoodEntries.push({
        id: uuidv4(),
        mood: randomMoods[Math.floor(Math.random() * randomMoods.length)],
        intensity: Math.floor(Math.random() * 10) + 1,
        timestamp: date.getTime(),
        notes: `Demo entry ${i + 1}`
      });
    }

    localStorage.setItem('mindmate_mood_entries', JSON.stringify(demoMoodEntries));

    // Set up demo goals with some progress
    const demoGoals = getDefaultGoals().map(goal => ({
      ...goal,
      current: Math.floor(Math.random() * goal.target)
    }));
    
    saveGoals(demoGoals);
  };

  const clearDemoData = () => {
    // Restore backup data
    const backupProfile = localStorage.getItem('mindmate_backup_profile');
    const backupMoods = localStorage.getItem('mindmate_backup_moods');
    const backupGoals = localStorage.getItem('mindmate_backup_goals');

    if (backupProfile) {
      localStorage.setItem('mindmate_user_profile', backupProfile);
      localStorage.removeItem('mindmate_backup_profile');
    } else {
      localStorage.removeItem('mindmate_user_profile');
    }

    if (backupMoods) {
      localStorage.setItem('mindmate_mood_entries', backupMoods);
      localStorage.removeItem('mindmate_backup_moods');
    } else {
      localStorage.removeItem('mindmate_mood_entries');
    }

    if (backupGoals) {
      localStorage.setItem('mindmate_goals', backupGoals);
      localStorage.removeItem('mindmate_backup_goals');
    } else {
      localStorage.removeItem('mindmate_goals');
    }
  };

  const switchDemoUser = (userType: 'happy' | 'stressed' | 'new') => {
    const profiles = {
      happy: {
        name: 'Alex',
        streak: 15,
        moods: ['happy', 'excited', 'calm', 'grateful', 'happy', 'neutral', 'happy']
      },
      stressed: {
        name: 'Sam',
        streak: 3,
        moods: ['stressed', 'anxious', 'sad', 'stressed', 'neutral', 'anxious', 'stressed']
      },
      new: {
        name: 'Jordan',
        streak: 1,
        moods: ['neutral']
      }
    };

    const profile = profiles[userType];
    const demoProfile = createDefaultProfile(profile.name);
    demoProfile.currentStreak = profile.streak;
    demoProfile.totalCheckIns = profile.streak * 2;

    // Create mood entries for this user type
    const demoMoodEntries = [];
    for (let i = 0; i < profile.moods.length; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      demoMoodEntries.push({
        id: uuidv4(),
        mood: profile.moods[i],
        intensity: userType === 'stressed' ? Math.floor(Math.random() * 4) + 3 : Math.floor(Math.random() * 4) + 7,
        timestamp: date.getTime(),
        notes: `${profile.name}'s mood entry`
      });
    }

    localStorage.setItem('mindmate_mood_entries', JSON.stringify(demoMoodEntries));

    toast({
      title: `Switched to ${profile.name}`,
      description: `Now showing ${userType} user demo data.`,
    });

    // Refresh the page to show new data
    window.location.reload();
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5 text-orange-600" />
          Demo Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Presentation Mode</p>
            <p className="text-sm text-muted-foreground">
              Load sample data for demonstrations
            </p>
          </div>
          <Switch
            checked={isDemoMode}
            onCheckedChange={toggleDemoMode}
          />
        </div>

        {isDemoMode && (
          <div className="space-y-3 pt-4 border-t">
            <p className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Switch Demo User:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchDemoUser('happy')}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                😊 Alex (Happy)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchDemoUser('stressed')}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                😤 Sam (Stressed)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchDemoUser('new')}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                😐 Jordan (New)
              </Button>
            </div>
          </div>
        )}

        <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <Zap className="h-3 w-3" />
            Perfect for hackathon presentations and demos. Your real data is safely backed up.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
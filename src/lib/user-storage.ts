// User data management for personalization
export interface UserProfile {
  name: string;
  joinDate: number;
  currentStreak: number;
  lastCheckIn: number;
  totalCheckIns: number;
  preferredName: string;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  icon: string;
  color: string;
}

export interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  timestamp: number;
  notes?: string;
}

// User Profile Management
export const getUserProfile = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  const profile = localStorage.getItem('mindmate_user_profile');
  return profile ? JSON.parse(profile) : null;
};

export const saveUserProfile = (profile: UserProfile): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('mindmate_user_profile', JSON.stringify(profile));
};

export const createDefaultProfile = (name: string): UserProfile => {
  const profile: UserProfile = {
    name,
    preferredName: name,
    joinDate: Date.now(),
    currentStreak: 0,
    lastCheckIn: 0,
    totalCheckIns: 0,
  };
  saveUserProfile(profile);
  return profile;
};

// Goals Management
export const getGoals = (): Goal[] => {
  if (typeof window === 'undefined') return [];
  const goals = localStorage.getItem('mindmate_goals');
  return goals ? JSON.parse(goals) : getDefaultGoals();
};

export const saveGoals = (goals: Goal[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('mindmate_goals', JSON.stringify(goals));
};

export const getDefaultGoals = (): Goal[] => [
  {
    id: '1',
    title: 'Sleep 8 hours',
    target: 8,
    current: 0,
    unit: 'hours',
    icon: '😴',
    color: 'bg-blue-500'
  },
  {
    id: '2',
    title: 'Exercise',
    target: 30,
    current: 0,
    unit: 'minutes',
    icon: '💪',
    color: 'bg-green-500'
  },
  {
    id: '3',
    title: 'Drink water',
    target: 8,
    current: 0,
    unit: 'glasses',
    icon: '💧',
    color: 'bg-cyan-500'
  },
  {
    id: '4',
    title: 'Meditate',
    target: 10,
    current: 0,
    unit: 'minutes',
    icon: '🧘',
    color: 'bg-purple-500'
  }
];

// Mood Entries Management
export const getMoodEntries = (): MoodEntry[] => {
  if (typeof window === 'undefined') return [];
  const entries = localStorage.getItem('mindmate_mood_entries');
  return entries ? JSON.parse(entries) : [];
};

export const saveMoodEntry = (entry: MoodEntry): void => {
  if (typeof window === 'undefined') return;
  const entries = getMoodEntries();
  entries.unshift(entry);
  localStorage.setItem('mindmate_mood_entries', JSON.stringify(entries));
  
  // Update streak
  updateStreak();
};

export const updateStreak = (): void => {
  const profile = getUserProfile();
  if (!profile) return;
  
  const today = new Date().toDateString();
  const lastCheckIn = new Date(profile.lastCheckIn).toDateString();
  
  if (lastCheckIn !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastCheckIn === yesterday.toDateString()) {
      profile.currentStreak += 1;
    } else if (lastCheckIn !== today) {
      profile.currentStreak = 1;
    }
    
    profile.lastCheckIn = Date.now();
    profile.totalCheckIns += 1;
    saveUserProfile(profile);
  }
};

// Mood-based recommendations
export const getMoodRecommendations = (mood: string) => {
  const recommendations = {
    sad: {
      quote: "Every storm runs out of rain. You're stronger than you know. 💙",
      activity: "Try some gentle music or write about what you're grateful for today.",
      music: "https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0", // Chill playlist
      color: "bg-blue-100 dark:bg-blue-900"
    },
    anxious: {
      quote: "Breathe in peace, breathe out worry. You've got this. 🌸",
      activity: "Let's try a 4-7-8 breathing exercise together.",
      music: "https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u", // Calm playlist
      color: "bg-green-100 dark:bg-green-900"
    },
    happy: {
      quote: "Your positive energy is contagious! Keep shining bright. ✨",
      activity: "What goal would you like to work on today?",
      music: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd", // Happy playlist
      color: "bg-yellow-100 dark:bg-yellow-900"
    },
    stressed: {
      quote: "Take it one breath at a time. You don't have to carry it all. 🌿",
      activity: "Try a 5-minute meditation or take a short walk outside.",
      music: "https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u",
      color: "bg-purple-100 dark:bg-purple-900"
    },
    excited: {
      quote: "Your enthusiasm is beautiful! Channel that energy into something amazing. 🚀",
      activity: "What exciting project or goal can you work on today?",
      music: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd",
      color: "bg-orange-100 dark:bg-orange-900"
    },
    neutral: {
      quote: "Sometimes neutral is exactly where we need to be. That's perfectly okay. 🌱",
      activity: "Maybe today is perfect for gentle reflection or trying something new.",
      music: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwABIL4",
      color: "bg-gray-100 dark:bg-gray-800"
    }
  };
  
  return recommendations[mood as keyof typeof recommendations] || recommendations.neutral;
};
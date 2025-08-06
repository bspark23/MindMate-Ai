import { JournalEntry, MoodEntry, Theme } from './types';

const JOURNAL_KEY = 'mental_health_journal_entries';
const MOOD_KEY = 'mental_health_mood_entries';
const THEME_KEY = 'mental_health_theme';

export const getJournalEntries = (): JournalEntry[] => {
if (typeof window === 'undefined') return [];
try {
  const stored = localStorage.getItem(JOURNAL_KEY);
  return stored ? JSON.parse(stored) : [];
} catch (error) {
  console.error("Failed to parse journal entries from localStorage", error);
  return [];
}
};

export const saveJournalEntry = (entry: JournalEntry) => {
if (typeof window === 'undefined') return;
const entries = getJournalEntries();
localStorage.setItem(JOURNAL_KEY, JSON.stringify([entry, ...entries]));
};

export const getMoodEntries = (): MoodEntry[] => {
if (typeof window === 'undefined') return [];
try {
  const stored = localStorage.getItem(MOOD_KEY);
  return stored ? JSON.parse(stored) : [];
} catch (error) {
  console.error("Failed to parse mood entries from localStorage", error);
  return [];
}
};

export const saveMoodEntry = (entry: MoodEntry) => {
if (typeof window === 'undefined') return;
const entries = getMoodEntries();
localStorage.setItem(MOOD_KEY, JSON.stringify([entry, ...entries]));
};

export const getTheme = (): Theme => {
if (typeof window === 'undefined') return 'light';
try {
  const stored = localStorage.getItem(THEME_KEY);
  return (stored === 'light' || stored === 'dark') ? stored : 'light';
} catch (error) {
  console.error("Failed to get theme from localStorage", error);
  return 'light';
}
};

export const saveTheme = (theme: Theme) => {
if (typeof window === 'undefined') return;
localStorage.setItem(THEME_KEY, theme);
};

export const clearAllData = () => {
if (typeof window === 'undefined') return;
localStorage.removeItem(JOURNAL_KEY);
localStorage.removeItem(MOOD_KEY);
// Keep theme, as it's a user preference, unless explicitly asked to clear
// localStorage.removeItem(THEME_KEY);
console.log("All journal and mood data cleared from localStorage.");
};

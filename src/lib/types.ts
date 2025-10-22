export type JournalEntry = {
id: string;
timestamp: number;
userText: string;
aiResponse: string;
mood?: MoodEntry;
};

export type MoodEntry = {
timestamp: number;
emoji: string;
color: string;
description: string;
};

export type Theme = 'light' | 'dark';

export type PWAInstallPrompt = Event & {
prompt: () => void;
userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};
'use client';

import { VoiceInput } from '@/components/journal/voice-input';
import { JournalEntry } from '@/lib/types';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast'; // Assuming shadcn toast is available

export default function JournalPage() {
const [latestEntry, setLatestEntry] = useState<JournalEntry | null>(null);

const handleJournalSave = (entry: JournalEntry) => {
  setLatestEntry(entry);
  toast({
    title: "Journal Saved!",
    description: "Your reflection has been successfully saved.",
    duration: 3000,
  });
};

return (
  <section className="py-8">
    <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary-light dark:text-primary-dark text-center">
      Start Your Reflection
    </h1>
    <VoiceInput onSave={handleJournalSave} />
  </section>
);
}

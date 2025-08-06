'use client';

import { useEffect, useState } from 'react';
import { getJournalEntries } from '@/lib/local-storage';
import { JournalEntry } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format } from 'date-fns';
import { History } from 'lucide-react';

export default function JournalHistoryPage() {
const [entries, setEntries] = useState<JournalEntry[]>([]);

useEffect(() => {
  setEntries(getJournalEntries());
}, []);

if (entries.length === 0) {
  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] text-center px-4 py-8">
      <History className="h-16 w-16 text-primary-light dark:text-primary-dark mb-4" />
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary-light dark:text-primary-dark">
        No Journal Entries Yet
      </h1>
      <p className="text-lg md:text-xl text-text-light/80 dark:text-text-dark/80">
        Start a new journal entry to see your reflections here!
      </p>
    </section>
  );
}

return (
  <section className="py-8">
    <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary-light dark:text-primary-dark text-center">
      Your Journal History
    </h1>
    <div className="max-w-3xl mx-auto">
      <Accordion type="single" collapsible className="w-full">
        {entries.map((entry) => (
          <Card key={entry.id} className="mb-4 shadow-md rounded-xl bg-white dark:bg-gray-800 transition-colors duration-300">
            <AccordionItem value={entry.id} className="border-none">
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                <CardHeader className="p-0">
                  <CardTitle className="text-lg font-semibold text-text-light dark:text-text-dark">
                    {format(new Date(entry.timestamp), 'PPP p')}
                  </CardTitle>
                  <p className="text-sm text-text-light/70 dark:text-text-dark/70 truncate max-w-[calc(100%-2rem)]">
                    {entry.userText.substring(0, 100)}...
                  </p>
                </CardHeader>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-4 text-text-light dark:text-text-dark">
                  <div>
                    <h3 className="font-semibold text-primary-light dark:text-primary-dark mb-1">Your Thoughts:</h3>
                    <p className="bg-primary-light/10 dark:bg-primary-dark/10 p-3 rounded-md whitespace-pre-wrap">{entry.userText}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-light dark:text-primary-dark mb-1">AI Reflection:</h3>
                    <p className="bg-primary-light/10 dark:bg-primary-dark/10 p-3 rounded-md whitespace-pre-wrap">{entry.aiResponse}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>
    </div>
  </section>
);
}

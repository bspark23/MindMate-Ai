'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { INSPIRATIONAL_QUOTES } from '@/lib/constants';

export default function HomePage() {
const [quote, setQuote] = useState('');

useEffect(() => {
  const randomIndex = Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length);
  setQuote(INSPIRATIONAL_QUOTES[randomIndex]);
}, []);

return (
  <section className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] text-center px-4 py-8">
    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary-light dark:text-primary-dark animate-fade-in">
      Welcome to Mindful Journal
    </h1>
    <p className="text-lg md:text-xl mb-8 max-w-2xl text-text-light/80 dark:text-text-dark/80 animate-fade-in delay-100">
      Your personal space for reflection, emotional support, and growth. Speak your mind, and let our AI companion help you navigate your feelings.
    </p>
    <Link href="/journal">
      <Button className="px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary-light text-white hover:bg-accent-light dark:bg-primary-dark dark:hover:bg-accent-dark">
        Start Journaling
      </Button>
    </Link>
    {quote && (
      <p className="mt-12 text-md md:text-lg italic text-text-light/60 dark:text-text-dark/60 max-w-xl animate-fade-in delay-200">
        &quot;{quote}&quot;
      </p>
    )}
  </section>
);
}

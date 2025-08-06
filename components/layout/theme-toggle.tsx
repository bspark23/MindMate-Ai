'use client';

import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';

export function ThemeToggle() {
const { theme, setTheme } = useTheme();

const toggleTheme = () => {
  setTheme(theme === 'light' ? 'dark' : 'light');
};

return (
  <Button
    variant="ghost"
    size="icon"
    onClick={toggleTheme}
    aria-label="Toggle theme"
    className="transition-transform duration-300 hover:scale-110"
  >
    {theme === 'light' ? (
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-text-light dark:text-text-dark" />
    ) : (
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-text-light dark:text-text-dark" />
    )}
    <span className="sr-only">Toggle theme</span>
  </Button>
);
}

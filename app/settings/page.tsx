'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { clearAllData, getJournalEntries } from '@/lib/local-storage';
import { Settings, Trash, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PWAInstallPrompt } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { NotificationSystem } from '@/components/notification-system';
import { ShareProgress } from '@/components/share-progress';
import { DemoMode } from '@/components/demo-mode';

export default function SettingsPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<PWAInstallPrompt | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as PWAInstallPrompt);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all your journal and mood data? This action cannot be undone.')) {
      clearAllData();
      toast({
        title: "Data Cleared",
        description: "All your journal and mood data has been removed.",
        duration: 3000,
      });
      // Optionally, reload the page or update state to reflect changes
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const entries = getJournalEntries();
    if (entries.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There are no journal entries to export yet.",
        duration: 3000,
      });
      return;
    }

    const dataStr = JSON.stringify(entries, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindful-journal-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Data Exported!",
      description: "Your journal entries have been downloaded.",
      duration: 3000,
    });
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        toast({
          title: "App Installed!",
          description: "Mindful Journal has been added to your home screen.",
          duration: 3000,
        });
      } else {
        toast({
          title: "Installation Cancelled",
          description: "You can install the app anytime from your browser menu.",
          duration: 3000,
        });
      }
      setDeferredPrompt(null); // Prompt can only be used once
    }
  };

  return (
    <section className="py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary-light dark:text-primary-dark text-center">
        Settings
      </h1>

      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* General Settings */}
        <Card className="shadow-lg rounded-xl bg-white dark:bg-gray-800 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-primary-light dark:text-primary-dark flex items-center gap-2">
              <Settings className="h-6 w-6" /> General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text-light dark:text-text-dark">Theme</span>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* New Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <NotificationSystem />
          <ShareProgress />
        </div>

        {/* Demo Mode - Full Width */}
        <DemoMode />

        <Card className="shadow-lg rounded-xl bg-white dark:bg-gray-800 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-primary-light dark:text-primary-dark flex items-center gap-2">
              <Trash className="h-6 w-6" /> Data Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleClearData}
              variant="destructive"
              className="w-full px-4 sm:px-6 py-3 rounded-full shadow-md transition-all duration-300"
            >
              Clear All Journal Data
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl bg-white dark:bg-gray-800 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-primary-light dark:text-primary-dark flex items-center gap-2">
              <Download className="h-6 w-6" /> Export Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-light/80 dark:text-text-dark/80 mb-4">
              Download all your journal and mood entries as a JSON file.
            </p>
            <Button
              onClick={handleExportData}
              className="w-full px-4 sm:px-6 py-3 rounded-full shadow-md transition-all duration-300 bg-primary-light text-white hover:bg-accent-light dark:bg-primary-dark dark:hover:bg-accent-dark"
            >
              Export All Data
            </Button>
          </CardContent>
        </Card>

        {deferredPrompt && (
          <Card className="shadow-lg rounded-xl bg-white dark:bg-gray-800 transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-primary-light dark:text-primary-dark flex items-center gap-2">
                <Download className="h-6 w-6" /> Install App
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-light/80 dark:text-text-dark/80 mb-4">
                Install Mindful Journal to your device for quick access and offline use!
              </p>
              <Button
                onClick={handleInstallClick}
                className="w-full px-4 sm:px-6 py-3 rounded-full shadow-md transition-all duration-300 bg-primary-light text-white hover:bg-accent-light dark:bg-primary-dark dark:hover:bg-accent-dark"
              >
                Install Mindful Journal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}

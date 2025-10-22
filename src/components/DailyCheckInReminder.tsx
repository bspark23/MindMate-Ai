import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, X, Heart, BookText } from 'lucide-react'
import { Link } from 'react-router-dom'

export function DailyCheckInReminder() {
  const [showReminder, setShowReminder] = useState(false)
  const [reminderType, setReminderType] = useState<'mood' | 'journal'>('mood')

  useEffect(() => {
    checkForReminder()
    
    // Set up daily reminder check
    const interval = setInterval(checkForReminder, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [])

  const checkForReminder = () => {
    const lastMoodEntry = localStorage.getItem('mindmate_last_mood_check')
    const lastJournalEntry = localStorage.getItem('mindmate_last_journal_check')
    const today = new Date().toDateString()
    
    const hasLoggedMoodToday = lastMoodEntry === today
    const hasJournaledToday = lastJournalEntry === today
    
    // Show reminder if user hasn't done either today and it's after 6 PM
    const currentHour = new Date().getHours()
    if (currentHour >= 18 && !hasLoggedMoodToday && !hasJournaledToday) {
      setReminderType(Math.random() > 0.5 ? 'mood' : 'journal')
      setShowReminder(true)
    }
  }

  const dismissReminder = () => {
    setShowReminder(false)
    // Don't show again today
    localStorage.setItem('mindmate_reminder_dismissed', new Date().toDateString())
  }

  const handleCheckIn = () => {
    const today = new Date().toDateString()
    if (reminderType === 'mood') {
      localStorage.setItem('mindmate_last_mood_check', today)
    } else {
      localStorage.setItem('mindmate_last_journal_check', today)
    }
    setShowReminder(false)
  }

  if (!showReminder) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 animate-fade-in">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5 text-purple-600" />
              Daily Check-in
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={dismissReminder}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {reminderType === 'mood' 
              ? "How are you feeling today? Take a moment to check in with yourself."
              : "Ready to reflect? Share what's on your mind in your journal."
            }
          </p>
          
          <div className="flex gap-2">
            <Link 
              to={reminderType === 'mood' ? '/mood' : '/journal'} 
              className="flex-1"
              onClick={handleCheckIn}
            >
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                {reminderType === 'mood' ? (
                  <>
                    <Heart className="h-4 w-4 mr-2" />
                    Log Mood
                  </>
                ) : (
                  <>
                    <BookText className="h-4 w-4 mr-2" />
                    Write Entry
                  </>
                )}
              </Button>
            </Link>
            
            <Button
              variant="outline"
              onClick={dismissReminder}
              className="px-3"
            >
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
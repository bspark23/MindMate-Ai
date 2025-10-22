import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookText, Heart } from 'lucide-react'
import { getMoodEntries, getUserProfile } from '@/lib/user-storage'
import { format } from 'date-fns'

export default function HistoryPage() {
  const [moodEntries, setMoodEntries] = useState<any[]>([])
  const [journalEntries, setJournalEntries] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    setMoodEntries(getMoodEntries())
    setProfile(getUserProfile())
    
    // Get journal entries from localStorage
    const entries = JSON.parse(localStorage.getItem('mindmate_journal_entries') || '[]')
    setJournalEntries(entries)
  }, [])

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Your Wellness Journey
        </h1>
        <p className="text-lg text-muted-foreground">
          Track your progress and celebrate your growth
        </p>
      </div>

      {/* Progress Summary */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {profile.currentStreak}
              </div>
              <p className="text-sm font-medium">Current Streak</p>
              <p className="text-xs text-muted-foreground">
                {profile.currentStreak > 0 ? 'Days in a row! 🔥' : 'Start today! 🌱'}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {profile.totalCheckIns}
              </div>
              <p className="text-sm font-medium">Total Check-ins</p>
              <p className="text-xs text-muted-foreground">
                Since {format(new Date(profile.joinDate), 'MMM yyyy')}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {journalEntries.length}
              </div>
              <p className="text-sm font-medium">Journal Entries</p>
              <p className="text-xs text-muted-foreground">
                Thoughts & reflections
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Moods */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-600" />
              Recent Moods
            </CardTitle>
          </CardHeader>
          <CardContent>
            {moodEntries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No mood entries yet. Start tracking your emotions! 😊
              </p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {moodEntries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-black/20">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {entry.mood === 'happy' && '😊'}
                        {entry.mood === 'sad' && '😢'}
                        {entry.mood === 'anxious' && '😰'}
                        {entry.mood === 'excited' && '🤩'}
                        {entry.mood === 'stressed' && '😤'}
                        {entry.mood === 'calm' && '😌'}
                        {entry.mood === 'angry' && '😠'}
                        {entry.mood === 'neutral' && '😐'}
                      </span>
                      <div>
                        <p className="font-medium capitalize">{entry.mood}</p>
                        <p className="text-xs text-muted-foreground">
                          Intensity: {entry.intensity}/10
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(entry.timestamp), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Journal Entries */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookText className="h-5 w-5 text-indigo-600" />
              Recent Journal Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {journalEntries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No journal entries yet. Start writing your thoughts! ✍️
              </p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {journalEntries.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="p-3 rounded-lg bg-white/50 dark:bg-black/20">
                    <p className="text-sm text-muted-foreground mb-2">
                      {format(new Date(entry.timestamp), 'MMM d, yyyy • h:mm a')}
                    </p>
                    <p className="text-sm line-clamp-3">
                      {entry.userText.substring(0, 150)}
                      {entry.userText.length > 150 ? '...' : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Motivational Message */}
      {profile && profile.totalCheckIns > 0 && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">🌟 You're doing amazing!</h3>
            <p className="text-muted-foreground">
              You've logged your mood {profile.totalCheckIns} times and written {journalEntries.length} journal entries. 
              Every check-in is a step toward better mental health. Keep up the incredible work!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
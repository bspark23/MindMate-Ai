import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getUserProfile, getMoodEntries } from '@/lib/user-storage'
import { Calendar, Flame, Trophy, Star } from 'lucide-react'

export function StreakTracker() {
  const [profile, setProfile] = useState<any>(null)
  const [moodEntries, setMoodEntries] = useState<any[]>([])

  useEffect(() => {
    setProfile(getUserProfile())
    setMoodEntries(getMoodEntries())
  }, [])

  if (!profile) return null

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your wellness journey today! 🌱"
    if (streak === 1) return "Great start! Keep it going! 💪"
    if (streak < 7) return `${streak} days strong! You're building a habit! 🔥`
    if (streak < 30) return `${streak} days in a row! You're on fire! 🚀`
    if (streak < 100) return `${streak} days! You're a wellness champion! 🏆`
    return `${streak} days! You're absolutely incredible! 🌟`
  }

  const getStreakIcon = (streak: number) => {
    if (streak === 0) return <Star className="h-5 w-5 text-gray-400" />
    if (streak < 7) return <Flame className="h-5 w-5 text-orange-500" />
    if (streak < 30) return <Flame className="h-5 w-5 text-red-500" />
    return <Trophy className="h-5 w-5 text-yellow-500" />
  }

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-orange-600" />
          Wellness Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getStreakIcon(profile.currentStreak)}
            <span className="text-3xl font-bold text-orange-600">
              {profile.currentStreak}
            </span>
          </div>
          <p className="text-sm font-medium">
            {profile.currentStreak === 1 ? 'Day' : 'Days'} in a row
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {getStreakMessage(profile.currentStreak)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="text-center">
            <p className="text-lg font-semibold text-blue-600">
              {profile.totalCheckIns}
            </p>
            <p className="text-xs text-muted-foreground">
              Total Check-ins
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-green-600">
              {moodEntries.length}
            </p>
            <p className="text-xs text-muted-foreground">
              Mood Entries
            </p>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="flex justify-center gap-2 pt-2 border-t">
          {profile.totalCheckIns >= 7 && (
            <div className="text-center">
              <div className="text-lg">🏅</div>
              <p className="text-xs">Week Warrior</p>
            </div>
          )}
          {profile.totalCheckIns >= 30 && (
            <div className="text-center">
              <div className="text-lg">🏆</div>
              <p className="text-xs">Month Master</p>
            </div>
          )}
          {profile.currentStreak >= 10 && (
            <div className="text-center">
              <div className="text-lg">🔥</div>
              <p className="text-xs">Streak Star</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
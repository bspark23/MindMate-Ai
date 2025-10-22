import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Flame, Star, Target, Heart, BookText, Calendar, Award } from 'lucide-react'
import { getUserProfile, getMoodEntries } from '@/lib/user-storage'

interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  unlocked: boolean
  unlockedDate?: number
  progress?: number
  target?: number
}

export function Gamification() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [currentStreak, setCurrentStreak] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)

  useEffect(() => {
    calculateAchievements()
  }, [])

  const calculateAchievements = () => {
    const profile = getUserProfile()
    const moodEntries = getMoodEntries()
    const journalEntries = JSON.parse(localStorage.getItem('mindmate_journal_entries') || '[]')
    
    // const today = new Date()
    const streak = profile?.currentStreak || 0
    setCurrentStreak(streak)

    // Calculate total points
    const points = (moodEntries.length * 10) + (journalEntries.length * 15) + (streak * 5)
    setTotalPoints(points)

    const achievementsList: Achievement[] = [
      {
        id: 'first_mood',
        title: 'First Steps',
        description: 'Log your first mood entry',
        icon: Heart,
        unlocked: moodEntries.length > 0,
        unlockedDate: moodEntries[0]?.timestamp
      },
      {
        id: 'first_journal',
        title: 'Mindful Writer',
        description: 'Write your first journal entry',
        icon: BookText,
        unlocked: journalEntries.length > 0,
        unlockedDate: journalEntries[0]?.timestamp
      },
      {
        id: 'streak_3',
        title: 'Getting Started',
        description: 'Maintain a 3-day streak',
        icon: Flame,
        unlocked: streak >= 3,
        progress: Math.min(streak, 3),
        target: 3
      },
      {
        id: 'streak_7',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: Calendar,
        unlocked: streak >= 7,
        progress: Math.min(streak, 7),
        target: 7
      },
      {
        id: 'streak_30',
        title: 'Monthly Master',
        description: 'Maintain a 30-day streak',
        icon: Trophy,
        unlocked: streak >= 30,
        progress: Math.min(streak, 30),
        target: 30
      },
      {
        id: 'mood_master',
        title: 'Mood Master',
        description: 'Log 50 mood entries',
        icon: Star,
        unlocked: moodEntries.length >= 50,
        progress: Math.min(moodEntries.length, 50),
        target: 50
      },
      {
        id: 'journal_enthusiast',
        title: 'Journal Enthusiast',
        description: 'Write 25 journal entries',
        icon: Award,
        unlocked: journalEntries.length >= 25,
        progress: Math.min(journalEntries.length, 25),
        target: 25
      },
      {
        id: 'wellness_champion',
        title: 'Wellness Champion',
        description: 'Reach 1000 wellness points',
        icon: Target,
        unlocked: points >= 1000,
        progress: Math.min(points, 1000),
        target: 1000
      }
    ]

    setAchievements(achievementsList)
  }

  const getStreakMessage = () => {
    if (currentStreak === 0) return "Start your wellness journey today!"
    if (currentStreak === 1) return "Great start! Keep it going!"
    if (currentStreak < 7) return `${currentStreak} days strong! 💪`
    if (currentStreak < 30) return `Amazing ${currentStreak}-day streak! 🔥`
    return `Incredible ${currentStreak}-day streak! You're a wellness champion! 🏆`
  }

  const getProgressColor = (progress: number, target: number) => {
    const percentage = (progress / target) * 100
    if (percentage >= 100) return 'bg-green-500'
    if (percentage >= 75) return 'bg-yellow-500'
    if (percentage >= 50) return 'bg-orange-500'
    return 'bg-blue-500'
  }

  return (
    <div className="space-y-6">
      {/* Current Streak */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-600" />
            Current Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-orange-600">
              {currentStreak}
            </div>
            <p className="text-lg font-medium">
              {currentStreak === 1 ? 'Day' : 'Days'}
            </p>
            <p className="text-sm text-muted-foreground">
              {getStreakMessage()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Wellness Points */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-600" />
            Wellness Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-purple-600">
              {totalPoints.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              Earn points by logging moods (10 pts) and journaling (15 pts)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-green-600" />
            Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked
                    ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 bg-gray-50 dark:bg-gray-800/20 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    achievement.unlocked ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <achievement.icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm">{achievement.title}</h3>
                      {achievement.unlocked && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          Unlocked!
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                    
                    {achievement.target && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{achievement.progress || 0}</span>
                          <span>{achievement.target}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              getProgressColor(achievement.progress || 0, achievement.target)
                            }`}
                            style={{
                              width: `${Math.min(((achievement.progress || 0) / achievement.target) * 100, 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {achievement.unlocked && achievement.unlockedDate && (
                      <p className="text-xs text-green-600">
                        Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
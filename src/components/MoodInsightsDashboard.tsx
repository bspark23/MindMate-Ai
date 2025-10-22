import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react'
import { getMoodEntries } from '@/lib/user-storage'
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

export function MoodInsightsDashboard() {
  const [weeklyInsights, setWeeklyInsights] = useState('')
  const [monthlyInsights, setMonthlyInsights] = useState('')
  const [moodData, setMoodData] = useState<any[]>([])

  useEffect(() => {
    const entries = getMoodEntries()
    setMoodData(entries)
    generateInsights(entries)
  }, [])

  const generateInsights = (entries: any[]) => {
    const now = new Date()
    const weekStart = startOfWeek(now)
    const weekEnd = endOfWeek(now)
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    // Weekly insights
    const weeklyEntries = entries.filter(entry => {
      const entryDate = new Date(entry.timestamp)
      return entryDate >= weekStart && entryDate <= weekEnd
    })

    const weeklyMoodCounts = weeklyEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1
      return acc
    }, {})

    const topWeeklyMood = Object.entries(weeklyMoodCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0]
    
    if (topWeeklyMood) {
      const [mood, count] = topWeeklyMood
      setWeeklyInsights(`You've felt ${mood} ${count} day${count !== 1 ? 's' : ''} this week! ${getMoodEmoji(mood)}`)
    } else {
      setWeeklyInsights('No mood entries this week. Start tracking to see insights!')
    }

    // Monthly insights
    const monthlyEntries = entries.filter(entry => {
      const entryDate = new Date(entry.timestamp)
      return entryDate >= monthStart && entryDate <= monthEnd
    })

    const monthlyMoodCounts = monthlyEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1
      return acc
    }, {})

    const topMonthlyMood = Object.entries(monthlyMoodCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0]
    
    if (topMonthlyMood) {
      const [mood, count] = topMonthlyMood
      const avgIntensity = monthlyEntries
        .filter(e => e.mood === mood)
        .reduce((sum, e) => sum + e.intensity, 0) / (count as number)
      
      setMonthlyInsights(`This month, you've been mostly ${mood} (${count} times) with an average intensity of ${avgIntensity.toFixed(1)}/10`)
    } else {
      setMonthlyInsights('No mood entries this month. Keep tracking for better insights!')
    }
  }

  const getMoodEmoji = (mood: string) => {
    const emojis: { [key: string]: string } = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      excited: '🤩',
      stressed: '😤',
      calm: '😌',
      angry: '😠',
      neutral: '😐'
    }
    return emojis[mood] || '😊'
  }

  const getMoodColor = (mood: string) => {
    const colors: { [key: string]: string } = {
      happy: 'bg-yellow-100 text-yellow-800',
      sad: 'bg-blue-100 text-blue-800',
      anxious: 'bg-orange-100 text-orange-800',
      excited: 'bg-green-100 text-green-800',
      stressed: 'bg-red-100 text-red-800',
      calm: 'bg-purple-100 text-purple-800',
      angry: 'bg-red-200 text-red-900',
      neutral: 'bg-gray-100 text-gray-800'
    }
    return colors[mood] || 'bg-gray-100 text-gray-800'
  }

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i)
    const dayEntries = moodData.filter(entry => 
      format(new Date(entry.timestamp), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    )
    return {
      date: format(date, 'EEE'),
      mood: dayEntries[0]?.mood || null,
      count: dayEntries.length
    }
  }).reverse()

  return (
    <div className="space-y-6">
      {/* Weekly & Monthly Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 dark:text-gray-300">{weeklyInsights}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 dark:text-gray-300">{monthlyInsights}</p>
          </CardContent>
        </Card>
      </div>

      {/* 7-Day Mood Chart */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Last 7 Days Mood Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {last7Days.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {day.date}
                </div>
                <div className={`w-full h-12 rounded-lg flex items-center justify-center ${
                  day.mood ? getMoodColor(day.mood) : 'bg-gray-100 text-gray-400'
                }`}>
                  {day.mood ? (
                    <span className="text-lg">{getMoodEmoji(day.mood)}</span>
                  ) : (
                    <span className="text-xs">No data</span>
                  )}
                </div>
                {day.count > 1 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {day.count} entries
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
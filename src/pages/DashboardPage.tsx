import { PersonalizedGreeting } from '@/components/PersonalizedGreeting'
import { GoalTracker } from '@/components/GoalTracker'
import { MoodRecommendations } from '@/components/MoodRecommendations'
import { DailyChallenge } from '@/components/DailyChallenge'
import { StreakTracker } from '@/components/StreakTracker'
import { MoodSelector } from '@/components/MoodSelector'
import { useState } from 'react'

export default function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleMoodUpdate = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-8">
      <PersonalizedGreeting key={refreshKey} />
      
      {/* Quick Mood Check */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MoodSelector onMoodSelected={handleMoodUpdate} />
        <StreakTracker key={refreshKey} />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GoalTracker />
        <MoodRecommendations key={refreshKey} />
        <DailyChallenge />
      </div>
    </div>
  )
}
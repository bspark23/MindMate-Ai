import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Music, Wind, Sparkles, ExternalLink } from 'lucide-react'
import { getMoodEntries, getMoodRecommendations } from '@/lib/user-storage'

export function MoodRecommendations() {
  const [latestMood, setLatestMood] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<any>(null)

  useEffect(() => {
    const moodEntries = getMoodEntries()
    if (moodEntries.length > 0) {
      const latest = moodEntries[0]
      setLatestMood(latest.mood)
      setRecommendations(getMoodRecommendations(latest.mood))
    }
  }, [])

  const handleBreathingExercise = () => {
    alert('🧘‍♀️ Breathing Exercise:\n\n1. Breathe in for 4 counts\n2. Hold for 7 counts\n3. Breathe out for 8 counts\n\nRepeat 4 times. You\'ve got this! 💙')
  }

  if (!latestMood || !recommendations) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-600" />
            Mood Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Track your mood to get personalized recommendations and insights.
            </p>
            <div className="text-center py-4">
              <span className="text-2xl">😊</span>
              <p className="text-sm mt-2">How are you feeling today?</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`shadow-lg border-0 ${recommendations.color}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-600" />
          Mood-Based Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <span className="text-2xl mb-2 block">
            {latestMood === 'happy' && '😊'}
            {latestMood === 'sad' && '😢'}
            {latestMood === 'anxious' && '😰'}
            {latestMood === 'excited' && '🤩'}
            {latestMood === 'stressed' && '😤'}
            {latestMood === 'calm' && '😌'}
            {latestMood === 'angry' && '😠'}
            {latestMood === 'neutral' && '😐'}
          </span>
          <p className="text-sm font-medium capitalize mb-2">Feeling {latestMood}</p>
        </div>

        {/* Motivational Quote */}
        <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
          <p className="text-sm italic text-center">"{recommendations.quote}"</p>
        </div>

        {/* Activity Suggestion */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Suggested Activity:</p>
          <p className="text-sm text-muted-foreground">{recommendations.activity}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {latestMood === 'anxious' || latestMood === 'stressed' ? (
            <Button 
              onClick={handleBreathingExercise}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
              size="sm"
            >
              <Wind className="h-4 w-4 mr-2" />
              Start Breathing Exercise
            </Button>
          ) : null}

          {recommendations.music && (
            <Button 
              onClick={() => window.open(recommendations.music, '_blank')}
              variant="outline"
              className="w-full"
              size="sm"
            >
              <Music className="h-4 w-4 mr-2" />
              Listen to Mood Music
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          )}

          {latestMood === 'happy' && (
            <div className="text-center p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Sparkles className="h-4 w-4 mx-auto mb-1 text-yellow-600" />
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                Keep spreading those positive vibes! ✨
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
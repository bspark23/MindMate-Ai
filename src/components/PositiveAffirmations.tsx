import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Heart, Bookmark, RefreshCw } from 'lucide-react'

const AFFIRMATIONS = [
  "You are stronger than you think and braver than you feel.",
  "Every small step you take matters and brings you closer to your goals.",
  "You deserve love, kindness, and all the good things life has to offer.",
  "Your feelings are valid, and it's okay to take things one day at a time.",
  "You have overcome challenges before, and you have the strength to do it again.",
  "You are worthy of peace, happiness, and inner calm.",
  "Progress isn't always linear, and that's perfectly okay.",
  "You are enough, exactly as you are right now.",
  "Your mental health matters, and taking care of yourself is not selfish.",
  "You have the power to create positive change in your life.",
  "It's okay to rest, to pause, and to give yourself grace.",
  "You are not alone in your journey, and support is always available.",
  "Your story is still being written, and beautiful chapters await.",
  "You have unique gifts and talents that make the world brighter.",
  "Healing takes time, and you're allowed to move at your own pace."
]

export function PositiveAffirmations() {
  const [currentAffirmation, setCurrentAffirmation] = useState('')
  const [savedAffirmations, setSavedAffirmations] = useState<string[]>([])
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    // Load saved affirmations
    const saved = JSON.parse(localStorage.getItem('mindmate_saved_affirmations') || '[]')
    setSavedAffirmations(saved)
    
    // Get daily affirmation (same one per day)
    const today = new Date().toDateString()
    const lastAffirmationDate = localStorage.getItem('mindmate_affirmation_date')
    
    if (lastAffirmationDate !== today) {
      const randomIndex = Math.floor(Math.random() * AFFIRMATIONS.length)
      const affirmation = AFFIRMATIONS[randomIndex]
      setCurrentAffirmation(affirmation)
      localStorage.setItem('mindmate_daily_affirmation', affirmation)
      localStorage.setItem('mindmate_affirmation_date', today)
    } else {
      const savedDaily = localStorage.getItem('mindmate_daily_affirmation')
      setCurrentAffirmation(savedDaily || AFFIRMATIONS[0])
    }
  }, [])

  const getNewAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * AFFIRMATIONS.length)
    const affirmation = AFFIRMATIONS[randomIndex]
    setCurrentAffirmation(affirmation)
  }

  const saveAffirmation = () => {
    if (currentAffirmation && !savedAffirmations.includes(currentAffirmation)) {
      const updated = [...savedAffirmations, currentAffirmation]
      setSavedAffirmations(updated)
      localStorage.setItem('mindmate_saved_affirmations', JSON.stringify(updated))
    }
  }

  const removeSavedAffirmation = (affirmation: string) => {
    const updated = savedAffirmations.filter(a => a !== affirmation)
    setSavedAffirmations(updated)
    localStorage.setItem('mindmate_saved_affirmations', JSON.stringify(updated))
  }

  return (
    <div className="space-y-4">
      {/* Daily Affirmation */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-600" />
            Daily Affirmation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
              "{currentAffirmation}"
            </p>
            
            <div className="flex gap-2 justify-center">
              <Button
                onClick={saveAffirmation}
                variant="outline"
                size="sm"
                disabled={savedAffirmations.includes(currentAffirmation)}
              >
                <Bookmark className="h-4 w-4 mr-1" />
                {savedAffirmations.includes(currentAffirmation) ? 'Saved' : 'Save Quote'}
              </Button>
              
              <Button
                onClick={getNewAffirmation}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                New Quote
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Affirmations */}
      {savedAffirmations.length > 0 && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-600" />
                Saved Affirmations ({savedAffirmations.length})
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSaved(!showSaved)}
              >
                {showSaved ? 'Hide' : 'Show'}
              </Button>
            </div>
          </CardHeader>
          
          {showSaved && (
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {savedAffirmations.map((affirmation, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-3 bg-white/50 dark:bg-black/20 rounded-lg"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex-1 pr-2">
                      "{affirmation}"
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSavedAffirmation(affirmation)}
                      className="text-red-500 hover:text-red-700 px-2"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}
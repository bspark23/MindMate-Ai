import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { saveMoodEntry } from '@/lib/user-storage'
import { Heart } from 'lucide-react'

interface MoodSelectorProps {
  onMoodSelected: () => void
}

export function MoodSelector({ onMoodSelected }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState('')
  const [intensity, setIntensity] = useState(5)
  const [notes, setNotes] = useState('')

  const moods = [
    { name: 'happy', emoji: '😊', color: 'bg-yellow-100' },
    { name: 'sad', emoji: '😢', color: 'bg-blue-100' },
    { name: 'anxious', emoji: '😰', color: 'bg-orange-100' },
    { name: 'excited', emoji: '🤩', color: 'bg-green-100' },
    { name: 'stressed', emoji: '😤', color: 'bg-red-100' },
    { name: 'calm', emoji: '😌', color: 'bg-purple-100' },
    { name: 'angry', emoji: '😠', color: 'bg-red-200' },
    { name: 'neutral', emoji: '😐', color: 'bg-gray-100' },
  ]

  const handleSaveMood = () => {
    if (selectedMood) {
      const entry = {
        id: Date.now().toString(),
        mood: selectedMood,
        intensity,
        timestamp: Date.now(),
        notes: notes.trim() || undefined,
      }
      
      saveMoodEntry(entry)
      onMoodSelected()
      
      // Show success message
      alert(`🎉 Mood logged successfully! You're doing great by checking in with yourself.`)
      
      // Reset form
      setSelectedMood('')
      setIntensity(5)
      setNotes('')
    }
  }

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-600" />
          How are you feeling?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-4 gap-3">
          {moods.map((mood) => (
            <button
              key={mood.name}
              onClick={() => setSelectedMood(mood.name)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedMood === mood.name
                  ? 'border-pink-500 bg-pink-100 dark:bg-pink-900/30'
                  : 'border-gray-200 hover:border-pink-300'
              } ${mood.color} dark:bg-opacity-20`}
            >
              <div className="text-2xl mb-1">{mood.emoji}</div>
              <div className="text-xs font-medium capitalize">{mood.name}</div>
            </button>
          ))}
        </div>

        {selectedMood && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Intensity (1-10): {intensity}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Notes (optional)
              </label>
              <Input
                placeholder="What's on your mind?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button
              onClick={handleSaveMood}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            >
              Save Mood Entry
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

export function DailyChallenge() {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Daily Challenge
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm font-medium">Take 5 deep breaths</p>
          <p className="text-sm text-muted-foreground">
            Practice mindful breathing to center yourself and reduce stress.
          </p>
          <div className="text-center py-2">
            <span className="text-lg">🧘‍♀️</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
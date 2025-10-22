import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Target, Plus, Minus, CheckCircle } from 'lucide-react'
import { getGoals, saveGoals, Goal } from '@/lib/user-storage'

export function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([])

  useEffect(() => {
    setGoals(getGoals())
  }, [])

  const updateGoalProgress = (goalId: string, increment: boolean) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newCurrent = increment 
          ? Math.min(goal.current + 1, goal.target)
          : Math.max(goal.current - 1, 0)
        return { ...goal, current: newCurrent }
      }
      return goal
    })
    setGoals(updatedGoals)
    saveGoals(updatedGoals)
  }

  const resetDailyGoals = () => {
    const resetGoals = goals.map(goal => ({ ...goal, current: 0 }))
    setGoals(resetGoals)
    saveGoals(resetGoals)
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const isGoalCompleted = (current: number, target: number) => {
    return current >= target
  }

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Daily Goals
          </div>
          <Button 
            onClick={resetDailyGoals}
            variant="ghost" 
            size="sm"
            className="text-xs"
          >
            Reset
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{goal.icon}</span>
                <span className="text-sm font-medium">{goal.title}</span>
                {isGoalCompleted(goal.current, goal.target) && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => updateGoalProgress(goal.id, false)}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  disabled={goal.current === 0}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-medium min-w-[60px] text-center">
                  {goal.current}/{goal.target} {goal.unit}
                </span>
                <Button
                  onClick={() => updateGoalProgress(goal.id, true)}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  disabled={goal.current >= goal.target}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${goal.color}`}
                style={{ width: `${getProgressPercentage(goal.current, goal.target)}%` }}
              />
            </div>
            
            {isGoalCompleted(goal.current, goal.target) && (
              <p className="text-xs text-green-600 font-medium">
                🎉 Goal completed! Great job!
              </p>
            )}
          </div>
        ))}

        {/* Daily Summary */}
        <div className="pt-2 border-t">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              {goals.filter(g => isGoalCompleted(g.current, g.target)).length} of {goals.length} goals completed today
            </p>
            {goals.every(g => isGoalCompleted(g.current, g.target)) && goals.length > 0 && (
              <p className="text-xs text-green-600 font-medium mt-1">
                🌟 All goals completed! You're amazing!
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
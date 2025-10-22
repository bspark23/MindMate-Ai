'use client';

import { useState, useEffect } from 'react';
import { getGoals, saveGoals, Goal } from '@/lib/user-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Minus, Target, Trophy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedGoals = getGoals();
    setGoals(loadedGoals);
    setIsLoading(false);
  }, []);

  const updateGoal = (goalId: string, change: number) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newCurrent = Math.max(0, Math.min(goal.target, goal.current + change));
        const wasCompleted = goal.current === goal.target;
        const isNowCompleted = newCurrent === goal.target;
        
        if (!wasCompleted && isNowCompleted) {
          toast({
            title: "🎉 Goal Completed!",
            description: `Amazing! You've completed your ${goal.title} goal!`,
            duration: 4000,
          });
        }
        
        return { ...goal, current: newCurrent };
      }
      return goal;
    });
    
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const resetDailyGoals = () => {
    const resetGoals = goals.map(goal => ({ ...goal, current: 0 }));
    setGoals(resetGoals);
    saveGoals(resetGoals);
    toast({
      title: "Goals Reset",
      description: "All goals have been reset for a new day!",
    });
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(100, (current / target) * 100);
  };

  const getCompletedGoalsCount = () => {
    return goals.filter(goal => goal.current >= goal.target).length;
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Daily Goals
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
            <Trophy className="h-4 w-4" />
            {getCompletedGoalsCount()}/{goals.length}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetDailyGoals}
            className="text-xs"
          >
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => {
          const progress = getProgressPercentage(goal.current, goal.target);
          const isCompleted = goal.current >= goal.target;
          
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{goal.icon}</span>
                  <span className="font-medium text-sm">{goal.title}</span>
                  {isCompleted && <span className="text-green-500">✓</span>}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateGoal(goal.id, -1)}
                    disabled={goal.current <= 0}
                    className="h-6 w-6 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium min-w-[60px] text-center">
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateGoal(goal.id, 1)}
                    disabled={goal.current >= goal.target}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Progress 
                value={progress} 
                className={`h-2 ${isCompleted ? 'bg-green-100' : 'bg-gray-200'}`}
              />
            </div>
          );
        })}
        
        {getCompletedGoalsCount() === goals.length && goals.length > 0 && (
          <div className="text-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
            <div className="text-2xl mb-2">🎉</div>
            <p className="font-medium text-green-700 dark:text-green-300">
              Amazing! You've completed all your goals today!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
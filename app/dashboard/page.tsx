'use client';

import { useState, useEffect } from 'react';
import { getMoodEntries, getUserProfile } from '@/lib/user-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calendar, Award, Heart, Filter } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export default function DashboardPage() {
  const [moodEntries, setMoodEntries] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    setMoodEntries(getMoodEntries());
    setUserProfile(getUserProfile());
  }, []);

  const getFilteredEntries = () => {
    const now = new Date();
    switch (timeFilter) {
      case 'week':
        const weekStart = startOfWeek(now);
        const weekEnd = endOfWeek(now);
        return moodEntries.filter(entry => {
          const entryDate = new Date(entry.timestamp);
          return entryDate >= weekStart && entryDate <= weekEnd;
        });
      case 'month':
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        return moodEntries.filter(entry => {
          const entryDate = new Date(entry.timestamp);
          return entryDate >= monthStart && entryDate <= monthEnd;
        });
      default:
        return moodEntries;
    }
  };

  const filteredEntries = getFilteredEntries();

  // Mood distribution data for pie chart
  const moodDistribution = filteredEntries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(moodDistribution).map(([mood, count]) => ({
    name: mood,
    value: count as number,
    emoji: {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      excited: '🤩',
      calm: '😌',
      stressed: '😤',
      grateful: '🙏',
      neutral: '😐'
    }[mood] || '😐'
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0', '#ffb347', '#87ceeb'];

  // Mood over time data for line chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayEntries = filteredEntries.filter(entry => 
      format(new Date(entry.timestamp), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    const avgIntensity = dayEntries.length > 0 
      ? dayEntries.reduce((sum, entry) => sum + entry.intensity, 0) / dayEntries.length 
      : 0;
    
    return {
      date: format(date, 'MMM dd'),
      intensity: Math.round(avgIntensity * 10) / 10,
      count: dayEntries.length
    };
  });

  // Achievements
  const achievements = [
    {
      title: 'Consistency Star',
      description: '7 days of mood logging',
      earned: userProfile?.currentStreak >= 7,
      icon: '🌟'
    },
    {
      title: 'Positive Mindset',
      description: '10 happy mood logs',
      earned: moodEntries.filter(e => e.mood === 'happy').length >= 10,
      icon: '💫'
    },
    {
      title: 'Self-Aware',
      description: '50 total mood entries',
      earned: moodEntries.length >= 50,
      icon: '🧠'
    },
    {
      title: 'Wellness Warrior',
      description: '30-day streak',
      earned: userProfile?.currentStreak >= 30,
      icon: '🏆'
    }
  ];

  const getMoodTrend = () => {
    if (filteredEntries.length < 2) return 'Not enough data';
    
    const recent = filteredEntries.slice(0, Math.ceil(filteredEntries.length / 2));
    const older = filteredEntries.slice(Math.ceil(filteredEntries.length / 2));
    
    const recentAvg = recent.reduce((sum, entry) => sum + entry.intensity, 0) / recent.length;
    const olderAvg = older.reduce((sum, entry) => sum + entry.intensity, 0) / older.length;
    
    if (recentAvg > olderAvg + 0.5) return 'improving 📈';
    if (recentAvg < olderAvg - 0.5) return 'declining 📉';
    return 'stable 📊';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            My Progress Dashboard
          </h1>
          <p className="text-muted-foreground">Track your emotional wellness journey</p>
        </div>
        
        <div className="flex gap-2">
          {(['week', 'month', 'all'] as const).map((filter) => (
            <Button
              key={filter}
              variant={timeFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeFilter(filter)}
              className="capitalize"
            >
              <Filter className="h-4 w-4 mr-1" />
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-bold">{filteredEntries.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{userProfile?.currentStreak || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mood Trend</p>
                <p className="text-lg font-bold capitalize">{getMoodTrend()}</p>
              </div>
              <Heart className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                <p className="text-2xl font-bold">{achievements.filter(a => a.earned).length}/{achievements.length}</p>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Mood Distribution */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, emoji }) => `${emoji} ${name} (${value})`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] sm:h-[300px] flex items-center justify-center text-muted-foreground">
                No mood data available for this period
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mood Over Time */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Mood Intensity Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <LineChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="intensity"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.earned
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h3 className="font-semibold text-sm">{achievement.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                  {achievement.earned && (
                    <div className="mt-2 text-xs font-medium text-yellow-600 dark:text-yellow-400">
                      ✓ Earned!
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
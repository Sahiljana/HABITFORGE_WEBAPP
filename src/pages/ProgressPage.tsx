import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Flame, BarChart3, PieChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useHabitData } from '@/hooks/useHabitData';

export default function ProgressPage() {
  const { data } = useHabitData();

  // Calculate progress metrics
  const today = new Date().toISOString().split('T')[0];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  // Weekly completion stats
  const weeklyStats = last7Days.map(date => {
    const completed = data.habits.filter(habit => 
      habit.completedDates.includes(date)
    ).length;
    const total = data.habits.length;
    const rate = total > 0 ? (completed / total) * 100 : 0;
    
    return {
      date,
      completed,
      total,
      rate,
      dayName: new Date(date).toLocaleDateString('en', { weekday: 'short' })
    };
  });

  // Monthly completion rate
  const monthlyCompletions = last30Days.reduce((acc, date) => {
    const completed = data.habits.filter(habit => 
      habit.completedDates.includes(date)
    ).length;
    return acc + completed;
  }, 0);
  
  const monthlyPossible = data.habits.length * 30;
  const monthlyRate = monthlyPossible > 0 ? (monthlyCompletions / monthlyPossible) * 100 : 0;

  // Habit completion distribution
  const habitStats = data.habits.map(habit => {
    // Ensure createdAt is a Date object
    let createdAtDate = habit.createdAt;
    if (typeof createdAtDate === 'string') {
      createdAtDate = new Date(createdAtDate);
    }
    return {
      name: habit.name,
      completions: habit.completedDates.length,
      currentStreak: habit.currentStreak,
      bestStreak: habit.bestStreak,
      completionRate: habit.completedDates.length > 0 ? 
        (habit.completedDates.length / Math.max(1, Math.ceil((Date.now() - createdAtDate.getTime()) / (1000 * 60 * 60 * 24)))) * 100 : 0
    };
  }).sort((a, b) => b.completions - a.completions);

  const totalStreaks = data.habits.reduce((acc, habit) => acc + habit.currentStreak, 0);
  const avgStreak = data.habits.length > 0 ? totalStreaks / data.habits.length : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (data.habits.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="max-w-4xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
                <TrendingUp className="w-10 h-10 text-primary" />
                Progress
              </h1>
              <p className="text-xl text-muted-foreground">
                Track your habit completion and growth over time
              </p>
            </div>

            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="py-16"
            >
              <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                <BarChart3 className="w-16 h-16 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">No Data Yet</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start tracking habits to see your progress analytics and insights here.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto p-6 space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
            <TrendingUp className="w-10 h-10 text-primary" />
            Progress Analytics
          </h1>
          <p className="text-muted-foreground">
            Your habit tracking insights and performance metrics
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{data.habits.length}</p>
                    <p className="text-sm text-muted-foreground">Active Habits</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Flame className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{Math.round(avgStreak)}</p>
                    <p className="text-sm text-muted-foreground">Avg Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-8 h-8 text-success" />
                  <div>
                    <p className="text-2xl font-bold">{Math.round(monthlyRate)}%</p>
                    <p className="text-sm text-muted-foreground">Monthly Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-8 h-8 text-info" />
                  <div>
                    <p className="text-2xl font-bold">{monthlyCompletions}</p>
                    <p className="text-sm text-muted-foreground">Completions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Weekly Trend */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Weekly Completion Trend
              </CardTitle>
              <CardDescription>
                Your habit completion rate over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyStats.map((day, index) => (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-12 text-sm font-medium text-muted-foreground">
                      {day.dayName}
                    </div>
                    <div className="flex-1">
                      <Progress value={day.rate} className="h-3" />
                    </div>
                    <div className="w-16 text-sm text-right">
                      <span className="font-medium">{day.completed}/{day.total}</span>
                    </div>
                    <div className="w-12 text-right">
                      <Badge variant="outline" className="text-xs">
                        {Math.round(day.rate)}%
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Habit Performance */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                Individual Habit Performance
              </CardTitle>
              <CardDescription>
                Detailed breakdown of each habit's progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {habitStats.map((habit, index) => (
                  <motion.div
                    key={habit.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{habit.name}</h4>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Flame className="w-4 h-4 text-orange-500 mr-1" />
                          <span className="font-medium">{habit.currentStreak}</span>
                        </div>
                        <div className="text-muted-foreground">
                          Best: {habit.bestStreak}
                        </div>
                        <div className="text-muted-foreground">
                          Total: {habit.completions}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Completion Rate</span>
                        <span className="font-medium">{Math.round(habit.completionRate)}%</span>
                      </div>
                      <Progress value={habit.completionRate} className="h-2" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
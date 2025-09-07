import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Target, 
  TrendingUp, 
  Award, 
  Zap, 
  Calendar, 
  User,
  Edit3,
  Plus,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useHabitData } from '@/hooks/useHabitData';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const { data, updateProfile, completeOnboarding } = useHabitData();
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(data.profile.name);

  const todayCompleted = data.habits.filter(habit => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDates.includes(today);
  }).length;

  const totalHabits = data.habits.length;
  const completionRate = totalHabits > 0 ? (todayCompleted / totalHabits) * 100 : 0;
  
  const xpProgress = (data.profile.xp / 100) * 100;

  const handleProfileUpdate = () => {
    updateProfile({ name: profileName });
    setEditingProfile(false);
  };

  const quickStats = [
    {
      label: 'Today\'s Progress',
      value: `${todayCompleted}/${totalHabits}`,
      icon: Target,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Current Level',
      value: data.profile.level,
      icon: Zap,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Total XP',
      value: data.profile.totalXp,
      icon: Star,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'Badges Earned',
      value: data.profile.badges.length,
      icon: Award,
      color: 'text-info',
      bgColor: 'bg-info/10'
    }
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto p-6 space-y-8"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="relative inline-block">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-20"
            />
            <div className="relative bg-gradient-primary p-4 rounded-2xl shadow-glow">
              <User className="w-12 h-12 text-primary-foreground mx-auto" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-4xl font-bold">
                Welcome back, {data.profile.name}!
              </h1>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Personalize your habit tracking experience
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Display Name</label>
                      <Input
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="Enter your name"
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={handleProfileUpdate} className="w-full">
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <p className="text-xl text-muted-foreground">
              Ready to continue building amazing habits?
            </p>
          </div>
        </motion.div>

        {/* XP Progress */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Level {data.profile.level}
                  </CardTitle>
                  <CardDescription>
                    {data.profile.xp}/100 XP to next level
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {data.profile.totalXp}
                  </div>
                  <div className="text-sm text-muted-foreground">Total XP</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={xpProgress} className="h-3" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Current Progress</span>
                  <span>{Math.round(xpProgress)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="shadow-card hover:shadow-glow transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className={cn("p-3 rounded-lg", stat.bgColor)}>
                          <Icon className={cn("w-6 h-6", stat.color)} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-sm text-muted-foreground">
                            {stat.label}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Today's Progress */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Today's Progress
              </CardTitle>
              <CardDescription>
                {completionRate === 100 && totalHabits > 0
                  ? "🎉 Perfect day! All habits completed!"
                  : `${todayCompleted} of ${totalHabits} habits completed`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={completionRate} className="h-3" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Completion Rate: {Math.round(completionRate)}%
                  </span>
                  <div className="flex gap-2">
                    <Link to="/habits">
                      <Button size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Habit
                      </Button>
                    </Link>
                    <Link to="/progress">
                      <Button size="sm">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        View Progress
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/habits" className="group">
              <Card className="shadow-card hover:shadow-glow transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Manage Habits</h3>
                  <p className="text-sm text-muted-foreground">
                    Add, complete, and track your daily habits
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/progress" className="group">
              <Card className="shadow-card hover:shadow-glow transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 text-success mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">View Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    Analyze your streaks and improvement
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/badges" className="group">
              <Card className="shadow-card hover:shadow-glow transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Award className="w-12 h-12 text-warning mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Earn Badges</h3>
                  <p className="text-sm text-muted-foreground">
                    Unlock achievements and celebrate milestones
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
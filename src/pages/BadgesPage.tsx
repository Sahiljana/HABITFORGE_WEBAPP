import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Zap, Trophy, Crown, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useHabitData } from '@/hooks/useHabitData';
import { cn } from '@/lib/utils';

interface BadgeData {
  id: string;
  name: string;
  description: string;
  xpRequired: number;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  glowColor: string;
}

const badges: BadgeData[] = [
  {
    id: 'bronze',
    name: 'Bronze Explorer',
    description: 'Earned your first 100 XP points',
    xpRequired: 100,
    icon: Award,
    color: 'text-bronze',
    bgColor: 'bg-gradient-to-br from-amber-400 to-orange-500',
    glowColor: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]'
  },
  {
    id: 'silver',
    name: 'Silver Achiever',
    description: 'Reached 300 XP with consistent progress',
    xpRequired: 300,
    icon: Star,
    color: 'text-silver',
    bgColor: 'bg-gradient-to-br from-gray-300 to-gray-500',
    glowColor: 'shadow-[0_0_20px_rgba(156,163,175,0.3)]'
  },
  {
    id: 'gold',
    name: 'Gold Champion',
    description: 'Accumulated 600 XP through dedication',
    xpRequired: 600,
    icon: Trophy,
    color: 'text-gold',
    bgColor: 'bg-gradient-to-br from-yellow-400 to-amber-500',
    glowColor: 'shadow-[0_0_20px_rgba(251,191,36,0.4)]'
  },
  {
    id: 'diamond',
    name: 'Diamond Master',
    description: 'Reached the pinnacle with 1000+ XP',
    xpRequired: 1000,
    icon: Crown,
    color: 'text-diamond',
    bgColor: 'bg-gradient-to-br from-cyan-400 to-blue-500',
    glowColor: 'shadow-[0_0_25px_rgba(34,211,238,0.4)]'
  }
];

export default function BadgesPage() {
  const { data } = useHabitData();
  const earnedBadges = new Set(data.profile.badges);

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

  const badgeVariants = {
    earned: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20
      }
    },
    locked: {
      scale: 0.95,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto p-6 space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <Award className="w-10 h-10 text-primary" />
            Achievement Badges
          </h1>
          <p className="text-xl text-muted-foreground">
            Unlock badges as you build consistent habits and earn XP
          </p>
        </motion.div>

        {/* Progress Summary */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Your Progress
              </CardTitle>
              <CardDescription>
                {earnedBadges.size} of {badges.length} badges earned
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-primary">{data.profile.totalXp}</p>
                  <p className="text-sm text-muted-foreground">Total XP</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-success">{data.profile.level}</p>
                  <p className="text-sm text-muted-foreground">Current Level</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-warning">{earnedBadges.size}</p>
                  <p className="text-sm text-muted-foreground">Badges Earned</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-info">{data.habits.length}</p>
                  <p className="text-sm text-muted-foreground">Active Habits</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Badge Collection Progress</span>
                  <span>{Math.round((earnedBadges.size / badges.length) * 100)}%</span>
                </div>
                <Progress value={(earnedBadges.size / badges.length) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Badges Grid */}
        <motion.div variants={itemVariants}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {badges.map((badge, index) => {
              const isEarned = earnedBadges.has(badge.id);
              const Icon = badge.icon;
              const progress = Math.min((data.profile.totalXp / badge.xpRequired) * 100, 100);
              
              return (
                <motion.div
                  key={badge.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className={cn(
                    "shadow-card transition-all duration-500 overflow-hidden",
                    isEarned ? "shadow-glow ring-2 ring-primary/20" : "opacity-75"
                  )}>
                    <CardContent className="p-8">
                      <div className="flex items-start space-x-6">
                        {/* Badge Icon */}
                        <motion.div
                          variants={badgeVariants}
                          animate={isEarned ? "earned" : "locked"}
                          whileHover={isEarned ? { rotate: [0, -5, 5, 0], scale: 1.1 } : {}}
                          className={cn(
                            "relative flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center",
                            isEarned ? badge.bgColor : "bg-muted",
                            isEarned && badge.glowColor
                          )}
                        >
                          <Icon className={cn(
                            "w-10 h-10",
                            isEarned ? "text-white" : "text-muted-foreground"
                          )} />
                          
                          {isEarned && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                              className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center"
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              >
                                ✓
                              </motion.div>
                            </motion.div>
                          )}
                          
                          {!isEarned && (
                            <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
                              <div className="w-8 h-8 border-2 border-muted-foreground rounded-full flex items-center justify-center">
                                <div className="w-4 h-4 bg-muted-foreground rounded-full opacity-50" />
                              </div>
                            </div>
                          )}
                        </motion.div>

                        {/* Badge Details */}
                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className={cn(
                              "text-xl font-bold mb-1",
                              isEarned ? "text-foreground" : "text-muted-foreground"
                            )}>
                              {badge.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {badge.description}
                            </p>
                            
                            <div className="flex items-center gap-2">
                              <Badge variant={isEarned ? "default" : "outline"} className="text-xs">
                                {badge.xpRequired} XP Required
                              </Badge>
                              {isEarned && (
                                <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                                  ✓ EARNED
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Progress Bar */}
                          {!isEarned && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">
                                  {data.profile.totalXp}/{badge.xpRequired} XP
                                </span>
                              </div>
                              <Progress value={progress} className="h-2" />
                              <p className="text-xs text-muted-foreground">
                                {badge.xpRequired - data.profile.totalXp} XP remaining
                              </p>
                            </div>
                          )}
                          
                          {isEarned && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex items-center text-success text-sm font-medium"
                            >
                              <Trophy className="w-4 h-4 mr-2" />
                              Congratulations! Badge earned
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Next Badge Teaser */}
        {earnedBadges.size < badges.length && (
          <motion.div variants={itemVariants}>
            <Card className="shadow-card bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keep Going!</h3>
                <p className="text-muted-foreground mb-4">
                  Continue completing your daily habits to unlock the next achievement badge.
                  Each completed habit earns you +10 XP.
                </p>
                <div className="text-sm text-primary font-medium">
                  Next milestone: {badges.find(b => !earnedBadges.has(b.id))?.xpRequired} XP
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
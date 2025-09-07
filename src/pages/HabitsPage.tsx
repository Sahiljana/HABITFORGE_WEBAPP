import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Target, 
  CheckCircle2, 
  RotateCcw, 
  Trash2, 
  Calendar,
  Flame,
  Trophy,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useHabitData } from '@/hooks/useHabitData';
import { cn } from '@/lib/utils';

export default function HabitsPage() {
  const { data, addHabit, completeHabit, resetHabit, deleteHabit } = useHabitData();
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', description: '' });

  const handleAddHabit = () => {
    if (newHabit.name.trim()) {
      addHabit(newHabit.name, newHabit.description);
      setNewHabit({ name: '', description: '' });
      setIsAddingHabit(false);
    }
  };

  const isCompletedToday = (habit: any) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDates.includes(today);
  };

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
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100, transition: { duration: 0.2 } }
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
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
                <Target className="w-10 h-10 text-primary" />
                Habits
              </h1>
              <p className="text-xl text-muted-foreground">
                Build consistent habits that transform your life
              </p>
            </div>

            {/* Empty State */}
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="py-16"
            >
              <div className="mb-8">
                <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <Target className="w-16 h-16 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">Start Your Journey</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  You haven't created any habits yet. Add your first habit and begin building 
                  the life you want, one day at a time.
                </p>
              </div>

              <Dialog open={isAddingHabit} onOpenChange={setIsAddingHabit}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-glow">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Your First Habit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Habit</DialogTitle>
                    <DialogDescription>
                      Create a habit that you want to track daily
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Habit Name *</label>
                      <Input
                        placeholder="e.g., Drink 8 glasses of water"
                        value={newHabit.name}
                        onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description (Optional)</label>
                      <Textarea
                        placeholder="Why is this habit important to you?"
                        value={newHabit.description}
                        onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddHabit} className="flex-1">
                        Add Habit
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsAddingHabit(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
        className="max-w-6xl mx-auto p-6 space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Target className="w-10 h-10 text-primary" />
              Habits
            </h1>
            <p className="text-muted-foreground mt-2">
              {data.habits.length} habit{data.habits.length !== 1 ? 's' : ''} in your arsenal
            </p>
          </div>
          
          <Dialog open={isAddingHabit} onOpenChange={setIsAddingHabit}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90 shadow-glow">
                <Plus className="w-5 h-5 mr-2" />
                Add Habit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Habit</DialogTitle>
                <DialogDescription>
                  Create a habit that you want to track daily
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Habit Name *</label>
                  <Input
                    placeholder="e.g., Read for 30 minutes"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description (Optional)</label>
                  <Textarea
                    placeholder="Why is this habit important to you?"
                    value={newHabit.description}
                    onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddHabit} className="flex-1">
                    Add Habit
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingHabit(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Habits Grid */}
        <motion.div variants={itemVariants}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {data.habits.map((habit) => {
                const completed = isCompletedToday(habit);
                
                return (
                  <motion.div
                    key={habit.id}
                    variants={itemVariants}
                    exit="exit"
                    layout
                    className="group"
                  >
                    <Card className={cn(
                      "shadow-card hover:shadow-glow transition-all duration-300",
                      completed && "ring-2 ring-success shadow-glow"
                    )}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className={cn(
                              "text-lg mb-1",
                              completed && "text-success"
                            )}>
                              {habit.name}
                            </CardTitle>
                            {habit.description && (
                              <CardDescription className="text-sm">
                                {habit.description}
                              </CardDescription>
                            )}
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              size="icon"
                              variant={completed ? "default" : "outline"}
                              onClick={() => completeHabit(habit.id)}
                              className={cn(
                                "h-10 w-10 shrink-0",
                                completed && "bg-success hover:bg-success/90 text-success-foreground"
                              )}
                            >
                              <CheckCircle2 className={cn(
                                "w-5 h-5",
                                completed && "animate-bounce-in"
                              )} />
                            </Button>
                          </motion.div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="space-y-1">
                            <div className="flex items-center justify-center">
                              <Flame className="w-4 h-4 text-orange-500 mr-1" />
                              <span className="font-bold text-orange-500">
                                {habit.currentStreak}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">Current</p>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center justify-center">
                              <Trophy className="w-4 h-4 text-warning mr-1" />
                              <span className="font-bold text-warning">
                                {habit.bestStreak}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">Best</p>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-info mr-1" />
                              <span className="font-bold text-info">
                                {habit.completedDates.length}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">Total</p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex justify-center">
                          <Badge 
                            variant={completed ? "default" : "secondary"}
                            className={cn(
                              "transition-all duration-200",
                              completed && "bg-success text-success-foreground animate-pulse-xp"
                            )}
                          >
                            {completed ? "✅ Completed Today" : "⏳ Pending"}
                          </Badge>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resetHabit(habit.id)}
                            className="flex-1 text-xs"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Reset
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Habit</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{habit.name}"? 
                                  This action cannot be undone and all progress will be lost.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteHabit(habit.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
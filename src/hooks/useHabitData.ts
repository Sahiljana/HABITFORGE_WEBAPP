import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { fetchHabits, addHabitApi, deleteHabitApi, completeHabitApi, resetHabitApi, getProfileApi } from '@/services/habitApi';
import { useAuth } from './useAuth';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  completedDates: string[]; // Array of date strings (YYYY-MM-DD)
  currentStreak: number;
  bestStreak: number;
}

export interface UserProfile {
  name: string;
  avatar?: string;
  level: number;
  xp: number;
  totalXp: number;
  badges: string[];
}

export interface AppData {
  habits: Habit[];
  profile: UserProfile;
  onboardingCompleted: boolean;
}

const STORAGE_KEY = 'habit-tracker-data';

const defaultProfile: UserProfile = {
  name: 'Habit Hero',
  level: 1,
  xp: 0,
  totalXp: 0,
  badges: []
};

const defaultData: AppData = {
  habits: [],
  profile: defaultProfile,
  onboardingCompleted: false
};

export function useHabitData() {
  const [data, setData] = useState<AppData>(defaultData);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHabitsAndProfile() {
      setLoading(true);
      if (user) {
        try {
          const [habits, profile] = await Promise.all([
            fetchHabits(),
            getProfileApi()
          ]);
          setData(prev => ({ ...prev, habits, profile }));
        } catch (e) {
          toast({ title: 'Error', description: 'Failed to load habits or profile from server.' });
        }
      } else {
        // Load from localStorage for guests
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            parsed.habits = parsed.habits.map((habit: any) => ({
              ...habit,
              createdAt: new Date(habit.createdAt)
            }));
            setData(parsed);
          } catch (error) {
            console.error('Error loading habit data:', error);
          }
        }
      }
      setLoading(false);
    }
    loadHabitsAndProfile();
    // eslint-disable-next-line
  }, [user]);

  const saveData = (newData: AppData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    setData(newData);
  };

  const addHabit = async (name: string, description?: string) => {
    if (user) {
      try {
        const habit = await addHabitApi(name, description);
        setData(prev => ({ ...prev, habits: [...prev.habits, habit] }));
        toast({ title: "Habit Added! 🎯", description: `"${name}" is now being tracked.` });
      } catch {
        toast({ title: 'Error', description: 'Failed to add habit.' });
      }
    } else {
      // Local fallback
      const newHabit: Habit = {
        id: Date.now().toString(),
        name,
        description,
        createdAt: new Date(),
        completedDates: [],
        currentStreak: 0,
        bestStreak: 0
      };
      const newData = {
        ...data,
        habits: [...data.habits, newHabit]
      };
      saveData(newData);
      toast({ title: "Habit Added! 🎯", description: `"${name}" is now being tracked.` });
    }
  };

  const completeHabit = async (habitId: string) => {
    if (user) {
      try {
        // Backend returns { habit, profile }
        const { habit, profile } = await completeHabitApi(habitId, true);
        setData(prev => ({
          ...prev,
          habits: prev.habits.map(h => h.id === habitId ? habit : h),
          profile
        }));
        toast({ title: "Habit Completed! +10 XP 🎉", description: `Keep up the great work!` });
      } catch {
        toast({ title: 'Error', description: 'Failed to complete habit.' });
      }
    } else {
      // ...existing local fallback logic...
      const today = new Date().toISOString().split('T')[0];
      const habit = data.habits.find(h => h.id === habitId);
      if (!habit) return;
      if (habit.completedDates.includes(today)) {
        toast({ title: "Already completed today! ✅", description: "This habit is already marked as done for today." });
        return;
      }
      const newCompletedDates = [...habit.completedDates, today].sort();
      let newStreak = 1;
      const dates = newCompletedDates.map(date => new Date(date));
      dates.reverse();
      for (let i = 1; i < dates.length; i++) {
        const diffTime = dates[i - 1].getTime() - dates[i].getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newStreak++;
        } else {
          break;
        }
      }
      const updatedHabit = {
        ...habit,
        completedDates: newCompletedDates,
        currentStreak: newStreak,
        bestStreak: Math.max(newStreak, habit.bestStreak)
      };
      // XP/level/badges logic unchanged
      const newXp = data.profile.xp + 10;
      const newTotalXp = data.profile.totalXp + 10;
      const newLevel = Math.floor(newTotalXp / 100) + 1;
      const newBadges = [...data.profile.badges];
      const milestones = [
        { xp: 100, badge: 'bronze' },
        { xp: 300, badge: 'silver' },
        { xp: 600, badge: 'gold' },
        { xp: 1000, badge: 'diamond' }
      ];
      milestones.forEach(milestone => {
        if (newTotalXp >= milestone.xp && !newBadges.includes(milestone.badge)) {
          newBadges.push(milestone.badge);
          toast({ title: `New Badge Unlocked! 🏆`, description: `You earned the ${milestone.badge.charAt(0).toUpperCase() + milestone.badge.slice(1)} badge!` });
        }
      });
      const updatedProfile = {
        ...data.profile,
        xp: newXp % 100,
        totalXp: newTotalXp,
        level: newLevel,
        badges: newBadges
      };
      const newData = {
        ...data,
        habits: data.habits.map(h => h.id === habitId ? updatedHabit : h),
        profile: updatedProfile
      };
      saveData(newData);
      toast({ title: "Habit Completed! +10 XP 🎉", description: `Keep up the great work! Current streak: ${newStreak} days.` });
    }
  };

  const resetHabit = async (habitId: string) => {
    if (user) {
      try {
        const habit = await resetHabitApi(habitId);
        setData(prev => ({
          ...prev,
          habits: prev.habits.map(h => h.id === habitId ? habit : h)
        }));
        toast({
          title: "Habit Reset 🔄",
          description: `"${habit.name}" has been reset to start fresh.`
        });
      } catch {
        toast({ title: 'Error', description: 'Failed to reset habit.' });
      }
    } else {
      const habit = data.habits.find(h => h.id === habitId);
      if (!habit) return;
      const resetHabit = {
        ...habit,
        completedDates: [],
        currentStreak: 0
      };
      const newData = {
        ...data,
        habits: data.habits.map(h => h.id === habitId ? resetHabit : h)
      };
      saveData(newData);
      toast({
        title: "Habit Reset 🔄",
        description: `"${habit.name}" has been reset to start fresh.`
      });
    }
  };

  const deleteHabit = async (habitId: string) => {
    if (user) {
      try {
        await deleteHabitApi(habitId);
        setData(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== habitId) }));
        toast({ title: "Habit Deleted 🗑️", description: `Habit has been removed.` });
      } catch {
        toast({ title: 'Error', description: 'Failed to delete habit.' });
      }
    } else {
      const habit = data.habits.find(h => h.id === habitId);
      if (!habit) return;
      const newData = {
        ...data,
        habits: data.habits.filter(h => h.id !== habitId)
      };
      saveData(newData);
      toast({ title: "Habit Deleted 🗑️", description: `"${habit.name}" has been removed.` });
    }
  };

  const resetAllData = () => {
    saveData(defaultData);
    toast({
      title: "All Data Reset 🔄",
      description: "All habits and progress have been cleared."
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const newData = {
      ...data,
      profile: { ...data.profile, ...updates }
    };
    saveData(newData);
  };

  const completeOnboarding = () => {
    const newData = {
      ...data,
      onboardingCompleted: true
    };
    saveData(newData);
  };

  return {
    data,
    addHabit,
    completeHabit,
    resetHabit,
    deleteHabit,
    resetAllData,
    updateProfile,
    completeOnboarding,
    loading
  };
}
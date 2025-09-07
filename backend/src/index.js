
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from './firebase.js';
import { Habit } from './models.js';
import { UserProfile } from './profile.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to verify Firebase token
async function authenticate(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Helper to get or create user profile
async function getOrCreateProfile(userId) {
  let profile = await UserProfile.findOne({ userId });
  if (!profile) {
    profile = new UserProfile({ userId });
    await profile.save();
  }
  return profile;
}

// Get all habits for user
app.get('/api/habits', authenticate, async (req, res) => {
  const habits = await Habit.find({ userId: req.user.uid });
  // Map _id to id for frontend compatibility
  const mapped = habits.map(h => ({
    ...h.toObject(),
    id: h._id.toString(),
    _id: undefined,
    __v: undefined
  }));
  res.json(mapped);
});

// Add a new habit
app.post('/api/habits', authenticate, async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  try {
    const habit = new Habit({
      userId: req.user.uid,
      name,
      description,
      createdAt: new Date(),
      completedDates: [],
      currentStreak: 0,
      bestStreak: 0
    });
    await habit.save();
    if (!habit) return res.status(500).json({ error: 'Failed to create habit' });
    const obj = habit.toObject();
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
    res.status(201).json(obj);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a habit
app.delete('/api/habits/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  await Habit.deleteOne({ _id: id, userId: req.user.uid });
  res.json({ success: true });
});

// Mark habit as complete/incomplete and update user profile
app.patch('/api/habits/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const habit = await Habit.findOne({ _id: id, userId: req.user.uid });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    const profile = await getOrCreateProfile(req.user.uid);
    const today = new Date().toISOString().split('T')[0];
    let xpGained = 0;
    if (!habit.completedDates.includes(today)) {
      habit.completedDates.push(today);
      habit.completedDates.sort();
      // Calculate new streak
      let newStreak = 1;
      const dates = habit.completedDates.map(date => new Date(date));
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
      habit.currentStreak = newStreak;
      habit.bestStreak = Math.max(newStreak, habit.bestStreak);
      await habit.save();
      // XP logic
      xpGained = 10;
      profile.xp += xpGained;
      profile.totalXp += xpGained;
      // Level up
      if (profile.xp >= 100) {
        profile.level += Math.floor(profile.xp / 100);
        profile.xp = profile.xp % 100;
      }
      // Badges
      const milestones = [
        { xp: 100, badge: 'bronze' },
        { xp: 300, badge: 'silver' },
        { xp: 600, badge: 'gold' },
        { xp: 1000, badge: 'diamond' }
      ];
      milestones.forEach(milestone => {
        if (profile.totalXp >= milestone.xp && !profile.badges.includes(milestone.badge)) {
          profile.badges.push(milestone.badge);
        }
      });
      await profile.save();
    }
    const obj = habit.toObject();
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
    res.json({ habit: obj, profile });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset a habit (clear completions and streaks)
app.post('/api/habits/:id/reset', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const habit = await Habit.findOne({ _id: id, userId: req.user.uid });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    habit.completedDates = [];
    habit.currentStreak = 0;
    await habit.save();
    const obj = habit.toObject();
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
app.get('/api/profile', authenticate, async (req, res) => {
  const profile = await getOrCreateProfile(req.user.uid);
  res.json(profile);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

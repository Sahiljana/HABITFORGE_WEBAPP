import mongoose from 'mongoose';


const HabitSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  completedDates: { type: [String], default: [] }, // YYYY-MM-DD
  currentStreak: { type: Number, default: 0 },
  bestStreak: { type: Number, default: 0 },
});

export const Habit = mongoose.model('Habit', HabitSchema);

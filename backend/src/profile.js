import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, default: 'Habit Hero' },
  avatar: { type: String },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  totalXp: { type: Number, default: 0 },
  badges: { type: [String], default: [] }
});

export const UserProfile = mongoose.model('UserProfile', UserProfileSchema);

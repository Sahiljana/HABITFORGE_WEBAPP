const BASE_URL = import.meta.env.VITE_API_URL || '';

export async function getProfileApi() {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/api/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}
export async function resetHabitApi(id: string) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/${id}/reset`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to reset habit');
  return res.json();
}
// API service for habits
import { Habit } from '@/hooks/useHabitData';
import { getIdToken } from 'firebase/auth';
import { auth } from '@/config/firebase';

// Use environment variable for API URL
const API_URL = `${BASE_URL}/api/habits`;

async function getToken() {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return await getIdToken(user);
}

export async function fetchHabits(): Promise<Habit[]> {
  const token = await getToken();
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch habits');
  return res.json();
}

export async function addHabitApi(name: string, description?: string): Promise<Habit> {
  const token = await getToken();
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name, description })
  });
  if (!res.ok) throw new Error('Failed to add habit');
  return res.json();
}

export async function deleteHabitApi(id: string) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete habit');
  return res.json();
}

export async function completeHabitApi(id: string, completed: boolean) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ completed })
  });
  if (!res.ok) throw new Error('Failed to update habit');
  return res.json(); // returns { habit, profile }
}

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { AuthUser, formatAuthUser } from '@/services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        const authUser = formatAuthUser(firebaseUser);
        setUser(authUser);
        // Store user in localStorage for persistence across tabs
        localStorage.setItem('habit-tracker-user', JSON.stringify(authUser));
      } else {
        setUser(null);
        localStorage.removeItem('habit-tracker-user');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, isLoading };
};
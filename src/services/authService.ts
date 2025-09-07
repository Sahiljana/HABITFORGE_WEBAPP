import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebase';

export interface AuthUser {
  email: string;
  name: string;
  uid: string;
}

// Convert Firebase User to our AuthUser interface
export const formatAuthUser = (user: User): AuthUser => ({
  email: user.email || '',
  name: user.displayName || user.email?.split('@')[0] || 'User',
  uid: user.uid
});

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update the user's display name
  await updateProfile(userCredential.user, {
    displayName: name
  });
  
  return formatAuthUser(userCredential.user);
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return formatAuthUser(userCredential.user);
};

// Sign in with Google
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return formatAuthUser(result.user);
};

// Sign out
export const signOutUser = async () => {
  await signOut(auth);
};

// Get current user
export const getCurrentUser = (): AuthUser | null => {
  const user = auth.currentUser;
  return user ? formatAuthUser(user) : null;
};
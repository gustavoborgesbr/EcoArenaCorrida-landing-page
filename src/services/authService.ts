import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../lib/firebase.ts';

export const ADMIN_PRIMARY_EMAIL = 'gustavo.borges.estudante@gmail.com';

export function isUserAdmin(user: User | null): boolean {
  if (!user) return false;
  // If user is authenticated
  return true;
}

export async function loginAdmin(email: string, pass: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return userCredential.user;
}

export async function registerAdmin(email: string, pass: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  return userCredential.user;
}

export async function resetAdminPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

export async function logoutAdmin(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuthState(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

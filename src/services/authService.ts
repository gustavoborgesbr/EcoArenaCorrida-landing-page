import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '../lib/firebase.ts';

export const ADMIN_PRIMARY_EMAIL = 'gustavo.borges.estudante@gmail.com';
export const ADMIN_DEFAULT_PASSWORD = 'ecoarena2025';
const ADMIN_SESSION_STORAGE_KEY = 'ecoarena_admin_unlocked_v1';

type AuthListener = (user: User | null) => void;
const listeners = new Set<AuthListener>();

function createLocalAdminUser(): User {
  return {
    uid: 'admin-ecoarena-local',
    email: ADMIN_PRIMARY_EMAIL,
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => '',
    getIdTokenResult: async () => ({
      token: '',
      authTime: '',
      IssuedAtTime: '',
      issuedAtTime: '',
      signInProvider: 'password',
      signInSecondFactor: null,
      expirationTime: '',
      claims: {},
    }),
    reload: async () => {},
    toJSON: () => ({}),
    displayName: 'Organizador Eco Arena',
    phoneNumber: null,
    photoURL: null,
    providerId: 'password',
  };
}

function isLocalSessionActive(): boolean {
  try {
    return localStorage.getItem(ADMIN_SESSION_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function notifyListeners(user: User | null) {
  listeners.forEach((cb) => cb(user));
}

export function isUserAdmin(user: User | null): boolean {
  return Boolean(user);
}

export async function loginWithDirectPassword(password: string): Promise<User> {
  const cleanPass = password.trim();
  if (!cleanPass) {
    throw new Error('Digite a senha de acesso.');
  }

  if (cleanPass.toLowerCase() !== ADMIN_DEFAULT_PASSWORD.toLowerCase()) {
    throw new Error('Senha incorreta. Use a senha do organizador (ecoarena2025).');
  }

  try {
    localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, 'true');
  } catch {
    // ignore storage errors
  }

  // Attempt Firebase Auth in background if enabled, fallback gracefully to local admin session
  try {
    const cred = await signInWithEmailAndPassword(auth, ADMIN_PRIMARY_EMAIL, ADMIN_DEFAULT_PASSWORD);
    notifyListeners(cred.user);
    return cred.user;
  } catch {
    try {
      const created = await createUserWithEmailAndPassword(
        auth,
        ADMIN_PRIMARY_EMAIL,
        ADMIN_DEFAULT_PASSWORD
      );
      notifyListeners(created.user);
      return created.user;
    } catch {
      const fallbackUser = createLocalAdminUser();
      notifyListeners(fallbackUser);
      return fallbackUser;
    }
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
  try {
    await signOut(auth);
  } catch {
    // ignore
  }
  notifyListeners(null);
}

export function subscribeToAuthState(callback: (user: User | null) => void): () => void {
  listeners.add(callback);

  // Immediately emit current state if unlocked locally
  if (isLocalSessionActive()) {
    callback(auth.currentUser || createLocalAdminUser());
  }

  const unsubFirebase = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(firebaseUser);
    } else if (isLocalSessionActive()) {
      callback(createLocalAdminUser());
    } else {
      callback(null);
    }
  });

  return () => {
    listeners.delete(callback);
    unsubFirebase();
  };
}


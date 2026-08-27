import { getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { GoogleAuthProvider, browserLocalPersistence, getAuth, setPersistence, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

let firebaseApp: FirebaseApp | null = null;
let firebaseDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

export const getFirebaseConfig = (): FirebaseOptions => ({
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? process.env.NEXT_PUBLIC_appId,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? process.env.NEXT_PUBLIC_apiKey,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_projectId,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? process.env.NEXT_PUBLIC_authDomain,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? process.env.NEXT_PUBLIC_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? process.env.NEXT_PUBLIC_messagingSenderId,
});

export const firebaseEnvReady = () => Object.values(getFirebaseConfig()).every(Boolean);

export const getFirebaseApp = () => {
  if (!firebaseEnvReady()) return null;
  if (firebaseApp == null) firebaseApp = getApps()[0] ?? initializeApp(getFirebaseConfig());
  return firebaseApp;
};

export const getFirebaseAuth = () => {
  if (firebaseAuth != null) return firebaseAuth;
  const app = getFirebaseApp();
  if (app == null) return null;
  firebaseAuth = getAuth(app);
  void setPersistence(firebaseAuth, browserLocalPersistence).catch(() => null);
  return firebaseAuth;
};

export const getFirebaseDb = () => {
  if (firebaseDb != null) return firebaseDb;
  const app = getFirebaseApp();
  if (app == null) return null;
  firebaseDb = getFirestore(app);
  return firebaseDb;
};

export const getGoogleProvider = () => {
  if (googleProvider == null) {
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: `select_account` });
  }
  return googleProvider;
};

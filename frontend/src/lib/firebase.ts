import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Fallback to provided config if .env is not set (useful in "No Server" previews)
const fallbackConfig = {
  apiKey: 'AIzaSyA_N5epnrvjdLx8jFHJviTo8JFOzI03E00',
  authDomain: 'simhealth-842b1.firebaseapp.com',
  projectId: 'simhealth-842b1',
  storageBucket: 'simhealth-842b1.firebasestorage.app',
  messagingSenderId: '658304803072',
  appId: '1:658304803072:web:eda6abc14c22ded8cfd3e5',
};

const firebaseConfig = (envConfig.apiKey ? envConfig : fallbackConfig) as typeof envConfig;

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const analyticsPromise = isSupported().then((ok) => (ok ? getAnalytics(app) : null));
export const db = getFirestore(app);



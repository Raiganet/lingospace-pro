'use client';

const FIREBASE_SDK_VERSION = '12.19.0';
let firebasePromise = null;
let persistenceAttempted = false;

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

export const firebaseVapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || '';

export const isFirebaseConfigured = () => Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

const loadScript = (src, id) => new Promise((resolve, reject) => {
  if (typeof document === 'undefined') return reject(new Error('Firebase hanya tersedia di browser.'));
  const existing = document.getElementById(id);
  if (existing) {
    if (window.firebase) return resolve(existing);
    existing.addEventListener('load', () => resolve(existing), { once: true });
    existing.addEventListener('error', () => reject(new Error(`Gagal memuat ${id}`)), { once: true });
    return;
  }

  const script = document.createElement('script');
  script.id = id;
  script.src = src;
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.onload = () => resolve(script);
  script.onerror = () => reject(new Error(`Gagal memuat ${id}`));
  document.head.appendChild(script);
});

export const getFirebase = async ({ includeMessaging = false } = {}) => {
  if (typeof window === 'undefined') throw new Error('Firebase hanya tersedia di browser.');
  if (!isFirebaseConfigured()) throw new Error('Konfigurasi Firebase belum lengkap.');

  if (!firebasePromise) {
    firebasePromise = (async () => {
      const base = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}`;
      await loadScript(`${base}/firebase-app-compat.js`, 'firebase-app-sdk');
      await loadScript(`${base}/firebase-auth-compat.js`, 'firebase-auth-sdk');
      await loadScript(`${base}/firebase-firestore-compat.js`, 'firebase-firestore-sdk');

      const firebase = window.firebase;
      if (!firebase) throw new Error('Firebase SDK tidak tersedia setelah dimuat.');
      if (!firebase.apps?.length) firebase.initializeApp(firebaseConfig);

      const auth = firebase.auth();
      try { await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); } catch {}

      const db = firebase.firestore();
      if (!persistenceAttempted) {
        persistenceAttempted = true;
        db.enablePersistence?.({ synchronizeTabs: true }).catch(() => {});
      }

      return { firebase, auth, db };
    })().catch((error) => {
      firebasePromise = null;
      throw error;
    });
  }

  const baseServices = await firebasePromise;
  if (includeMessaging) {
    const base = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}`;
    await loadScript(`${base}/firebase-messaging-compat.js`, 'firebase-messaging-sdk');
  }
  return baseServices;
};

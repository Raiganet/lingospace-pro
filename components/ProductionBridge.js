'use client';

import { useEffect, useRef } from 'react';
import { getDueVocabulary, readSrsState } from '../lib/learningEngine';
import { getFirebase, isFirebaseConfigured } from '../lib/firebaseBrowser';
import {
  AUTH_EVENT,
  SYNC_EVENT,
  captureLocalSnapshot,
  snapshotFingerprint,
  syncFromCloud,
  syncToCloud,
} from '../lib/cloudSync';

const REVIEW_NOTIFICATION_KEY = 'lingospace_review_notification_date';
const REMINDER_ENABLED_KEY = 'lingospace_review_reminder_enabled';

export default function ProductionBridge() {
  const servicesRef = useRef(null);
  const userRef = useRef(null);
  const syncTimerRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let unsubscribeAuth = null;

    const registerPwa = async () => {
      if (!('serviceWorker' in navigator)) return;
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        window.__lingospaceServiceWorker = registration;
        window.dispatchEvent(new CustomEvent('lingospace:pwa-ready', { detail: { registration } }));
      } catch (error) {
        console.warn('Service worker registration failed:', error);
      }
    };

    const maybeShowReviewReminder = async () => {
      if (localStorage.getItem(REMINDER_ENABLED_KEY) !== 'true') return;
      if (!('Notification' in window) || Notification.permission !== 'granted') return;
      const today = new Date().toISOString().slice(0, 10);
      if (localStorage.getItem(REVIEW_NOTIFICATION_KEY) === today) return;

      try {
        const response = await fetch('/api/vocabulary');
        if (!response.ok) return;
        const vocabulary = await response.json();
        const due = getDueVocabulary(vocabulary, readSrsState(vocabulary));
        if (!due.length) return;
        const registration = window.__lingospaceServiceWorker || await navigator.serviceWorker?.ready;
        await registration?.showNotification?.('Waktunya review di LingoSpace', {
          body: `${due.length} kosakata siap direview hari ini.`,
          icon: '/android-chrome-192x192.png',
          badge: '/favicon-32x32.png',
          tag: 'lingospace-daily-review',
          data: { url: '/?mode=review' },
        });
        localStorage.setItem(REVIEW_NOTIFICATION_KEY, today);
      } catch {}
    };

    const uploadIfChanged = async () => {
      const services = servicesRef.current;
      const user = userRef.current;
      if (!services || !user || !navigator.onLine) return;
      const snapshot = captureLocalSnapshot();
      const fingerprint = snapshotFingerprint(snapshot);
      if (localStorage.getItem('lingospace_sync_last_fingerprint') === fingerprint) return;
      try { await syncToCloud({ ...services, uid: user.uid, snapshot }); } catch (error) { console.warn('Cloud sync upload failed:', error); }
    };

    const scheduleUpload = () => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(uploadIfChanged, 1400);
    };

    const initFirebase = async () => {
      if (!isFirebaseConfigured()) {
        window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: { user: null, configured: false } }));
        return;
      }
      try {
        const services = await getFirebase();
        if (cancelled) return;
        servicesRef.current = services;
        unsubscribeAuth = services.auth.onAuthStateChanged(async (user) => {
          userRef.current = user || null;
          window.dispatchEvent(new CustomEvent(AUTH_EVENT, {
            detail: {
              configured: true,
              user: user ? { uid: user.uid, email: user.email, displayName: user.displayName || '' } : null,
            },
          }));
          if (!user) return;
          try { await syncFromCloud({ ...services, uid: user.uid, merge: true }); } catch (error) { console.warn('Cloud sync bootstrap failed:', error); }
        });
      } catch (error) {
        console.warn('Firebase init failed:', error);
        window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: { user: null, configured: true, error: error.message } }));
      }
    };

    const captureInstallPrompt = (event) => {
      event.preventDefault();
      window.__lingospaceInstallPrompt = event;
      window.dispatchEvent(new CustomEvent('lingospace:install-available'));
    };

    const handleOnline = () => {
      window.dispatchEvent(new CustomEvent('lingospace:connection', { detail: { online: true } }));
      scheduleUpload();
      maybeShowReviewReminder();
    };
    const handleOffline = () => window.dispatchEvent(new CustomEvent('lingospace:connection', { detail: { online: false } }));
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') uploadIfChanged();
      if (document.visibilityState === 'visible') maybeShowReviewReminder();
    };

    registerPwa().then(maybeShowReviewReminder);
    initFirebase();
    syncTimerRef.current = setInterval(uploadIfChanged, 45000);
    window.addEventListener(SYNC_EVENT, scheduleUpload);
    window.addEventListener('beforeinstallprompt', captureInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      clearInterval(syncTimerRef.current);
      clearTimeout(debounceRef.current);
      unsubscribeAuth?.();
      window.removeEventListener(SYNC_EVENT, scheduleUpload);
      window.removeEventListener('beforeinstallprompt', captureInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return null;
}

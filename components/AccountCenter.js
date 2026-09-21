'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Cloud,
  CloudOff,
  Download,
  HardDriveDownload,
  Install,
  KeyRound,
  LogIn,
  LogOut,
  RefreshCw,
  Save,
  ShieldCheck,
  Upload,
  UserPlus,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { firebaseVapidKey, getFirebase, isFirebaseConfigured } from '../lib/firebaseBrowser';
import {
  AUTH_EVENT,
  SYNC_STATUS_EVENT,
  applySnapshot,
  captureLocalSnapshot,
  markSyncDirty,
  syncFromCloud,
  syncToCloud,
} from '../lib/cloudSync';

const formatSyncTime = (value) => {
  if (!value) return 'Belum pernah';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Belum pernah';
  return date.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
};

const friendlyAuthError = (error) => {
  const code = String(error?.code || '');
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) return 'Email atau password tidak cocok.';
  if (code.includes('email-already-in-use')) return 'Email ini sudah terdaftar.';
  if (code.includes('weak-password')) return 'Password terlalu lemah. Gunakan minimal 6 karakter.';
  if (code.includes('invalid-email')) return 'Format email tidak valid.';
  if (code.includes('popup-closed')) return 'Login Google dibatalkan.';
  return error?.message || 'Terjadi kesalahan. Coba lagi.';
};

export default function AccountCenter() {
  const fileInputRef = useRef(null);
  const [configured] = useState(isFirebaseConfigured());
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [syncState, setSyncState] = useState('idle');
  const [lastSync, setLastSync] = useState('');
  const [online, setOnline] = useState(true);
  const [installAvailable, setInstallAvailable] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [reminderEnabled, setReminderEnabled] = useState(false);

  useEffect(() => {
    setOnline(navigator.onLine);
    setInstalled(window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true);
    setInstallAvailable(Boolean(window.__lingospaceInstallPrompt));
    setNotificationPermission('Notification' in window ? Notification.permission : 'unsupported');
    setReminderEnabled(localStorage.getItem('lingospace_review_reminder_enabled') === 'true');
    setLastSync(localStorage.getItem('lingospace_sync_last_success') || '');

    const onAuth = (event) => {
      setUser(event.detail?.user || null);
      setAuthReady(true);
      if (event.detail?.error) setMessage(event.detail.error);
    };
    const onSync = (event) => {
      setSyncState(event.detail?.state || 'idle');
      if (event.detail?.at) {
        setLastSync(event.detail.at);
        localStorage.setItem('lingospace_sync_last_success', event.detail.at);
      }
    };
    const onConnection = (event) => setOnline(Boolean(event.detail?.online));
    const onInstall = () => setInstallAvailable(true);
    window.addEventListener(AUTH_EVENT, onAuth);
    window.addEventListener(SYNC_STATUS_EVENT, onSync);
    window.addEventListener('lingospace:connection', onConnection);
    window.addEventListener('lingospace:install-available', onInstall);

    if (configured) {
      getFirebase().then(({ auth }) => {
        const current = auth.currentUser;
        if (current) setUser({ uid: current.uid, email: current.email, displayName: current.displayName || '' });
        setAuthReady(true);
      }).catch((error) => { setMessage(error.message); setAuthReady(true); });
    } else setAuthReady(true);

    return () => {
      window.removeEventListener(AUTH_EVENT, onAuth);
      window.removeEventListener(SYNC_STATUS_EVENT, onSync);
      window.removeEventListener('lingospace:connection', onConnection);
      window.removeEventListener('lingospace:install-available', onInstall);
    };
  }, [configured]);

  const syncLabel = useMemo(() => {
    if (!user) return 'Mode lokal';
    if (syncState === 'syncing') return 'Menyinkronkan...';
    if (!online) return 'Offline — akan sync saat online';
    return `Terakhir: ${formatSyncTime(lastSync)}`;
  }, [user, syncState, online, lastSync]);

  const withBusy = async (action) => {
    setBusy(true);
    setMessage('');
    try { await action(); } catch (error) { setMessage(friendlyAuthError(error)); }
    finally { setBusy(false); }
  };

  const handleEmailAuth = () => withBusy(async () => {
    const { auth } = await getFirebase();
    if (authMode === 'signup') {
      await auth.createUserWithEmailAndPassword(email.trim(), password);
      setMessage('Akun berhasil dibuat. Progres lokal akan digabung ke cloud.');
    } else {
      await auth.signInWithEmailAndPassword(email.trim(), password);
      setMessage('Login berhasil. Sinkronisasi dimulai.');
    }
  });

  const handleGoogle = () => withBusy(async () => {
    const { auth, firebase } = await getFirebase();
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await auth.signInWithPopup(provider);
    setMessage('Login Google berhasil.');
  });

  const handleResetPassword = () => withBusy(async () => {
    if (!email.trim()) throw new Error('Masukkan email terlebih dahulu.');
    const { auth } = await getFirebase();
    await auth.sendPasswordResetEmail(email.trim());
    setMessage('Link reset password sudah dikirim ke email.');
  });

  const handleLogout = () => withBusy(async () => {
    const { auth } = await getFirebase();
    await auth.signOut();
    setUser(null);
    setMessage('Logout berhasil. Data lokal di perangkat tetap tersimpan.');
  });

  const handleManualSync = () => withBusy(async () => {
    const services = await getFirebase();
    if (!services.auth.currentUser) throw new Error('Login terlebih dahulu.');
    await syncFromCloud({ ...services, uid: services.auth.currentUser.uid, merge: true });
    setLastSync(new Date().toISOString());
    setMessage('Cloud dan perangkat sudah digabung serta disinkronkan.');
  });

  const handleUploadCurrent = () => withBusy(async () => {
    const services = await getFirebase();
    if (!services.auth.currentUser) throw new Error('Login terlebih dahulu.');
    await syncToCloud({ ...services, uid: services.auth.currentUser.uid, snapshot: captureLocalSnapshot() });
    setLastSync(new Date().toISOString());
    setMessage('Backup perangkat berhasil dikirim ke cloud.');
  });

  const exportBackup = () => {
    const payload = {
      app: 'LingoSpace Pro',
      type: 'learning-backup',
      exportedAt: new Date().toISOString(),
      snapshot: captureLocalSnapshot(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `lingospace-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage('Backup JSON berhasil dibuat.');
  };

  const importBackup = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) return setMessage('File backup terlalu besar. Maksimal 3 MB.');
    await withBusy(async () => {
      const parsed = JSON.parse(await file.text());
      const snapshot = parsed?.snapshot || parsed;
      applySnapshot(snapshot, { merge: true });
      markSyncDirty('backup-import');
      setMessage('Backup berhasil digabung. Muat ulang aplikasi untuk memastikan semua tampilan diperbarui.');
    });
  };

  const installPwa = async () => {
    const prompt = window.__lingospaceInstallPrompt;
    if (!prompt) return setMessage('Prompt instalasi belum tersedia. Gunakan menu browser “Install app/Add to Home screen”.');
    await prompt.prompt();
    await prompt.userChoice?.catch?.(() => null);
    window.__lingospaceInstallPrompt = null;
    setInstallAvailable(false);
  };

  const enableReminder = async () => withBusy(async () => {
    if (!('Notification' in window)) throw new Error('Browser ini tidak mendukung notifikasi.');
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission !== 'granted') throw new Error('Izin notifikasi belum diberikan.');
    localStorage.setItem('lingospace_review_reminder_enabled', 'true');
    setReminderEnabled(true);

    const registration = window.__lingospaceServiceWorker || await navigator.serviceWorker?.ready;
    if (configured && firebaseVapidKey) {
      try {
        const { firebase, auth, db } = await getFirebase({ includeMessaging: true });
        const messaging = firebase.messaging();
        const token = await messaging.getToken({ vapidKey: firebaseVapidKey, serviceWorkerRegistration: registration });
        if (token && auth.currentUser) {
          const safeId = btoa(token).replace(/[+/=]/g, '_').slice(0, 900);
          await db.collection('users').doc(auth.currentUser.uid).collection('devices').doc(safeId).set({
            token,
            platform: navigator.platform || '',
            userAgent: navigator.userAgent,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          }, { merge: true });
        }
      } catch (error) {
        console.warn('FCM token setup skipped:', error);
      }
    }
    await registration?.showNotification?.('Reminder LingoSpace aktif', {
      body: 'LingoSpace akan mengingatkan saat ada review yang siap dikerjakan ketika aplikasi aktif/terhubung.',
      icon: '/android-chrome-192x192.png',
      tag: 'lingospace-reminder-enabled',
    });
    setMessage('Reminder review sudah diaktifkan.');
  });

  const disableReminder = () => {
    localStorage.setItem('lingospace_review_reminder_enabled', 'false');
    setReminderEnabled(false);
    setMessage('Reminder review dinonaktifkan di perangkat ini.');
  };

  return (
    <div className="account-page animate-fade-in">
      <section className="account-hero">
        <div>
          <span className="eyebrow-badge"><ShieldCheck size={14} /> Production & Sync Center</span>
          <h2 className="premium-page-title mt-3">Akun & Data</h2>
          <p className="premium-page-subtitle">Belajar tetap berjalan secara lokal. Login hanya diperlukan jika kamu ingin sinkronisasi progres antarperangkat.</p>
        </div>
        <div className={`connection-pill ${online ? 'online' : 'offline'}`}>
          {online ? <Wifi size={17} /> : <WifiOff size={17} />}
          {online ? 'Online' : 'Offline'}
        </div>
      </section>

      <div className="account-grid">
        <section className="premium-panel account-card">
          <div className="account-card-head">
            <div><p className="panel-kicker">AKUN CLOUD</p><h3 className="panel-title">{user ? 'Sinkronisasi aktif' : 'Login LingoSpace'}</h3></div>
            <span className="premium-round-icon">{user ? <Cloud size={20} /> : <CloudOff size={20} />}</span>
          </div>

          {!configured ? (
            <div className="account-empty-state">
              <CloudOff size={34} />
              <h4>Firebase belum dikonfigurasi</h4>
              <p>Mode lokal/offline tetap berfungsi. Isi environment Firebase untuk mengaktifkan login dan cloud sync.</p>
              <code>NEXT_PUBLIC_FIREBASE_PROJECT_ID</code>
            </div>
          ) : user ? (
            <div className="account-signed-in">
              <div className="account-avatar">{(user.email || 'U').slice(0, 1).toUpperCase()}</div>
              <div className="min-w-0">
                <p className="font-bold app-heading truncate">{user.displayName || user.email}</p>
                <p className="text-sm app-muted truncate">{user.email}</p>
              </div>
              <div className="sync-status-line"><CheckCircle2 size={16} /> {syncLabel}</div>
              <div className="account-actions">
                <button className="premium-button primary" onClick={handleManualSync} disabled={busy || !online}><RefreshCw size={17} /> Sync sekarang</button>
                <button className="premium-button secondary" onClick={handleUploadCurrent} disabled={busy || !online}><Save size={17} /> Backup ke cloud</button>
                <button className="premium-button ghost" onClick={handleLogout} disabled={busy}><LogOut size={17} /> Logout</button>
              </div>
            </div>
          ) : (
            <div className="auth-box">
              <div className="segmented-control account-auth-tabs">
                <button className={authMode === 'login' ? 'is-active' : ''} onClick={() => setAuthMode('login')}>Masuk</button>
                <button className={authMode === 'signup' ? 'is-active' : ''} onClick={() => setAuthMode('signup')}>Daftar</button>
              </div>
              <label className="account-field"><span>Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" autoComplete="email" /></label>
              <label className="account-field"><span>Password</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} /></label>
              <button className="premium-button primary w-full" disabled={busy || !authReady || !email.trim() || password.length < 6} onClick={handleEmailAuth}>{authMode === 'signup' ? <UserPlus size={17} /> : <LogIn size={17} />}{authMode === 'signup' ? 'Buat akun' : 'Masuk'}</button>
              <button className="premium-button secondary w-full" disabled={busy || !authReady} onClick={handleGoogle}><span className="google-g">G</span> Masuk dengan Google</button>
              <button className="account-text-button" disabled={busy || !email.trim()} onClick={handleResetPassword}><KeyRound size={14} /> Lupa password?</button>
            </div>
          )}
        </section>

        <section className="premium-panel account-card">
          <div className="account-card-head"><div><p className="panel-kicker">BACKUP LOKAL</p><h3 className="panel-title">Export & Restore</h3></div><span className="premium-round-icon"><HardDriveDownload size={20} /></span></div>
          <p className="app-muted text-sm">Backup mencakup SRS, aktivitas, Mistake Book, favorit, XP, progres lesson, target harian, dan preferensi tema.</p>
          <div className="account-actions vertical">
            <button className="premium-button secondary" onClick={exportBackup}><Download size={17} /> Download backup JSON</button>
            <button className="premium-button ghost" onClick={() => fileInputRef.current?.click()}><Upload size={17} /> Restore dari JSON</button>
            <input ref={fileInputRef} type="file" accept="application/json,.json" hidden onChange={importBackup} />
          </div>
          <div className="backup-note">Restore menggunakan strategi merge agar progres yang sudah ada tidak langsung dihapus.</div>
        </section>

        <section className="premium-panel account-card">
          <div className="account-card-head"><div><p className="panel-kicker">PWA</p><h3 className="panel-title">Install & Offline</h3></div><span className="premium-round-icon"><Install size={20} /></span></div>
          <p className="app-muted text-sm">Service worker menyimpan shell aplikasi, data vocabulary/lesson, dan aset yang sudah pernah digunakan agar pengalaman offline lebih baik.</p>
          <div className="production-status-list">
            <span><CheckCircle2 size={16} /> Service worker otomatis diregistrasikan</span>
            <span><CheckCircle2 size={16} /> Halaman offline fallback</span>
            <span><CheckCircle2 size={16} /> Cache vocabulary & lesson API</span>
          </div>
          {!installed && <button className="premium-button primary mt-4" onClick={installPwa}><Install size={17} /> {installAvailable ? 'Install LingoSpace' : 'Cara install aplikasi'}</button>}
          {installed && <div className="installed-badge"><CheckCircle2 size={16} /> Sudah berjalan sebagai aplikasi</div>}
        </section>

        <section className="premium-panel account-card">
          <div className="account-card-head"><div><p className="panel-kicker">REMINDER</p><h3 className="panel-title">Notifikasi Review</h3></div><span className="premium-round-icon"><Bell size={20} /></span></div>
          <p className="app-muted text-sm">Aktifkan pengingat lokal untuk review jatuh tempo. Jika Firebase Messaging/VAPID diisi, token perangkat juga disimpan ke akun untuk kesiapan push server.</p>
          <div className="notification-state">Izin browser: <strong>{notificationPermission}</strong></div>
          {reminderEnabled ? (
            <button className="premium-button ghost" onClick={disableReminder}><Bell size={17} /> Nonaktifkan reminder</button>
          ) : (
            <button className="premium-button primary" onClick={enableReminder} disabled={busy}><Bell size={17} /> Aktifkan reminder</button>
          )}
        </section>
      </div>

      {message && <div className="account-toast" role="status">{message}</div>}
    </div>
  );
}

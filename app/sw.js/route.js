const js = (value) => JSON.stringify(String(value || ''));

export const dynamic = 'force-dynamic';

export async function GET() {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  };

  const worker = `
const CACHE_VERSION = 'lingospace-v5-20260921';
const STATIC_CACHE = CACHE_VERSION + '-static';
const RUNTIME_CACHE = CACHE_VERSION + '-runtime';
const DATA_CACHE = CACHE_VERSION + '-data';
const CORE_ASSETS = ['/', '/offline.html', '/manifest.json', '/android-chrome-192x192.png', '/android-chrome-512x512.png', '/favicon.ico', '/logo.png'];
const DATA_PATHS = ['/api/vocabulary', '/api/categories', '/api/english-lessons', '/api/nahwu-lessons', '/api/roadmap'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => null));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('lingospace-') && ![STATIC_CACHE, RUNTIME_CACHE, DATA_CACHE].includes(key)).map((key) => caches.delete(key)))),
    self.clients.claim(),
  ]));
});

const staleWhileRevalidate = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request).then((response) => {
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);
  return cached || network || new Response(JSON.stringify({ error: 'offline' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
};

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(async (response) => {
      if (response && response.ok) {
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, response.clone());
      }
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match('/')) || caches.match('/offline.html')));
    return;
  }

  if (DATA_PATHS.some((path) => url.pathname === path)) {
    event.respondWith(staleWhileRevalidate(request, DATA_CACHE));
    return;
  }

  if (url.pathname.startsWith('/_next/static/') || /\\.(?:png|jpg|jpeg|webp|svg|ico|woff2?)$/i.test(url.pathname)) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then(async (response) => {
      if (response && response.ok) {
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, response.clone());
      }
      return response;
    })));
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = event.notification.data?.url || '/';
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
    const existing = clients.find((client) => 'focus' in client);
    if (existing) {
      existing.navigate?.(target);
      return existing.focus();
    }
    return self.clients.openWindow?.(target);
  }));
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'SHOW_NOTIFICATION') self.registration.showNotification(event.data.title || 'LingoSpace Pro', event.data.options || {});
});

const firebaseConfig = {
  apiKey: ${js(firebaseConfig.apiKey)},
  authDomain: ${js(firebaseConfig.authDomain)},
  projectId: ${js(firebaseConfig.projectId)},
  storageBucket: ${js(firebaseConfig.storageBucket)},
  messagingSenderId: ${js(firebaseConfig.messagingSenderId)},
  appId: ${js(firebaseConfig.appId)}
};

if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.messagingSenderId) {
  try {
    importScripts('https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js');
    importScripts('https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js');
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();
    messaging.onBackgroundMessage((payload) => {
      const notification = payload.notification || {};
      self.registration.showNotification(notification.title || 'LingoSpace Pro', {
        body: notification.body || 'Ada aktivitas belajar baru untukmu.',
        icon: notification.icon || '/android-chrome-192x192.png',
        badge: '/favicon-32x32.png',
        data: { url: payload.data?.url || '/' },
      });
    });
  } catch (error) {
    console.warn('Firebase messaging worker inactive:', error);
  }
}
`;

  return new Response(worker, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'Service-Worker-Allowed': '/',
    },
  });
}

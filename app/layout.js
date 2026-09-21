import { Inter } from 'next/font/google';
import './globals.css';
import BrowserCheck from '@/components/BrowserCheck';
import { getSiteUrl } from '@/lib/site';
const inter = Inter({ subsets: ['latin'] });
const siteUrl = getSiteUrl();

// ✅ HANYA 1 METADATA - GABUNGAN SEMUA
export const metadata = {
  metadataBase: siteUrl,
  title: 'LingoSpace Pro - Premium Language Learning Platform',
  description: 'Belajar bahasa Arab dan Inggris dengan metode SRS yang efektif',
  keywords: 'learn arabic, learn english, language learning, flashcard, quiz, kamus, kamus arab, kamus inggris',
  authors: [{ name: 'LingoSpace Pro' }],
  creator: 'LingoSpace Pro',
  applicationName: 'LingoSpace Pro',
  category: 'education',
  alternates: { canonical: '/' },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LingoSpace Pro',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: 'LingoSpace Pro',
    title: 'LingoSpace Pro - Learn Languages. Explore Worlds.',
    description: 'Premium Language Learning Platform for Arabic and English',
    images: [{ url: '/logo.png', width: 1254, height: 1254, alt: 'LingoSpace Pro' }],
  },
  twitter: {
    card: 'summary',
    title: 'LingoSpace Pro - Learn Languages. Explore Worlds.',
    description: 'Belajar bahasa Arab dan Inggris dengan SRS, speaking, quiz, listening, mini games, dan AI tutor.',
    images: ['/logo.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#8b5cf6',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}><BrowserCheck>{children}</BrowserCheck></body>
    </html>
  );
}

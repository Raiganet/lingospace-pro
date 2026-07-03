import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LingoSpace Pro - Premium Language Learning Platform',
  description: 'Belajar Bahasa Arab dan Inggris dengan metode modern dan efektif',
  keywords: 'belajar bahasa arab, belajar bahasa inggris, flashcard, quiz, vocabulary',
  authors: [{ name: 'LingoSpace Pro' }],
  openGraph: {
    title: 'LingoSpace Pro - Premium Language Learning Platform',
    description: 'Belajar Bahasa Arab dan Inggris dengan metode modern dan efektif',
    url: 'https://www.raiganet.my.id',
    siteName: 'LingoSpace Pro',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* Google AdSense */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7747788833891823"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
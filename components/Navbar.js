'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { markSyncDirty } from '../lib/cloudSync';
import {
  BarChart3,
  BookMarked,
  BookOpen,
  Brain,
  CalendarClock,
  AlertTriangle,
  ChevronRight,
  Gamepad2,
  GraduationCap,
  Headphones,
  Heart,
  Home,
  Languages,
  LayoutDashboard,
  Library,
  Map,
  Mic,
  Menu,
  Moon,
  MoreHorizontal,
  Search,
  Sparkles,
  Sun,
  X,
  UserRound,
} from 'lucide-react';

const navigationGroups = [
  {
    label: 'Utama',
    items: [
      { mode: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Ringkasan progres belajar' },
      { mode: 'review', label: 'Review Hari Ini', icon: CalendarClock, description: 'SRS kosakata yang jatuh tempo' },
      { mode: 'mistakes', label: 'Mistake Book', icon: AlertTriangle, description: 'Kata yang masih sering salah' },
      { mode: 'bookmarks', label: 'Favorit', icon: Heart, description: 'Kosakata yang disimpan' },
    ],
  },
  {
    label: 'Belajar',
    items: [
      { mode: 'flashcard', label: 'Flashcard', icon: BookOpen, description: 'Latihan kosakata cepat' },
      { mode: 'quiz', label: 'Quiz', icon: Brain, description: 'Uji pemahaman kosakata' },
      { mode: 'listen', label: 'Listening', icon: Headphones, description: 'Latihan pemahaman audio' },
      { mode: 'roadmap', label: 'Roadmap', icon: Map, description: 'Jalur belajar terarah' },
    ],
  },
  {
    label: 'Bahasa',
    items: [
      { mode: 'dictionary', label: 'Kamus', icon: Library, description: 'Kamus tematik 3 bahasa' },
      { mode: 'english', label: 'English', icon: GraduationCap, description: 'Materi Bahasa Inggris' },
      { mode: 'nahwu', label: 'Nahwu', icon: BookMarked, description: 'Dasar tata bahasa Arab' },
    ],
  },
  {
    label: 'Premium Learning',
    items: [
      { mode: 'speaking', label: 'Speaking', icon: Mic, description: 'Latihan pronunciation dengan mikrofon' },
      { mode: 'games', label: 'Mini Games', icon: Gamepad2, description: 'Match, susun kata & speed challenge' },
      { mode: 'analytics', label: 'Analytics', icon: BarChart3, description: 'XP, level & pola belajar' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { mode: 'smarttranslator', label: 'LingoSpace AI', icon: Sparkles, description: 'Translator & tutor bahasa' },
      { mode: 'prayers', label: 'Doa Harian', icon: Languages, description: 'Kumpulan doa sehari-hari' },
    ],
  },
  {
    label: 'Akun & Data',
    items: [
      { mode: 'account', label: 'Akun & Sinkronisasi', icon: UserRound, description: 'Cloud sync, backup, PWA & reminder' },
    ],
  },
];

const allItems = navigationGroups.flatMap((group) => group.items);

const mobilePrimary = [
  { mode: 'dashboard', label: 'Home', icon: Home },
  { mode: 'flashcard', label: 'Belajar', icon: BookOpen },
  { mode: 'dictionary', label: 'Kamus', icon: Library },
  { mode: 'smarttranslator', label: 'AI', icon: Sparkles },
];

export default function Navbar({ activeMode = 'dashboard', onModeChange }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('lingospace_theme');
    const systemLight = window.matchMedia?.('(prefers-color-scheme: light)').matches;
    const nextTheme = savedTheme === 'light' || savedTheme === 'dark'
      ? savedTheme
      : systemLight ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  const activeItem = useMemo(
    () => allItems.find((item) => item.mode === activeMode) || allItems[0],
    [activeMode]
  );

  const selectMode = (mode) => {
    onModeChange?.(mode);
    setMoreOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('lingospace_theme', nextTheme);
    markSyncDirty('theme');
  };

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        selectMode('dictionary');
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  });

  return (
    <>
      <aside className="app-sidebar hidden lg:flex">
        <button type="button" onClick={() => selectMode('dashboard')} className="brand-lockup" aria-label="Buka Dashboard">
          <span className="brand-logo-wrap">
            {/* Small local brand asset sized via CSS; next/image adds no value here. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="LingoSpace Pro" className="brand-logo" />
          </span>
          <span className="min-w-0 text-left">
            <span className="block font-extrabold tracking-tight app-heading">LingoSpace Pro</span>
            <span className="block text-xs app-muted">Learn • Practice • Master</span>
          </span>
        </button>

        <nav className="sidebar-scroll" aria-label="Navigasi utama">
          {navigationGroups.map((group) => (
            <div key={group.label} className="sidebar-group">
              <p className="sidebar-label">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = activeMode === item.mode;
                  return (
                    <button
                      key={item.mode}
                      type="button"
                      onClick={() => selectMode(item.mode)}
                      className={`sidebar-item ${active ? 'is-active' : ''}`}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span className="sidebar-icon"><Icon size={18} strokeWidth={2} /></span>
                      <span className="min-w-0 flex-1 text-left">
                        <span className="block text-sm font-semibold">{item.label}</span>
                        <span className="block text-[11px] app-muted truncate">{item.description}</span>
                      </span>
                      {active && <ChevronRight size={16} className="sidebar-arrow" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link href="/blog" className="sidebar-secondary-link">
            <BookOpen size={17} />
            <span>Blog Belajar</span>
          </Link>
          <button type="button" onClick={toggleTheme} className="sidebar-secondary-link w-full">
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>

      <header className="app-topbar">
        <div className="flex items-center gap-3 min-w-0">
          <button type="button" onClick={() => setMoreOpen(true)} className="icon-button lg:hidden" aria-label="Buka menu">
            <Menu size={21} />
          </button>
          <button type="button" onClick={() => selectMode('dashboard')} className="brand-logo-mobile lg:hidden" aria-label="Dashboard">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" />
          </button>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.18em] font-semibold app-muted hidden sm:block">LingoSpace Workspace</p>
            <h1 className="text-base sm:text-lg font-bold app-heading truncate">{activeItem.label}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button type="button" onClick={() => selectMode('dictionary')} className="top-search-button hidden sm:flex">
            <Search size={17} />
            <span>Cari kosakata</span>
            <kbd>Ctrl K</kbd>
          </button>
          <button type="button" onClick={() => selectMode('account')} className={`icon-button ${activeMode === 'account' ? 'is-active' : ''}`} aria-label="Akun dan sinkronisasi">
            <UserRound size={19} />
          </button>
          <button type="button" onClick={toggleTheme} className="icon-button" aria-label="Ganti tema">
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
      </header>

      <nav className="mobile-bottom-nav lg:hidden" aria-label="Navigasi mobile">
        {mobilePrimary.map((item) => {
          const Icon = item.icon;
          const active = activeMode === item.mode || (item.mode === 'flashcard' && ['quiz', 'listen', 'review', 'mistakes', 'roadmap'].includes(activeMode));
          return (
            <button
              type="button"
              key={item.mode}
              onClick={() => selectMode(item.mode)}
              className={`mobile-nav-item ${active ? 'is-active' : ''}`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button type="button" onClick={() => setMoreOpen(true)} className={`mobile-nav-item ${moreOpen ? 'is-active' : ''}`}>
          <MoreHorizontal size={20} />
          <span>Lainnya</span>
        </button>
      </nav>

      {moreOpen && (
        <div className="mobile-sheet-backdrop lg:hidden" onMouseDown={() => setMoreOpen(false)}>
          <div className="mobile-sheet" onMouseDown={(event) => event.stopPropagation()}>
            <div className="mobile-sheet-handle" />
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] app-muted">Semua Fitur</p>
                <h2 className="text-xl font-bold app-heading mt-1">Pilih ruang belajar</h2>
              </div>
              <button type="button" className="icon-button" onClick={() => setMoreOpen(false)} aria-label="Tutup menu">
                <X size={20} />
              </button>
            </div>

            <div className="mobile-sheet-grid">
              {allItems.map((item) => {
                const Icon = item.icon;
                const active = activeMode === item.mode;
                return (
                  <button
                    type="button"
                    key={item.mode}
                    onClick={() => selectMode(item.mode)}
                    className={`mobile-feature-card ${active ? 'is-active' : ''}`}
                  >
                    <span className="mobile-feature-icon"><Icon size={20} /></span>
                    <span className="text-left min-w-0">
                      <span className="block text-sm font-bold app-heading">{item.label}</span>
                      <span className="block text-[11px] app-muted mt-0.5 line-clamp-2">{item.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <Link href="/blog" className="mobile-blog-link" onClick={() => setMoreOpen(false)}>
              <BookOpen size={18} />
              <span className="font-semibold">Buka Blog Belajar</span>
              <ChevronRight size={17} className="ml-auto" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

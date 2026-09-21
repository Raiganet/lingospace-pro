"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductionBridge from '../components/ProductionBridge';

const LingoSpacePro = dynamic(() => import('../components/LingoSpacePro'), {
  ssr: false,
  loading: () => <PageLoader label="Menyiapkan ruang belajar..." />,
});

const SmartTranslator = dynamic(() => import('../components/SmartTranslator'), {
  ssr: false,
  loading: () => <PageLoader label="Menyiapkan LingoSpace AI..." />,
});

const Dictionary = dynamic(() => import('../components/Dictionary'), {
  ssr: false,
  loading: () => <PageLoader label="Memuat kamus..." />,
});

const DailyPrayers = dynamic(() => import('../components/DailyPrayers'), {
  ssr: false,
  loading: () => <PageLoader label="Memuat doa harian..." />,
});

const PremiumLearningCenter = dynamic(() => import('../components/PremiumLearningCenter'), {
  ssr: false,
  loading: () => <PageLoader label="Menyiapkan Premium Learning..." />,
});

const AccountCenter = dynamic(() => import('../components/AccountCenter'), {
  ssr: false,
  loading: () => <PageLoader label="Menyiapkan akun & data..." />,
});

function PageLoader({ label }) {
  return (
    <div className="app-loader">
      <div className="app-loader-ring" />
      <p className="font-semibold app-heading">{label}</p>
    </div>
  );
}

const VALID_MODES = new Set(['dashboard','flashcard','quiz','listen','review','mistakes','bookmarks','roadmap','nahwu','english','speaking','games','analytics','smarttranslator','dictionary','prayers','account']);

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    setMounted(true);
    const requestedMode = new URLSearchParams(window.location.search).get('mode');
    const savedMode = localStorage.getItem('lingospace_active_mode');
    if (requestedMode && VALID_MODES.has(requestedMode)) setActiveTab(requestedMode);
    else if (savedMode && VALID_MODES.has(savedMode)) setActiveTab(savedMode);

    const handleModeChange = (event) => {
      if (!event.detail || !VALID_MODES.has(event.detail)) return;
      setActiveTab(event.detail);
      localStorage.setItem('lingospace_active_mode', event.detail);
    };
    window.addEventListener('changeMode', handleModeChange);
    return () => window.removeEventListener('changeMode', handleModeChange);
  }, []);

  const changeMode = (mode) => {
    if (!VALID_MODES.has(mode)) return;
    setActiveTab(mode);
    localStorage.setItem('lingospace_active_mode', mode);
  };

  if (!mounted) return null;

  const separateComponents = {
    smarttranslator: <SmartTranslator />,
    dictionary: <Dictionary />,
    prayers: <DailyPrayers />,
    speaking: <PremiumLearningCenter view="speaking" />,
    games: <PremiumLearningCenter view="games" />,
    analytics: <PremiumLearningCenter view="analytics" />,
    account: <AccountCenter />,
  };

  const lingoSpaceModes = [
    'dashboard', 'flashcard', 'quiz', 'listen', 'review', 'mistakes',
    'bookmarks', 'roadmap', 'nahwu', 'english'
  ];

  return (
    <div className="app-root">
      <ProductionBridge />
      <Navbar activeMode={activeTab} onModeChange={changeMode} />

      <div className="app-content-column">
        <main className="app-main safe-area-bottom">
          {separateComponents[activeTab]}
          {lingoSpaceModes.includes(activeTab) && (
            <LingoSpaceProWrapper mode={activeTab} />
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}

function LingoSpaceProWrapper({ mode }) {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('changeMode', { detail: mode }));
  }, [mode]);

  return <LingoSpacePro />;
}

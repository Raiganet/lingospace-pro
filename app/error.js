'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error('LingoSpace route error:', error);
  }, [error]);

  return (
    <main className="release-state-page">
      <div className="release-state-card">
        <div className="release-state-code">!</div>
        <h1>Terjadi kendala</h1>
        <p>Data lokal Anda tetap tersimpan. Coba muat ulang bagian ini atau kembali ke halaman utama.</p>
        <div className="release-state-actions">
          <button className="release-state-button" type="button" onClick={() => reset()}>Coba lagi</button>
          <Link className="release-state-button secondary" href="/">Ke Dashboard</Link>
        </div>
      </div>
    </main>
  );
}

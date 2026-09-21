'use client';

import './globals.css';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('LingoSpace global error:', error);
  }, [error]);

  return (
    <html lang="id">
      <body>
        <main className="release-state-page">
          <div className="release-state-card">
            <div className="release-state-code">!</div>
            <h1>Aplikasi perlu dimuat ulang</h1>
            <p>Progres yang tersimpan di perangkat tidak dihapus. Silakan coba kembali.</p>
            <button className="release-state-button" type="button" onClick={() => reset()}>Muat ulang aplikasi</button>
          </div>
        </main>
      </body>
    </html>
  );
}

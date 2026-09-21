export default function Loading() {
  return (
    <main className="release-state-page" aria-live="polite" aria-busy="true">
      <div className="release-state-card">
        <div className="app-loader-ring" aria-hidden="true" />
        <h1>Menyiapkan LingoSpace Pro</h1>
        <p>Memuat ruang belajar dan progres terakhir Anda…</p>
      </div>
    </main>
  );
}

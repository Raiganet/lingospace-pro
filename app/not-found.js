import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="release-state-page">
      <div className="release-state-card">
        <div className="release-state-code">404</div>
        <h1>Halaman tidak ditemukan</h1>
        <p>Alamat yang dibuka tidak tersedia atau sudah berubah.</p>
        <Link className="release-state-button" href="/">Kembali ke LingoSpace</Link>
      </div>
    </main>
  );
}

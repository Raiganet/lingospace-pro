import Link from 'next/link';

const UPDATED = '21 September 2026';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8"><Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm font-semibold border border-white/10 hover:border-purple-500/50">← Kembali ke Beranda</Link></div>
        <h1 className="text-4xl font-bold mb-3 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Syarat & Ketentuan</h1>
        <p className="text-center text-gray-400 mb-8">Terakhir diperbarui: {UPDATED}</p>

        <div className="glass rounded-2xl p-8 space-y-7 border border-white/10 text-gray-300 leading-relaxed">
          <section><h2 className="text-2xl font-bold mb-3 text-purple-300">1. Penggunaan layanan</h2><p>Dengan menggunakan LingoSpace Pro, Anda setuju menggunakan layanan secara wajar dan tidak untuk aktivitas ilegal, penyalahgunaan sistem, akses tanpa izin, atau tindakan yang mengganggu pengguna lain.</p></section>
          <section><h2 className="text-2xl font-bold mb-3 text-purple-300">2. Fitur pembelajaran</h2><p>Layanan menyediakan kosakata, flashcard, SRS, quiz, listening, speaking, materi English/Nahwu, mini games, analytics belajar, AI tutor, dan fitur lain yang dapat berubah seiring pengembangan.</p></section>
          <section><h2 className="text-2xl font-bold mb-3 text-purple-300">3. Akun dan data</h2><p>Anda bertanggung jawab menjaga keamanan akun dan perangkat. Mode lokal dapat digunakan tanpa akun. Jika login digunakan, sinkronisasi cloud bergantung pada konfigurasi Firebase dan koneksi internet.</p></section>
          <section><h2 className="text-2xl font-bold mb-3 text-purple-300">4. AI dan akurasi</h2><p>Jawaban AI, terjemahan, pronunciation scoring, serta materi belajar dapat mengandung kesalahan. Gunakan hasil tersebut sebagai alat bantu belajar dan lakukan verifikasi untuk penggunaan yang membutuhkan ketepatan tinggi.</p></section>
          <section><h2 className="text-2xl font-bold mb-3 text-purple-300">5. Ketersediaan layanan</h2><p>Fitur online seperti AI, cloud sync, login pihak ketiga, dan push notification dapat terganggu karena koneksi, batas layanan, konfigurasi deployment, atau perubahan penyedia eksternal. Sebagian fitur lokal tetap dapat bekerja melalui cache/offline mode.</p></section>
          <section><h2 className="text-2xl font-bold mb-3 text-purple-300">6. Konten dan kekayaan intelektual</h2><p>Konten, desain, kode, logo, serta materi yang dimiliki LingoSpace Pro tidak boleh didistribusikan ulang sebagai produk lain tanpa izin yang sesuai. Hak pihak ketiga tetap menjadi milik pemiliknya masing-masing.</p></section>
          <section><h2 className="text-2xl font-bold mb-3 text-purple-300">7. Backup pengguna</h2><p>Fitur backup JSON disediakan untuk membantu memindahkan atau memulihkan progres. Anda bertanggung jawab menyimpan file backup dengan aman. Restore menggunakan strategi merge dan dapat mengubah progres lokal.</p></section>
          <section><h2 className="text-2xl font-bold mb-3 text-purple-300">8. Pembatasan tanggung jawab</h2><p>Layanan diberikan untuk tujuan pembelajaran. Dalam batas yang diizinkan hukum, operator tidak menjamin hasil belajar tertentu, uptime tanpa gangguan, atau akurasi mutlak dari konten/AI.</p></section>
          <section><h2 className="text-2xl font-bold mb-3 text-purple-300">9. Perubahan</h2><p>Fitur dan ketentuan dapat diperbarui. Perubahan material sebaiknya tercermin pada tanggal pembaruan halaman ini.</p></section>
          <section><h2 className="text-2xl font-bold mb-3 text-purple-300">10. Kontak</h2><p>Untuk pertanyaan mengenai layanan, gunakan halaman <Link href="/contact" className="text-purple-400 hover:underline">Kontak</Link>.</p></section>
        </div>
      </div>
    </div>
  );
}

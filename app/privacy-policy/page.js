import Link from 'next/link';

const UPDATED = '21 September 2026';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8"><Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm font-semibold border border-white/10 hover:border-purple-500/50">← Kembali ke Beranda</Link></div>
        <h1 className="text-4xl font-bold mb-3 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Kebijakan Privasi</h1>
        <p className="text-center text-gray-400 mb-8">Terakhir diperbarui: {UPDATED}</p>

        <div className="glass rounded-2xl p-8 space-y-7 border border-white/10 text-gray-300 leading-relaxed">
          <section><h2 className="text-2xl font-bold mb-3 text-purple-300">1. Data yang diproses</h2><p>LingoSpace Pro dapat menyimpan progres belajar, bookmark, SRS, Mistake Book, XP, penyelesaian lesson, target harian, preferensi tema, dan pengaturan reminder. Dalam mode tamu, data ini terutama disimpan di browser/perangkat. Jika Anda login dan mengaktifkan sinkronisasi, progres dapat disimpan ke Firebase Cloud Firestore pada ruang akun Anda.</p></section>
          <section><h2 className="text-2xl font-bold mb-3 text-purple-300">2. Akun</h2><p>Login dapat menggunakan email/password atau penyedia login yang tersedia melalui Firebase Authentication. Kredensial autentikasi dikelola oleh Firebase; aplikasi tidak menyimpan password Anda di localStorage atau Firestore.</p></section>
          <section><h2 className="text-2xl font-bold mb-3 text-purple-300">3. AI dan terjemahan</h2><p>Ketika Anda menggunakan LingoSpace AI atau fitur terjemahan online, teks yang Anda kirim dapat diteruskan ke penyedia AI/terjemahan yang dikonfigurasi oleh operator aplikasi, seperti Google Gemini atau endpoint penerjemah yang disiapkan server. Jangan masukkan password, API key, data keuangan, atau informasi rahasia.</p></section>
          <section><h2 className="text-2xl font-bold mb-3 text-purple-300">4. Mikrofon dan speech recognition</h2><p>Speaking Practice hanya meminta akses mikrofon setelah tindakan pengguna. Pengenalan suara bergantung pada kemampuan browser/perangkat dan dapat melibatkan layanan speech recognition yang disediakan browser. LingoSpace Pro tidak menyimpan rekaman audio mentah ke cloud melalui kode aplikasi ini.</p></section>
          <section><h2 className="text-2xl font-bold mb-3 text-purple-300">5. Notifikasi dan PWA</h2><p>Jika Anda mengaktifkan reminder, browser akan meminta izin notifikasi. Token push Firebase Messaging dapat disimpan ke ruang akun untuk kebutuhan pengiriman notifikasi. Service worker juga menggunakan cache lokal agar bagian aplikasi dapat tetap bekerja saat koneksi terbatas.</p></section>
          <section><h2 className="text-2xl font-bold mb-3 text-purple-300">6. Backup dan penghapusan data lokal</h2><p>Anda dapat mengekspor backup JSON dari menu Akun & Data. Data lokal dapat dihapus melalui pengaturan browser/site data. Menghapus data lokal tidak otomatis menghapus salinan cloud yang sebelumnya tersinkronisasi.</p></section>
          <section><h2 className="text-2xl font-bold mb-3 text-purple-300">7. Keamanan</h2><p>Firestore Rules membatasi dokumen pengguna berdasarkan UID autentikasi. Endpoint AI menerapkan validasi origin, batas ukuran request, dan rate limit dasar. Tidak ada sistem yang dapat menjamin keamanan absolut; jaga keamanan akun dan perangkat Anda.</p></section>
          <section><h2 className="text-2xl font-bold mb-3 text-purple-300">8. Pihak ketiga</h2><p>Layanan dapat bergantung pada Firebase, Google Gemini, browser speech recognition, Vercel, atau penyedia lain yang dikonfigurasi saat deployment. Pemrosesan pada layanan tersebut juga tunduk pada kebijakan masing-masing penyedia.</p></section>
          <section><h2 className="text-2xl font-bold mb-3 text-purple-300">9. Perubahan kebijakan</h2><p>Kebijakan ini dapat diperbarui ketika fitur atau cara pemrosesan data berubah. Tanggal pembaruan akan ditampilkan pada halaman ini.</p></section>
          <section><h2 className="text-2xl font-bold mb-3 text-purple-300">10. Kontak</h2><p>Untuk pertanyaan privasi, gunakan halaman <Link href="/contact" className="text-purple-400 hover:underline">Kontak</Link>.</p></section>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function Artikel11() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/blog" className="text-purple-400 hover:underline mb-6 inline-block">← Kembali ke Blog</Link>
        <article className="glass rounded-2xl p-8 md:p-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-semibold">Bahasa Inggris</span>
              <span className="text-gray-400 text-sm">6 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Perbedaan Bahasa Inggris British dan American: Mana yang Harus Dipelajari?</h1>
            <p className="text-gray-300 text-lg">Memahami perbedaan ejaan, kosakata, dan pelafalan antara UK dan US English.</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p>Bahasa Inggris adalah bahasa global, namun tahukah Anda bahwa ada dua varian utama yang paling sering digunakan di dunia? <strong>British English (UK)</strong> dan <strong>American English (US)</strong>. Meskipun keduanya saling mengerti, terdapat perbedaan signifikan dalam ejaan, kosakata, dan tata bahasa.</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">1. Perbedaan Ejaan (Spelling)</h2>
            <p>Perbedaan paling mencolok ada pada cara menulis kata-kata tertentu:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>-our vs -or:</strong> Colour (UK) vs Color (US)</li>
              <li><strong>-re vs -er:</strong> Centre (UK) vs Center (US)</li>
              <li><strong>-ise vs -ize:</strong> Organise (UK) vs Organize (US)</li>
              <li><strong>-ence vs -ense:</strong> Defence (UK) vs Defense (US)</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">2. Perbedaan Kosakata (Vocabulary)</h2>
            <p>Banyak benda sehari-hari yang disebut dengan nama berbeda:</p>
            <div className="bg-white/5 rounded-lg p-4 my-4">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <li>• <strong>Lift</strong> (UK) = <strong>Elevator</strong> (US)</li>
                <li>• <strong>Flat</strong> (UK) = <strong>Apartment</strong> (US)</li>
                <li>• <strong>Biscuit</strong> (UK) = <strong>Cookie</strong> (US)</li>
                <li>• <strong>Trainers</strong> (UK) = <strong>Sneakers</strong> (US)</li>
                <li>• <strong>Lorry</strong> (UK) = <strong>Truck</strong> (US)</li>
                <li>• <strong>Petrol</strong> (UK) = <strong>Gas</strong> (US)</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">3. Perbedaan Tata Bahasa (Grammar)</h2>
            <p>Meski aturannya sama, ada beberapa pengecualian:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Present Perfect vs Simple Past:</strong> British sering menggunakan Present Perfect untuk kejadian baru saja terjadi ("I have just eaten"), sedangkan American lebih sering pakai Simple Past ("I just ate").</li>
              <li><strong>Got vs Gotten:</strong> British menggunakan "got" sebagai past participle, American menggunakan "gotten".</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Mana yang Harus Dipelajari?</h2>
            <p>Jawabannya tergantung tujuan Anda:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Pilih <strong>American English</strong> jika Anda ingin bekerja di perusahaan multinasional, menonton film Hollywood, atau berkuliah di AS.</li>
              <li>Pilih <strong>British English</strong> jika Anda berencana ke Eropa, Australia, atau mengikuti ujian IELTS.</li>
            </ul>
            <p>Kabar baiknya, di LingoSpace Pro kami mengajarkan kosakata yang umum digunakan di kedua varian agar Anda siap menghadapi situasi apapun!</p>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-3 text-purple-300">🌍 Kuasai Kosakata Global!</h3>
              <p className="mb-4">Pelajari ribuan kosakata bahasa Inggris yang relevan untuk berbagai situasi di LingoSpace Pro.</p>
              <Link href="/" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform">Mulai Belajar</Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
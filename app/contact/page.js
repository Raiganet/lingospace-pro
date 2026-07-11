'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Di sini nanti bisa ditambahkan logic untuk kirim email
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* ✅ TOMBOL KEMBALI SAMA PERSIS DENGAN BLOG */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm font-semibold hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 border border-white/10 hover:border-purple-500/50 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
            Kembali ke Beranda
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-lg">
            📧
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Hubungi Kami
          </h1>
          <p className="text-xl text-gray-300">
            Kami siap membantu Anda! Jangan ragu untuk menghubungi kami.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="glass-modern rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold mb-6 text-purple-300">📞 Informasi Kontak</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl flex-shrink-0">
                    📧
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Email</h3>
                    <a href="mailto:diky.hermansyah91@gmail.com" className="text-purple-400 hover:underline">
                      diky.hermansyah91@gmail.com
                    </a>
                    <p className="text-sm text-gray-400 mt-1">Kami akan membalas dalam 1-2 hari kerja</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl flex-shrink-0">
                    🌐
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Website</h3>
                    <a href="https://www.raiganet.my.id" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                      www.raiganet.my.id
                    </a>
                    <p className="text-sm text-gray-400 mt-1">Kunjungi website utama kami</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl flex-shrink-0">
                    ⏰
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Jam Operasional</h3>
                    <p className="text-gray-300">Senin - Jumat: 08:00 - 17:00 WIB</p>
                    <p className="text-gray-300">Sabtu: 09:00 - 15:00 WIB</p>
                    <p className="text-sm text-gray-400 mt-1">Minggu & Hari Libur Nasional</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl flex-shrink-0">
                    📍
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Lokasi</h3>
                    <p className="text-gray-300">Indonesia</p>
                    <p className="text-sm text-gray-400 mt-1">Platform pembelajaran online</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="glass-modern rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold mb-6 text-purple-300">📱 Media Sosial</h2>
              <p className="text-gray-300 mb-6">Ikuti kami di media sosial untuk update terbaru:</p>
              
              <div className="flex gap-4 flex-wrap">
                <a href="#" className="flex items-center gap-2 px-6 py-3 rounded-full glass-modern hover:bg-white/10 transition-all border border-white/10">
                  <span className="text-2xl">📘</span>
                  <span>Facebook</span>
                </a>
                <a href="#" className="flex items-center gap-2 px-6 py-3 rounded-full glass-modern hover:bg-white/10 transition-all border border-white/10">
                  <span className="text-2xl">📸</span>
                  <span>Instagram</span>
                </a>
                <a href="#" className="flex items-center gap-2 px-6 py-3 rounded-full glass-modern hover:bg-white/10 transition-all border border-white/10">
                  <span className="text-2xl">🐦</span>
                  <span>Twitter</span>
                </a>
                <a href="#" className="flex items-center gap-2 px-6 py-3 rounded-full glass-modern hover:bg-white/10 transition-all border border-white/10">
                  <span className="text-2xl">▶️</span>
                  <span>YouTube</span>
                </a>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="glass-modern rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">❓ Pertanyaan Umum?</h2>
              <p className="text-gray-300 mb-4">
                Mungkin jawaban yang Anda cari sudah tersedia di halaman FAQ kami.
              </p>
              <Link 
                href="/blog" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform"
              >
                📚 Kunjungi Blog & FAQ
              </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-modern rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-6 text-purple-300">✉️ Kirim Pesan</h2>
            <p className="text-gray-300 mb-6">
              Isi form di bawah ini dan kami akan menghubungi Anda secepatnya.
            </p>

            {submitted ? (
              <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold mb-2 text-green-400">Pesan Terkirim!</h3>
                <p className="text-gray-300">
                  Terima kasih telah menghubungi kami. Kami akan membalas pesan Anda secepatnya.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nama Lengkap <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl glass-modern bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    placeholder="Masukkan nama Anda"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl glass-modern bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    placeholder="nama@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subjek <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl glass-modern bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  >
                    <option value="">Pilih Subjek</option>
                    <option value="general">Pertanyaan Umum</option>
                    <option value="support">Dukungan Teknis</option>
                    <option value="feedback">Masukan & Saran</option>
                    <option value="collaboration">Kerjasama</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pesan <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl glass-modern bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                    placeholder="Tuliskan pesan Anda di sini..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-lg hover:scale-105 transition-transform shadow-lg shadow-purple-500/30"
                >
                  📨 Kirim Pesan
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="glass-modern rounded-2xl p-8 text-center border border-white/10">
          <h2 className="text-2xl font-bold mb-4 text-purple-300">💬 Mari Berdiskusi</h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Apakah Anda memiliki pertanyaan tentang fitur LingoSpace Pro, cara penggunaan, atau ingin berkolaborasi? 
            Tim kami siap membantu Anda. Jangan ragu untuk menghubungi kami melalui form di atas atau langsung 
            ke email kami. Kami berkomitmen untuk memberikan respons terbaik dalam waktu 1-2 hari kerja.
          </p>
        </div>

        {/* ✅ FOOTER SAMA PERSIS DENGAN HALAMAN BLOG & ABOUT */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Tentang Kami */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-purple-300">Tentang</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-purple-300">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Syarat & Ketentuan
                  </Link>
                </li>
              </ul>
            </div>

            {/* Info */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-purple-300">Info</h3>
              <p className="text-gray-400 text-sm">
                LingoSpace Pro adalah platform pembelajaran bahasa premium untuk Bahasa Arab dan Inggris.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                diky.hermansyah91@gmail.com
              </p>
            </div>
          </div>

          <div className="text-center pt-6 border-t border-white/10">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} LingoSpace Pro. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

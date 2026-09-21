'use client';

import Link from 'next/link';
import { useState } from 'react';

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'admin@kastriva.web.id';
const MAIN_WEBSITE = process.env.NEXT_PUBLIC_MAIN_WEBSITE || 'https://www.kastriva.web.id/';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = `[LingoSpace Pro] ${formData.subject}`;
    const body = [
      `Nama: ${formData.name}`,
      `Email pengirim: ${formData.email}`,
      '',
      formData.message,
    ].join('\n');
    setStatus('Aplikasi email akan dibuka. Pesan baru terkirim setelah Anda menekan tombol Kirim di aplikasi email.');
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm font-semibold hover:scale-105 transition-all duration-300 border border-white/10 hover:border-purple-500/50 group">
            <span className="transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
            Kembali ke Beranda
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-lg">✉️</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Hubungi Kami</h1>
          <p className="text-xl text-gray-300">Pertanyaan, masukan, atau laporan masalah LingoSpace Pro.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <section className="glass-modern rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold mb-6 text-purple-300">Informasi Kontak</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold mb-1">Email</h3>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-purple-400 hover:underline break-all">{CONTACT_EMAIL}</a>
                  <p className="text-sm text-gray-400 mt-1">Kanal utama untuk bantuan dan laporan.</p>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Website</h3>
                  <a href={MAIN_WEBSITE} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">{MAIN_WEBSITE.replace(/^https?:\/\//, '')}</a>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Layanan</h3>
                  <p className="text-gray-300">Platform pembelajaran online — Indonesia</p>
                </div>
              </div>
            </section>

            <section className="glass-modern rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">Sebelum mengirim</h2>
              <p className="text-gray-300 leading-relaxed">Untuk laporan bug, sertakan perangkat/browser, langkah sebelum error terjadi, dan screenshot jika tersedia. Jangan mengirim password, API key, atau informasi rahasia.</p>
            </section>
          </div>

          <section className="glass-modern rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-3 text-purple-300">Siapkan Email</h2>
            <p className="text-gray-300 mb-6">Form ini tidak berpura-pura mengirim pesan dari server. Setelah tombol ditekan, aplikasi email perangkat akan terbuka dengan isi pesan yang sudah disiapkan.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block text-sm font-medium">Nama Lengkap <span className="text-red-400">*</span>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required maxLength={80} className="mt-2 w-full px-4 py-3 rounded-xl glass-modern bg-white/5 border border-white/10 focus:border-purple-500 outline-none" placeholder="Nama Anda" />
              </label>
              <label className="block text-sm font-medium">Email <span className="text-red-400">*</span>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required maxLength={160} className="mt-2 w-full px-4 py-3 rounded-xl glass-modern bg-white/5 border border-white/10 focus:border-purple-500 outline-none" placeholder="nama@email.com" />
              </label>
              <label className="block text-sm font-medium">Subjek <span className="text-red-400">*</span>
                <select name="subject" value={formData.subject} onChange={handleChange} required className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 focus:border-purple-500 outline-none">
                  <option value="">Pilih subjek</option>
                  <option value="Bantuan akun & sinkronisasi">Bantuan akun & sinkronisasi</option>
                  <option value="Laporan bug">Laporan bug</option>
                  <option value="Masukan fitur">Masukan fitur</option>
                  <option value="Konten pembelajaran">Konten pembelajaran</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </label>
              <label className="block text-sm font-medium">Pesan <span className="text-red-400">*</span>
                <textarea name="message" value={formData.message} onChange={handleChange} required minLength={10} maxLength={3000} rows={7} className="mt-2 w-full px-4 py-3 rounded-xl glass-modern bg-white/5 border border-white/10 focus:border-purple-500 outline-none resize-y" placeholder="Tuliskan pesan Anda…" />
              </label>
              <button type="submit" className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-bold hover:scale-[1.01] transition-transform">Buka Aplikasi Email</button>
              {status && <p role="status" className="text-sm text-purple-200 bg-purple-500/10 border border-purple-400/20 rounded-xl p-3">{status}</p>}
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Di sini nanti bisa ditambahkan integrasi dengan email service
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Hubungi Kami</h1>
          <p className="text-xl text-gray-300">Kami siap membantu Anda!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-purple-300">Informasi Kontak</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">📧</div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-300">contact@raiganet.my.id</p>
                    <p className="text-sm text-gray-400">Kami akan membalas dalam 1-2 hari kerja</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-2xl">🌐</div>
                  <div>
                    <h3 className="font-semibold mb-1">Website</h3>
                    <p className="text-gray-300">www.raiganet.my.id</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-2xl">⏰</div>
                  <div>
                    <h3 className="font-semibold mb-1">Jam Operasional</h3>
                    <p className="text-gray-300">Senin - Jumat: 09.00 - 17.00 WIB</p>
                    <p className="text-gray-300">Sabtu - Minggu: Online 24/7</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">FAQ</h2>
              <p className="text-gray-300 mb-4">
                Punya pertanyaan? Cek halaman FAQ kami untuk jawaban cepat.
              </p>
              <button className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform">
                Lihat FAQ
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-purple-300">Kirim Pesan</h2>
            
            {submitted ? (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-xl font-bold mb-2">Pesan Terkirim!</h3>
                <p className="text-gray-300">Terima kasih! Kami akan segera membalas pesan Anda.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Masukkan nama Anda"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subjek *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Subjek pesan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Pesan *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                    placeholder="Tulis pesan Anda di sini..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform"
                >
                  📤 Kirim Pesan
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
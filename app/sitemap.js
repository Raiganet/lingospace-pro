import { getSiteOrigin } from '@/lib/site';

const blogSlugs = [
  '100-kosakata-arab-sehari-hari',
  'belajar-bahasa-arab-melalui-lagu-dan-film',
  'belajar-bahasa-arab-untuk-umroh-dan-haji',
  'belajar-grammar-inggris-tenses',
  'cara-belajar-bahasa-otodidak',
  'cara-menghafal-huruf-hijaiyah',
  'cara-meningkatkan-listening-skill-bahasa-inggris',
  'kesalahan-umum-orang-indonesia-belajar-bahasa-inggris',
  'manfaat-bilingual-belajar-bahasa-asing',
  'memahami-nahwu-dasar',
  'menguasai-1000-kosakata-bahasa-inggris',
  'perbedaan-arab-fusha-dan-amiyah',
  'perbedaan-bahasa-inggris-british-dan-american',
  'roadmap-lengkap-belajar-bahasa-dari-pemula-hingga-fasih',
  'spaced-repetition-system',
  'teknik-membaca-cepat-bahasa-inggris',
  'teknik-pronunciation-bahasa-inggris',
  'tips-belajar-bahasa-arab-untuk-pemula',
  'tips-menulis-essay-bahasa-inggris',
  'tips-sukses-ujian-toefl-ielts',
];

export default function sitemap() {
  const origin = getSiteOrigin();
  const now = new Date();
  const staticPages = [
    { path: '/', priority: 1, changeFrequency: 'weekly' },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  ];

  return [
    ...staticPages.map((item) => ({
      url: `${origin}${item.path}`,
      lastModified: now,
      changeFrequency: item.changeFrequency,
      priority: item.priority,
    })),
    ...blogSlugs.map((slug) => ({
      url: `${origin}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.65,
    })),
  ];
}

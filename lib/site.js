const normalizeUrl = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
};

export const getSiteUrl = () => {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    'http://localhost:3000';

  try {
    return new URL(normalizeUrl(candidate));
  } catch {
    return new URL('http://localhost:3000');
  }
};

export const getSiteOrigin = () => getSiteUrl().origin;

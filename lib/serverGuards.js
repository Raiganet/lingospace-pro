import { NextResponse } from 'next/server';

const BUCKETS = globalThis.__LINGOSPACE_RATE_BUCKETS__ || new Map();
if (!globalThis.__LINGOSPACE_RATE_BUCKETS__) globalThis.__LINGOSPACE_RATE_BUCKETS__ = BUCKETS;

const getClientId = (request) => {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')?.[0]?.trim();
  const real = request.headers.get('x-real-ip')?.trim();
  return forwarded || real || 'unknown';
};

const cleanBuckets = (now) => {
  if (BUCKETS.size < 5000) return;
  for (const [key, value] of BUCKETS.entries()) {
    if (value.resetAt <= now) BUCKETS.delete(key);
  }
};

const getAllowedOrigins = (request) => {
  const values = new Set([request.nextUrl.origin]);
  String(process.env.ALLOWED_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean).forEach((value) => values.add(value));
  return values;
};

export const guardApiRequest = (request, { namespace = 'api', limit = 20, windowMs = 60000, maxBytes = 12000 } = {}) => {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > maxBytes) {
    return NextResponse.json({ error: 'Request terlalu besar.' }, { status: 413 });
  }

  const origin = request.headers.get('origin');
  if (origin && !getAllowedOrigins(request).has(origin)) {
    return NextResponse.json({ error: 'Origin tidak diizinkan.' }, { status: 403 });
  }

  const now = Date.now();
  cleanBuckets(now);
  const key = `${namespace}:${getClientId(request)}`;
  const current = BUCKETS.get(key);
  if (!current || current.resetAt <= now) {
    BUCKETS.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  current.count += 1;
  if (current.count > limit) {
    const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return NextResponse.json({ error: 'Terlalu banyak permintaan. Coba lagi sebentar.' }, {
      status: 429,
      headers: { 'Retry-After': String(retryAfter) },
    });
  }
  return null;
};

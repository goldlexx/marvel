const ALLOWED_ORIGIN = 'https://goldlexx.github.io';
const API_BASE_URL = 'https://superheroapi.com/api';

function corsHeaders(origin) {
  if (origin !== ALLOWED_ORIGIN) {
    return { Vary: 'Origin' };
  }

  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(origin),
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function resolveUpstreamPath(pathname) {
  const characterMatch = pathname.match(/^\/api\/characters\/([0-9]{1,4})$/);
  if (characterMatch) {
    const id = Number(characterMatch[1]);
    return id >= 1 && id <= 9999 ? String(id) : null;
  }

  const searchMatch = pathname.match(/^\/api\/search\/([^/]+)$/);
  if (!searchMatch) {
    return null;
  }

  let name;
  try {
    name = decodeURIComponent(searchMatch[1]).trim();
  } catch {
    return null;
  }

  if (!name || name.length > 80 || /[\\/\u0000-\u001f]/.test(name)) {
    return null;
  }

  return `search/${encodeURIComponent(name)}`;
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    const origin = request.headers.get('Origin');
    const upstreamPath = resolveUpstreamPath(pathname);

    if (!upstreamPath) {
      return jsonResponse({ error: 'Not found.' }, 404, origin);
    }

    if (origin !== ALLOWED_ORIGIN) {
      return jsonResponse({ error: 'Origin not allowed.' }, 403, origin);
    }

    if (request.method === 'OPTIONS') {
      const requestedMethod = request.headers.get('Access-Control-Request-Method');
      if (requestedMethod && requestedMethod !== 'GET') {
        return jsonResponse({ error: 'Method not allowed.' }, 405, origin);
      }

      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    if (request.method !== 'GET') {
      return jsonResponse({ error: 'Method not allowed.' }, 405, origin);
    }

    if (!env.SUPERHERO_API_TOKEN) {
      return jsonResponse({ error: 'API proxy is not configured.' }, 503, origin);
    }

    const key = new Request(new URL(pathname, request.url).href);
    const cached = await caches.default.match(key);
    if (cached) return cached;

    const upstreamUrl = `${API_BASE_URL}/${encodeURIComponent(env.SUPERHERO_API_TOKEN)}/${upstreamPath}`;

    try {
      const upstreamResponse = await fetch(upstreamUrl, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(10000),
      });
      const payload = await upstreamResponse.json();

      const response = jsonResponse(payload, upstreamResponse.status, origin);
      if (upstreamResponse.ok && payload.response === 'success') {
        response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=3600');
        ctx.waitUntil(caches.default.put(key, response.clone()).catch(() => {}));
      }
      return response;
    } catch {
      return jsonResponse({ error: 'SuperHero API is unavailable.' }, 502, origin);
    }
  },
};

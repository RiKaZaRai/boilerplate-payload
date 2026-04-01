import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

const REDIRECTS_CACHE_SECONDS = 60;

type RedirectDoc = {
  from: string;
  to: {
    type: 'reference' | 'custom';
    reference?: {
      relationTo: string;
      value: { slug?: string } | string;
    } | null;
    url?: string;
  };
  type?: string;
};

/**
 * Resolve the destination URL from a redirect document.
 */
function resolveDestination(redirect: RedirectDoc): string | null {
  const { to } = redirect;

  if (to.type === 'custom' && to.url) {
    return to.url;
  }

  if (to.type === 'reference' && to.reference) {
    const { relationTo, value } = to.reference;
    const slug = typeof value === 'string' ? value : value?.slug;

    if (!slug) return null;

    switch (relationTo) {
      case 'pages':
        return slug === 'home' ? '/' : `/${slug}`;
      case 'posts':
        return `/posts/${slug}`;
      default:
        return `/${slug}`;
    }
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip admin, API, static assets, and Next.js internals
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  try {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
    const res = await fetch(`${serverUrl}/api/redirects?depth=1&limit=0`, {
      next: { revalidate: REDIRECTS_CACHE_SECONDS, tags: ['redirects'] },
    });

    if (!res.ok) return NextResponse.next();

    const data = await res.json();
    const redirects: RedirectDoc[] = data?.docs ?? [];

    const match = redirects.find((r) => r.from === pathname);
    if (!match) return NextResponse.next();

    const destination = resolveDestination(match);
    if (!destination) return NextResponse.next();

    const statusCode = match.type === '301' ? 301 : 302;

    return NextResponse.redirect(new URL(destination, request.url), statusCode);
  } catch {
    // If redirects API is unreachable, don't block the request
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

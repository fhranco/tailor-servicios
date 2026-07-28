import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['es'],
  defaultLocale: 'es',
  localePrefix: 'never'
});

export default function middleware(req: NextRequest) {
  // Skip next-intl for API routes
  if (req.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // For non-api pages, run next-intl as usual
  return intlMiddleware(req);
}

export const config = {
  // Match all pathnames except for _next, _vercel, and static files
  matcher: ['/((?!_next|_vercel|.*\\..*).*)']
};

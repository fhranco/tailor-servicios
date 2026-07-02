import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['es'],
  defaultLocale: 'es',
  localePrefix: 'never'
});

export default function middleware(req: NextRequest) {
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin');
  const isAdminApi = req.nextUrl.pathname.startsWith('/api/admin');

  // Protect admin routes and admin API routes
  if (isAdminPage || isAdminApi) {
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      const expectedUser = process.env.ADMIN_USER || 'admin';
      const expectedPassword = process.env.ADMIN_PASSWORD || 'Tailor2024!';

      if (user === expectedUser && pwd === expectedPassword) {
        // Authenticated. Skip next-intl for API routes.
        if (isAdminApi) {
          return NextResponse.next();
        }
        return intlMiddleware(req);
      }
    }

    // Not authenticated, prompt for password
    return new NextResponse('Auth required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Tailor Servicios"',
      },
    });
  }

  // Skip next-intl for regular API routes
  if (req.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // For non-admin pages, run next-intl as usual
  return intlMiddleware(req);
}

export const config = {
  // Match all pathnames except for _next, _vercel, and static files
  matcher: ['/((?!_next|_vercel|.*\\..*).*)']
};

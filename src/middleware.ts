import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

import { NextRequest } from 'next/server';

const handleI18n = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const response = handleI18n(request);
  const localeCookie = response.cookies.get('NEXT_LOCALE');
  if (localeCookie) {
    response.cookies.set({
      name: 'NEXT_LOCALE',
      value: localeCookie.value,
      path: '/',
      sameSite: 'lax',
      secure: true,
      maxAge: 31536000,
    });
  }
  return response;
}

export const config = {
  // Match all pathnames except for api, _next, _vercel, and static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};


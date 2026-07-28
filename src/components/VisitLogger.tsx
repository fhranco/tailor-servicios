'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function VisitLogger() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const logVisit = async () => {
      // Respect user privacy: only log if user accepted cookies ('all')
      const consent = getCookie('tailor_cookie_consent');
      if (consent !== 'all') {
        return; 
      }

      try {
        await fetch('/api/log-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page_path: pathname,
            referrer: document.referrer || '',
            locale: locale,
          }),
        });
      } catch (err) {
        console.error('Failed to log visit:', err);
      }
    };

    logVisit();
  }, [pathname, locale]);

  return null;
}

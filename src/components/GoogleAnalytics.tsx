'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { GA_MEASUREMENT_ID, hasAnalyticsConsent, deleteGACookies } from '@/lib/analytics';

/**
 * Componente Google Analytics 4 (GA4) con Carga Condicional y Consentimiento
 * Cumple con Ley 21.719 (Chile) y optimizaciones de rendimiento web (Core Web Vitals):
 * - NO carga gtag.js en la ruta crítica inicial sin consentimiento previo.
 * - Solo se inicializa si existe consentimiento 'all' en tailor_cookie_consent.
 * - Registra cambios de ruta en SPA con usePathname() evitando duplicados.
 * - No recopila ni envía PII (Información Personal Identificable).
 */
export default function GoogleAnalytics() {
  const pathname = usePathname();
  const isInitialized = useRef<boolean>(false);
  const lastTrackedUrl = useRef<string>('');

  const sendPageView = (url: string) => {
    if (typeof window === 'undefined') return;
    if (typeof (window as any).gtag !== 'function') return;

    // Sanitizar URL antes de enviar para remover parámetros accidentales con emails o tokens
    let sanitizedPath = url;
    try {
      const parsed = new URL(url, window.location.origin);
      // Eliminar parámetros sensibles conocidos
      ['email', 'nombre', 'name', 'phone', 'token', 'access_token', 'code'].forEach((param) => {
        parsed.searchParams.delete(param);
      });
      sanitizedPath = parsed.pathname + (parsed.search || '');
    } catch {
      // Usar URL original si falla el parseo
    }

    (window as any).gtag('event', 'page_view', {
      page_path: sanitizedPath,
      page_location: window.location.origin + sanitizedPath,
      page_title: document.title,
    });
  };

  const initGA4 = () => {
    if (typeof window === 'undefined') return;
    if (isInitialized.current) return;

    // 1. Inyectar script oficial de Google Tag Manager de manera asíncrona
    if (!document.getElementById('ga4-script')) {
      const script = document.createElement('script');
      script.id = 'ga4-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);
    }

    // 2. Inicializar dataLayer y función gtag global
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false, // Desactivar auto-pageview para evitar duplicados en SPA
      anonymize_ip: true,
      cookie_flags: 'SameSite=Lax;Secure',
    });

    isInitialized.current = true;

    // 3. Emitir el page_view inicial para la página actual
    const currentUrl = pathname + (window.location.search || '');
    lastTrackedUrl.current = currentUrl;
    // Pequeño timeout para asegurar que el título del documento esté actualizado
    setTimeout(() => {
      sendPageView(currentUrl);
    }, 150);
  };

  useEffect(() => {
    // 1. Comprobar si ya existe consentimiento almacenado en cookies
    if (hasAnalyticsConsent()) {
      initGA4();
    }

    // 2. Escuchar evento de actualización de consentimiento desde CookieBanner
    const handleConsentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ consent: string }>;
      if (customEvent.detail?.consent === 'all') {
        initGA4();
      } else if (customEvent.detail?.consent === 'essential') {
        // Revocación / Rechazo: Desactivar telemetría y purgar cookies _ga
        deleteGACookies();
        isInitialized.current = false;
      }
    };

    window.addEventListener('tailor_consent_updated', handleConsentUpdate);
    return () => {
      window.removeEventListener('tailor_consent_updated', handleConsentUpdate);
    };
  }, []);

  // 3. Seguimiento de navegación SPA en Next.js App Router
  useEffect(() => {
    if (!isInitialized.current) return;

    const currentUrl = pathname + (typeof window !== 'undefined' ? window.location.search : '');

    // Evitar page_views duplicados en la misma ruta
    if (currentUrl === lastTrackedUrl.current) return;
    lastTrackedUrl.current = currentUrl;

    const timer = setTimeout(() => {
      sendPageView(currentUrl);
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

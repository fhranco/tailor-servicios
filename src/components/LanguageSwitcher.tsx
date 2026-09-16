"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link, usePathname } from '../i18n/routing';
import './LanguageSwitcher.css';

interface LanguageSwitcherProps {
  variant?: 'header' | 'mobile' | 'footer';
}

const PERTINENT_PARAMS = ['servicio', 'service', 'categoria', 'category', 'tab', 'q'];

const VALID_PAGE_ANCHORS: Record<string, string[]> = {
  '/': ['#portales-exclusivos', '#testimonios'],
  '/servicios': ['#reclutamiento', '#gestion', '#desarrollo'],
  '/candidatos': ['#envia-tu-cv', '#ofertas-laborales'],
  '/postulantes': ['#carga-cv'],
  '/privacidad': ['#privacidad'],
  '/cookies': ['#cookies'],
  '/terminos': ['#privacidad', '#cookies'],
};

const VALID_ROUTES = [
  '/',
  '/nosotros',
  '/servicios',
  '/especializacion',
  '/empresas',
  '/candidatos',
  '/postulantes',
  '/contacto',
  '/blog',
  '/privacidad',
  '/terminos',
  '/cookies',
  '/admin',
  '/admin/privacidad',
];

function getValidAnchorForPage(pathname: string, rawHash: string): string {
  if (!rawHash) return '';
  const cleanPath = pathname.replace(/^\/en(\/|$)/, '/') || '/';
  const allowed = VALID_PAGE_ANCHORS[cleanPath];
  if (allowed && allowed.includes(rawHash)) {
    return rawHash;
  }
  return '';
}

function LanguageSwitcherContent({ variant = 'header' }: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hash, setHash] = useState('');

  // Sincronizar y limpiar el ancla cuando cambie dentro de la misma página o entre páginas
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncHash = () => {
      const valid = getValidAnchorForPage(pathname, window.location.hash);
      setHash(valid);
    };

    syncHash();

    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHash);

    return () => {
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('popstate', syncHash);
    };
  }, [pathname]);

  // Conservación selectiva de parámetros pertinentes
  const filteredParams = new URLSearchParams();
  if (searchParams) {
    PERTINENT_PARAMS.forEach((key) => {
      const val = searchParams.get(key);
      if (val) {
        filteredParams.set(key, val);
      }
    });
  }

  // Comprobar que el destino exista antes de ofrecerlo (fallback al home si la ruta no existe)
  const normalizedPath = pathname === '' ? '/' : pathname;
  const destinationPath = VALID_ROUTES.includes(normalizedPath) ? normalizedPath : '/';

  const queryStr = filteredParams.toString();
  const targetHref = `${destinationPath}${queryStr ? `?${queryStr}` : ''}${hash}`;

  return (
    <div 
      className={`lang-switcher lang-switcher-${variant}`} 
      role="group" 
      aria-label="Selector de idioma / Language selector"
    >
      <Link 
        href={targetHref} 
        locale="es" 
        className={`lang-btn ${locale === 'es' ? 'active' : ''}`}
        aria-current={locale === 'es' ? 'page' : undefined}
        aria-label="Español"
        title="Español"
      >
        ES
      </Link>
      <span className="lang-sep" aria-hidden="true">/</span>
      <Link 
        href={targetHref} 
        locale="en" 
        className={`lang-btn ${locale === 'en' ? 'active' : ''}`}
        aria-current={locale === 'en' ? 'page' : undefined}
        aria-label="English"
        title="English"
      >
        EN
      </Link>
    </div>
  );
}

export default function LanguageSwitcher(props: LanguageSwitcherProps) {
  return (
    <Suspense fallback={
      <div 
        className={`lang-switcher lang-switcher-${props.variant || 'header'}`} 
        role="group" 
        aria-label="Selector de idioma"
      >
        <span className="lang-btn">ES</span>
        <span className="lang-sep" aria-hidden="true">/</span>
        <span className="lang-btn">EN</span>
      </div>
    }>
      <LanguageSwitcherContent {...props} />
    </Suspense>
  );
}

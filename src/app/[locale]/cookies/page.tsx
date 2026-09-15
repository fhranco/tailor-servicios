import React from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import '../terminos/Terminos.css';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'TerminosPage' });
  const isEn = locale === 'en';
  return {
    title: isEn ? 'Cookie Policy' : 'Política de Cookies',
    description: t('meta_desc'),
    alternates: {
      canonical: isEn ? 'https://tailorservicios.cl/en/cookies' : 'https://tailorservicios.cl/cookies',
      languages: {
        'es': 'https://tailorservicios.cl/cookies',
        'en': 'https://tailorservicios.cl/en/cookies',
        'x-default': 'https://tailorservicios.cl/cookies',
      },
    },
  };
}

export default function CookiesPage() {
  const t = useTranslations('TerminosPage');

  return (
    <main className="terminos-page min-h-screen">
      <section className="terminos-header">
        <div className="fluid-container text-center">
          <h1 className="terminos-title" style={{ color: '#ffffff' }}>Política de Cookies</h1>
          <p className="terminos-subtitle">{t('page_subtitle')}</p>
        </div>
      </section>

      <section className="terminos-content-section">
        <div className="fluid-container">
          <div className="terminos-card">
            
            <div className="terminos-block" id="cookies">
              <h2>{t('cookies_title')}</h2>
              <p>{t('cookies_text')}</p>
              <ul>
                <li><strong>{t('cookies_li1')}</strong></li>
                <li><strong>{t('cookies_li2')}</strong></li>
              </ul>
              <p>{t('cookies_p2')}</p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

import React from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import './Terminos.css';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'TerminosPage' });
  return {
    title: t('meta_title'),
    description: t('meta_desc'),
  };
}

export default function TerminosPage() {
  const t = useTranslations('TerminosPage');

  return (
    <main className="terminos-page min-h-screen">
      <section className="terminos-header">
        <div className="fluid-container text-center">
          <h1 className="terminos-title" style={{ color: '#ffffff' }}>{t('page_title')}</h1>
          <p className="terminos-subtitle">{t('page_subtitle')}</p>
        </div>
      </section>

      <section className="terminos-content-section">
        <div className="fluid-container">
          <div className="terminos-card">
            
            <div className="terminos-block">
              <h2>{t('intro_title')}</h2>
              <p>{t('intro_text')}</p>
            </div>

            <div className="terminos-block">
              <h2>{t('terms_2_title')}</h2>
              <p>{t('terms_2_text')}</p>
            </div>

            <div className="terminos-block">
              <h2>{t('terms_3_title')}</h2>
              <p>{t('terms_3_text')}</p>
            </div>

            <div className="terminos-block">
              <h2>{t('terms_4_title')}</h2>
              <p>{t('terms_4_text')}</p>
            </div>

            <div className="terminos-block">
              <h2>{t('terms_5_title')}</h2>
              <p>{t('terms_5_text')}</p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

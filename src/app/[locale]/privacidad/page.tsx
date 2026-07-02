import React from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import '../terminos/Terminos.css';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'TerminosPage' });
  return {
    title: 'Política de Privacidad | Tailor Servicios',
    description: t('meta_desc'),
  };
}

export default function PrivacidadPage() {
  const t = useTranslations('TerminosPage');

  return (
    <main className="terminos-page min-h-screen">
      <section className="terminos-header">
        <div className="fluid-container text-center">
          <h1 className="terminos-title" style={{ color: '#ffffff' }}>Política de Privacidad</h1>
          <p className="terminos-subtitle">{t('page_subtitle')}</p>
        </div>
      </section>

      <section className="terminos-content-section">
        <div className="fluid-container">
          <div className="terminos-card">
            
            <div className="terminos-block" id="privacidad">
              <h2>{t('privacy_title')}</h2>
              <p>{t('privacy_p1')}</p>
              <ul>
                <li>{t('privacy_li1')}</li>
                <li>{t('privacy_li2')}</li>
              </ul>
              <p><strong>{t('privacy_p2')}</strong></p>
            </div>

            <div className="terminos-block">
              <h2>{t('rights_title')}</h2>
              <p>{t('rights_text')}</p>
              <ul className="contact-list">
                <li><strong>{t('rights_li1')}</strong></li>
                <li><strong>{t('rights_li2')}</strong></li>
              </ul>
              <p>{t('rights_p2')}</p>
            </div>

            <div className="terminos-block">
              <h2>{t('security_title')}</h2>
              <p>{t('security_text')}</p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

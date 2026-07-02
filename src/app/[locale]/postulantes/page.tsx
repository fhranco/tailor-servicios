"use client";

import React from 'react';
import './page.css';
import B2C_Dropzone from '@/components/B2C_Dropzone';

import { useTranslations } from 'next-intl';

export default function PostulantesPage() {
  const t = useTranslations('PostulantesPage');
  
  return (
    <main className="funnel-page">
      <section className="funnel-hero-b2c">
        <div className="fluid-container">
          <h1>{t('hero_title')}</h1>
          <p>
            {t('hero_desc')}
          </p>
        </div>
      </section>

      <section className="funnel-content fluid-container" id="carga-cv">
        <div className="form-wrapper">
          <h2 style={{fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-dark)', textAlign: 'center'}}>
            {t('form_title')}
          </h2>
          <p style={{textAlign: 'center', color: 'var(--color-gray-dark)', marginBottom: '2rem', fontSize: '0.9rem'}}>
            {t('form_subtitle')}
          </p>
          <B2C_Dropzone />
        </div>
      </section>
    </main>
  );
}

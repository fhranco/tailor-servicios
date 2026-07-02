"use client";

import React from 'react';
import './page.css';
import B2B_LeadForm from '@/components/B2B_LeadForm';

import { useTranslations } from 'next-intl';

export default function EmpresasPage() {
  const t = useTranslations('EmpresasPage');
  
  return (
    <main className="funnel-page">
      <section className="funnel-hero">
        <div className="fluid-container">
          <h1>{t('hero_title')}</h1>
          <p>
            {t('hero_desc')}
          </p>
        </div>
      </section>

      <section className="funnel-content fluid-container">
        <div className="form-wrapper">
          <h2 style={{fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-dark)', textAlign: 'center'}}>
            {t('form_title')}
          </h2>
          <B2B_LeadForm />
        </div>
      </section>
    </main>
  );
}

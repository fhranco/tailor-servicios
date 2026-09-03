"use client";

import React from 'react';
import './page.css';

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
        <div className="form-wrapper" style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(217, 119, 6, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: 'var(--color-accent)'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          
          <h2 style={{fontSize: '1.6rem', marginBottom: '0.75rem', color: 'var(--color-dark)', fontWeight: 700}}>
            Portal Oficial de Empleos
          </h2>
          <p style={{color: 'var(--color-gray-dark)', marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.6'}}>
            Gestionamos todas las postulaciones laborales y recepción de antecedentes a través de nuestra plataforma oficial en <strong>Rex+</strong>.
          </p>

          <a 
            href="https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '1rem 1.5rem',
              fontSize: '1.05rem',
              fontWeight: 600,
              textDecoration: 'none',
              borderRadius: '6px'
            }}
          >
            Postular y Subir CV en Rex+
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>

          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '1.5rem' }}>
            Serás redirigido a un entorno seguro administrado por Rex+ Talento.
          </p>
        </div>
      </section>
    </main>
  );
}

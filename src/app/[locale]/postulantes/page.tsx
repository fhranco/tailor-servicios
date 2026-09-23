"use client";

import React, { useState } from 'react';
import './page.css';
import { useTranslations } from 'next-intl';

export default function PostulantesPage() {
  const t = useTranslations('PostulantesPage');
  const [copied, setCopied] = useState(false);
  const emailAddress = 'seleccion@tailorservicios.cl';

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(emailAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const mailSubject = encodeURIComponent(t('mail_subject'));
  const mailBody = encodeURIComponent(t('mail_body'));
  const mailtoUrl = `mailto:${emailAddress}?subject=${mailSubject}&body=${mailBody}`;

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
        <div className="form-wrapper" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
          {/* Icono de Correo */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(15, 23, 42, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: 'var(--color-primary, #0f172a)'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.75rem', color: 'var(--color-dark)', fontWeight: 700 }}>
            {t('email_section_title')}
          </h2>
          <p style={{ color: 'var(--color-gray-dark)', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.6' }}>
            {t('email_section_desc')}
          </p>

          {/* Explicación visible obligatoria */}
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            color: '#1e40af',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>
            <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>ℹ️</span>
            <span>{t('email_notice')}</span>
          </div>

          {/* Botón Principal: Enviar currículum por correo */}
          <a 
            href={mailtoUrl}
            className="candidate-email-action-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              width: '100%',
              padding: '1rem 1.5rem',
              fontSize: '1.05rem',
              fontWeight: 700,
              textDecoration: 'none',
              borderRadius: '8px',
              backgroundColor: 'var(--color-primary, #0f172a)',
              color: '#ffffff',
              marginBottom: '1.25rem',
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            {t('open_email_btn')}
          </a>

          {/* Caja con dirección visible y opción de copia */}
          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'left', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            <span style={{ color: '#475569', fontWeight: 600 }}>{t('manual_email_info')}</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                ✉️ {emailAddress}
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                style={{
                  background: copied ? '#059669' : '#ffffff',
                  color: copied ? '#ffffff' : '#334155',
                  border: '1px solid',
                  borderColor: copied ? '#059669' : '#cbd5e1',
                  borderRadius: '6px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {copied ? t('copied_address_btn') : t('copy_address_btn')}
              </button>
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.5', textAlign: 'justify', marginBottom: '2rem' }}>
            {t('privacy_statement')}
          </p>

          {/* Sección secundaria independiente: Convocatorias activas en Rex+ */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.75rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.5rem' }}>
              {t('rex_section_title')}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1rem' }}>
              {t('rex_section_desc')}
            </p>
            <a 
              href="https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#be1622',
                backgroundColor: 'rgba(190, 22, 34, 0.05)',
                border: '1px solid rgba(190, 22, 34, 0.2)',
                borderRadius: '6px',
                textDecoration: 'none'
              }}
            >
              {t('rex_btn')}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
              {t('rex_notice')}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

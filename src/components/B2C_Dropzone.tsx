"use client";

import React, { useState } from 'react';
import './B2C_Dropzone.css';
import { useTranslations } from 'next-intl';

export default function B2C_Dropzone() {
  const t = useTranslations('B2C_Dropzone');
  const tUpload = useTranslations('CandidateUpload');
  const [copied, setCopied] = useState(false);
  const emailAddress = 'seleccion@tailorservicios.cl';

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(emailAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const mailSubject = encodeURIComponent(tUpload('mail_subject'));
  const mailBody = encodeURIComponent(tUpload('mail_body'));
  const mailtoUrl = `mailto:${emailAddress}?subject=${mailSubject}&body=${mailBody}`;

  return (
    <div className="b2c-dropzone-container" style={{ padding: '2rem', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#ffffff', textAlign: 'center' }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: 'rgba(15, 23, 42, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1rem',
        color: 'var(--color-primary, #0f172a)'
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      </div>

      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.5rem' }}>
        {t('title')}
      </h3>
      <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
        {t('desc')}
      </p>

      {/* Explicación visible obligatoria */}
      <div style={{
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        color: '#1e40af',
        fontSize: '0.88rem',
        fontWeight: 500,
        textAlign: 'left'
      }}>
        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>ℹ️</span>
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
          gap: '0.5rem',
          width: '100%',
          padding: '0.85rem 1.25rem',
          fontSize: '0.95rem',
          fontWeight: 700,
          textDecoration: 'none',
          borderRadius: '6px',
          backgroundColor: 'var(--color-primary, #0f172a)',
          color: '#ffffff',
          marginBottom: '1rem',
          transition: 'all 0.2s ease'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
        {t('open_email_btn')}
      </a>

      {/* Opción de copia de dirección */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.82rem' }}>
        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>
          ✉️ {emailAddress}
        </span>
        <button
          type="button"
          onClick={handleCopyEmail}
          style={{
            background: copied ? '#059669' : '#ffffff',
            color: copied ? '#ffffff' : '#334155',
            border: '1px solid',
            borderColor: copied ? '#059669' : '#cbd5e1',
            borderRadius: '4px',
            padding: '0.25rem 0.6rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {copied ? t('copied_btn') : t('copy_btn')}
        </button>
      </div>
    </div>
  );
}

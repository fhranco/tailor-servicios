'use client';

import React from 'react';
import { motion } from 'framer-motion';
import './CandidateUpload.css';
import { useTranslations } from 'next-intl';

export default function CandidateUpload() {
  const t = useTranslations('CandidateUpload');

  return (
    <section className="c-upload-section" id="subir-cv">
      <div className="fluid-container">
        <motion.div 
          className="c-upload-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className="c-upload-text">
            <span className="c-upload-badge">{t('badge')}</span>
            <h2 className="c-upload-title">{t('title')}</h2>
            <p className="c-upload-desc">
              {t('desc')}
            </p>
          </div>

          <div className="c-upload-form-wrapper" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '3.5rem 2.5rem' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'rgba(252, 195, 113, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              color: 'var(--color-accent)'
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>

            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '1rem' }}>
              Portal de Selección Rex+
            </h3>

            <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem', maxWidth: '420px' }}>
              Para garantizar la confidencialidad, trazabilidad y gestión en tiempo real de tu postulación, centralizamos la recepción de currículums en nuestra plataforma oficial.
            </p>

            <a 
              href="https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary c-submit-btn"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                fontSize: '1.1rem',
                padding: '1.1rem 2rem',
                borderRadius: '8px'
              }}
            >
              Postular y Subir CV en Rex+
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>

            <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-medium)', marginTop: '1.5rem' }}>
              🔒 Proceso seguro bajo estándares de protección de datos personales.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import React from 'react';
import B2B_LeadForm from './B2B_LeadForm';
import './ContactSection.css';
import { useTranslations } from 'next-intl';

export default function ContactSection() {
  const t = useTranslations('ContactSection');
  return (
    <section className="contact-section">
      <div className="fluid-container">
        <div className="contact-grid">
          <div className="contact-info">
            <h2 className="section-title">{t('title')}</h2>
            <p className="section-description">
              {t('desc')}
            </p>
            <div className="contact-details">
              <div className="contact-detail-item">
                <span className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </span>
                <span>Punta Arenas, Región de Magallanes</span>
              </div>
              <div className="contact-detail-item">
                <span className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </span>
                <span>contacto@tailorservicios.cl</span>
              </div>
            </div>
          </div>
          <div className="contact-form-wrapper">
            <div className="form-card">
              <B2B_LeadForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

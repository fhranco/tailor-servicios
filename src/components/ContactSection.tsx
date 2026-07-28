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
                <span>21 de mayo #2918, Punta Arenas</span>
              </div>
              <div className="contact-detail-item">
                <span className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </span>
                <span><a href="https://wa.me/56997580085" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>+56 9 9758 0085</a></span>
              </div>
              <div className="contact-detail-item">
                <span className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </span>
                <span><a href="mailto:Contacto@tailorservicios.cl" style={{ color: 'inherit', textDecoration: 'none' }}>Contacto@tailorservicios.cl</a></span>
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

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import './ClientPortalsSection.css';

interface PortalItem {
  id: string;
  name: string;
  category: string;
  logo: string;
  link: string;
  accent: string;
  status: string;
  desc: string;
  btnText: string;
}

export default function ClientPortalsSection() {
  const t = useTranslations('ClientPortalsSection');

  const portals: PortalItem[] = [
    {
      id: 'dap',
      name: t('dap_name'),
      category: t('dap_category'),
      logo: '/portales/dap.png',
      link: 'https://serviciosindustrialetailor.rexmas.com/jobs/aerovias-dap',
      accent: '#cf142b',
      status: t('dap_status'),
      desc: t('dap_desc'),
      btnText: t('dap_btn')
    },
    {
      id: 'cormoran',
      name: t('cormoran_name'),
      category: t('cormoran_category'),
      logo: '/portales/cormoran.png',
      link: 'https://serviciosindustrialetailor.rexmas.com/jobs/the-cormorant-at-55-south',
      accent: '#b89025',
      status: t('cormoran_status'),
      desc: t('cormoran_desc'),
      btnText: t('cormoran_btn')
    },
    {
      id: 'hosteria-el-pionero',
      name: t('pionero_name'),
      category: t('pionero_category'),
      logo: '/portales/hosteria-el-pionero.png',
      link: 'https://serviciosindustrialetailor.rexmas.com/jobs/hosteria-el-pionero',
      accent: '#2d6a4f',
      status: t('pionero_status'),
      desc: t('pionero_desc'),
      btnText: t('pionero_btn')
    }
  ];

  return (
    <section className="client-portals-section" id="portales-exclusivos">
      <div className="fluid-container">
        <div className="client-portals-header">
          <div className="client-portals-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            {t('badge')}
          </div>
          <h2 className="client-portals-title">
            {t('title_prefix')} <span className="text-highlight">{t('title_accent')}</span>
          </h2>
          <p className="client-portals-desc">
            {t('subtitle')}
          </p>
        </div>

        <div className="client-portals-grid">
          {portals.map((portal, idx) => (
            <motion.div 
              key={portal.id}
              className="client-portal-card"
              style={{ '--portal-accent': portal.accent, '--portal-btn-bg': portal.accent } as React.CSSProperties}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div>
                <div className="portal-top-bar">
                  <div className="portal-logo-container">
                    <img 
                      src={portal.logo} 
                      alt={`Logo ${portal.name}`} 
                      loading="lazy" 
                      decoding="async" 
                    />
                  </div>
                  <span className="portal-status-pill">
                    <span className="portal-status-dot"></span>
                    {portal.status}
                  </span>
                </div>

                <div className="portal-content">
                  <span className="portal-category">{portal.category}</span>
                  <h3>{portal.name}</h3>
                  <p className="portal-desc">{portal.desc}</p>
                </div>
              </div>

              <div className="portal-footer">
                <span className="portal-rex-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  {t('rex_badge')}
                </span>
                
                <a 
                  href={portal.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portal-cta-btn"
                >
                  {portal.btnText}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Banner de alternativa cuando no hay vacante en los portales */}
        <div style={{
          marginTop: '2.5rem',
          padding: '1.25rem 1.75rem',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ fontSize: '1.5rem' }}>💡</span>
            <div>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                {t('help_title')}
              </div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>
                {t('help_desc')}
              </p>
            </div>
          </div>
          <a
            href="#envia-tu-cv"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            {t('help_btn')}
          </a>
        </div>
      </div>
    </section>
  );
}

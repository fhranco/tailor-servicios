"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import './page.css';

export default function ServiciosPage() {
  const t = useTranslations('ServiciosPage');

  return (
    <main className="services-page">
      {/* Hero Section */}
      <section className="inner-hero">
        <div className="fluid-container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <div className="hero-badge">{t('badge')}</div>
            <h1 className="hero-title">
              {t('title')} <span className="text-accent">{t('title_accent')}</span>
            </h1>
            <p className="hero-subtitle">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
        <div className="hero-background-gradient"></div>
      </section>

      {/* Servicio 1: Reclutamiento */}
      <section className="service-block dark-block" id="reclutamiento">
        <div className="fluid-container service-grid">
          <motion.div 
            className="service-text-col"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="service-number">{t('s1_number')}</div>
            <h2>{t('s1_title')}</h2>
            <h3>{t('s1_subtitle')}</h3>
            <div className="service-divider"></div>
            <p>
              {t('s1_p1')}
            </p>
            <p>
              {t('s1_p2')}
            </p>
            <p>
              {t('s1_p3')}
            </p>
            <div className="quote-box" style={{marginTop: '4rem'}}>
              <svg className="quote-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 11L8 15H11V19H5V15L7 11H5V7H11V11H10ZM20 11L18 15H21V19H15V15L17 11H15V7H21V11H20Z" fill="currentColor"/></svg>
              <p style={{fontSize: '1.2rem'}}>{t('s1_quote')}</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="service-list-col glass-panel"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <h4>{t('s1_includes_title')}</h4>
            </div>
            <ul className="service-list luxury-list" style={{marginBottom: '2rem'}}>
              <li>{t('s1_li1')}</li>
              <li>{t('s1_li2')}</li>
              <li>{t('s1_li3')}</li>
              <li>{t('s1_li4')}</li>
              <li>{t('s1_li5')}</li>
              <li>{t('s1_li6')}</li>
              <li>{t('s1_li7')}</li>
              <li>{t('s1_li8')}</li>
              <li>{t('s1_li9')}</li>
              <li>{t('s1_li10')}</li>
              <li>{t('s1_li11')}</li>
              <li>{t('s1_li12')}</li>
            </ul>
            
            <p style={{color: 'var(--color-gray-dark)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '1rem'}}>
              {t('s1_footer1')}
            </p>
            <p style={{color: 'var(--color-gray-dark)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem'}}>
              {t('s1_footer2')}
            </p>

          </motion.div>
        </div>
      </section>

      {/* Servicio 2: Gestión de Dotaciones */}
      <section className="service-block light-block" id="gestion">
        <div className="fluid-container service-grid reverse-grid">
          <motion.div 
            className="service-text-col"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="service-number dark-number">{t('s2_number')}</div>
            <h2>{t('s2_title')}</h2>
            <h3>{t('s2_subtitle')}</h3>
            <div className="service-divider dark-divider"></div>
            <p>
              {t('s2_p1')}
            </p>
            <p>
              {t('s2_p2')}
            </p>
            <p>
              {t('s2_p3')}
            </p>
            <div className="quote-box dark-quote">
              <svg className="quote-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 11L8 15H11V19H5V15L7 11H5V7H11V11H10ZM20 11L18 15H21V19H15V15L17 11H15V7H21V11H20Z" fill="currentColor"/></svg>
              <p>{t('s2_quote')}</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="service-list-col dark-glass-panel"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <h4>{t('s2_includes_title')}</h4>
            </div>
            <ul className="service-list luxury-list dark-list">
              <li>{t('s2_li1')}</li>
              <li>{t('s2_li2')}</li>
              <li>{t('s2_li3')}</li>
              <li>{t('s2_li4')}</li>
              <li>{t('s2_li5')}</li>
              <li>{t('s2_li6')}</li>
              <li>{t('s2_li7')}</li>
              <li>{t('s2_li8')}</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Servicio 3: Desarrollo */}
      <section className="service-block dark-block" id="desarrollo">
        <div className="fluid-container service-grid">
          <motion.div 
            className="service-text-col"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="service-number">{t('s3_number')}</div>
            <h2>{t('s3_title')}</h2>
            <h3>{t('s3_subtitle')}</h3>
            <div className="service-divider"></div>
            <p>
              {t('s3_p1')}
            </p>
            <p>
              {t('s3_p2')}
            </p>
            <p>
              {t('s3_p3')}
            </p>
            <div className="quote-box">
              <svg className="quote-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 11L8 15H11V19H5V15L7 11H5V7H11V11H10ZM20 11L18 15H21V19H15V15L17 11H15V7H21V11H20Z" fill="currentColor"/></svg>
              <p>{t('s3_quote')}</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="service-list-col glass-panel"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              <h4>{t('s3_includes_title')}</h4>
            </div>
            <ul className="service-list luxury-list">
              <li>{t('s3_li1')}</li>
              <li>{t('s3_li2')}</li>
              <li>{t('s3_li3')}</li>
              <li>{t('s3_li4')}</li>
              <li>{t('s3_li5')}</li>
              <li>{t('s3_li6')}</li>
              <li>{t('s3_li7')}</li>
              <li>{t('s3_li8')}</li>
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="fluid-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>{t('cta_title')}</h2>
            <p>{t('cta_subtitle')}</p>
            <Link href="/empresas" className="btn-luxury-solid">
              {t('cta_btn')}
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

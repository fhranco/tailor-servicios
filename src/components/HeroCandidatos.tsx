'use client';

import React from 'react';
import { motion } from 'framer-motion';
import './HeroCandidatos.css';
import { useTranslations } from 'next-intl';

export default function HeroCandidatos() {
  const t = useTranslations('HeroCandidatos');
  return (
    <section className="hero-candidatos-section">
      <div 
        className="hero-candidatos-bg" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
      />
      <div className="hero-candidatos-overlay"></div>

      <div className="fluid-container hero-candidatos-content">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="hero-content"
          style={{ textAlign: 'left', margin: 0 }}
        >
          <div className="hero-badge">{t('badge')}</div>
          <h1 className="hero-title">
            {t('title1')} <span className="text-accent">{t('title_accent')}</span>
          </h1>
          <p className="hero-subtitle" style={{ margin: '0 0 2rem 0', maxWidth: '650px' }}>
            {t('subtitle')}
          </p>
          <div className="hero-candidatos-actions">
            <button className="hero-cta-btn" onClick={() => {
              const uploadSection = document.getElementById('subir-cv');
              uploadSection?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Únete a la Red
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

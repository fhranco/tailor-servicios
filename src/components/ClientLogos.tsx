"use client";

import React from 'react';
import './ClientLogos.css';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { CLIENT_LOGOS } from '@/data/clientLogos';

export default function ClientLogos() {
  const t = useTranslations('ClientLogos');

  return (
    <section className="client-logos-section">
      <div className="fluid-container">
        <motion.h3 
          className="logos-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t('title')}
        </motion.h3>
        
        <motion.div 
          className="marquee-container"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="marquee-track">
            {CLIENT_LOGOS.map((logo, index) => (
              <div className="logo-item" key={`track1-${logo.name}-${index}`}>
                <img 
                  src={logo.src} 
                  alt={logo.name}
                  title={logo.name}
                  className="premium-logo-img"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
          <div className="marquee-track" aria-hidden="true">
            {CLIENT_LOGOS.map((logo, index) => (
              <div className="logo-item" key={`track2-${logo.name}-${index}`}>
                <img 
                  src={logo.src} 
                  alt={logo.name}
                  title={logo.name}
                  className="premium-logo-img"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}


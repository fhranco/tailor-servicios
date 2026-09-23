"use client";

import React from 'react';
import './ClientLogos.css';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { CLIENT_LOGOS } from '@/data/clientLogos';

export default function ClientLogos() {
  const t = useTranslations('ClientLogos');

  // Dividir los logos en 2 filas balanceadas para evitar sobrepasar límites de textura de GPU y garantizar loop infinito perfecto
  const half = Math.ceil(CLIENT_LOGOS.length / 2);
  const row1 = CLIENT_LOGOS.slice(0, half);
  const row2 = CLIENT_LOGOS.slice(half);

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
      </div>

      <div className="marquee-wrapper">
        {/* Fila 1: Desplazamiento izquierda */}
        <div className="marquee-row marquee-row-left">
          <div className="marquee-track">
            {row1.map((logo, index) => (
              <div className="logo-item" key={`r1-t1-${logo.name}-${index}`}>
                <img 
                  src={logo.src} 
                  alt={logo.name}
                  title={logo.name}
                  className="premium-logo-img"
                  decoding="async"
                />
              </div>
            ))}
          </div>
          <div className="marquee-track" aria-hidden="true">
            {row1.map((logo, index) => (
              <div className="logo-item" key={`r1-t2-${logo.name}-${index}`}>
                <img 
                  src={logo.src} 
                  alt={logo.name}
                  title={logo.name}
                  className="premium-logo-img"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Fila 2: Desplazamiento derecha */}
        <div className="marquee-row marquee-row-right">
          <div className="marquee-track">
            {row2.map((logo, index) => (
              <div className="logo-item" key={`r2-t1-${logo.name}-${index}`}>
                <img 
                  src={logo.src} 
                  alt={logo.name}
                  title={logo.name}
                  className="premium-logo-img"
                  decoding="async"
                />
              </div>
            ))}
          </div>
          <div className="marquee-track" aria-hidden="true">
            {row2.map((logo, index) => (
              <div className="logo-item" key={`r2-t2-${logo.name}-${index}`}>
                <img 
                  src={logo.src} 
                  alt={logo.name}
                  title={logo.name}
                  className="premium-logo-img"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


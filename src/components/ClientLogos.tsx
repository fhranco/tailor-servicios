"use client";

import React from 'react';
import './ClientLogos.css';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function ClientLogos() {
  const t = useTranslations('ClientLogos');
  
  // Create an array of all 71 logos in public/Logos
  const totalLogosCount = 71;
  const logoPaths = Array.from(
    { length: totalLogosCount },
    (_, i) => `/Logos/${i + 1}.jpg`
  );

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
            {/* Render two sets for infinite scrolling marquee */}
            {[...logoPaths, ...logoPaths].map((path, index) => (
              <div className="logo-item" key={index}>
                <img 
                  src={path} 
                  alt={`Cliente ${index % totalLogosCount + 1}`}
                  className="premium-logo-img"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}


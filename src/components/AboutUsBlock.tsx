"use client";

import React from 'react';
import Link from 'next/link';
import './AboutUsBlock.css';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function AboutUsBlock() {
  const { scrollYProgress } = useScroll();
  const yImage = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const t = useTranslations('AboutUsBlock');

  return (
    <section className="about-section fluid-container">
      <motion.div 
        className="about-container"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        
        {/* Full background image */}
        <div className="about-image-wrapper">
          <motion.img 
            src="https://images.unsplash.com/photo-1542744094-3a31f272c490?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
            alt="Equipo de Tailor Servicios" 
            style={{
              scale: 1.2,
              y: yImage // Parallax effect
            }}
          />
          <div className="about-image-overlay"></div>
        </div>

        {/* Glassmorphism content block */}
        <motion.div 
          className="about-content glass-panel"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <h2>{t('title')}</h2>
          <p>
            {t('p1')}
          </p>
          <p dangerouslySetInnerHTML={{ __html: t.raw('p2') }} />
          
          <h3 className="about-features-title">
            {t('features_title')}
          </h3>
          
          <div className="about-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span className="feature-text">{t('f1')}</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span className="feature-text">{t('f2')}</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span className="feature-text">{t('f3')}</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span className="feature-text">{t('f4')}</span>
            </div>
          </div>
          
          <div style={{ marginTop: '3rem' }}>
            <Link href="/nosotros" className="btn btn-primary" style={{ display: 'inline-flex' }}>
              {t('cta')}
            </Link>
          </div>
        </motion.div>
        
      </motion.div>
    </section>
  );
}

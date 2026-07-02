"use client";

import React, { useRef } from 'react';
import './SpecialProject.css';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function SpecialProject() {
  const t = useTranslations('SpecialProject');
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Subtle parallax for the image
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section className="special-project-section" ref={containerRef}>
      <div className="fluid-container">
        <div className="sp-editorial-grid">
          
          {/* Image Column */}
          <div className="sp-image-col">
            <div className="sp-image-wrapper">
              <motion.div 
                className="sp-parallax-img"
                style={{ 
                  y: imgY,
                  backgroundImage: "url('/3c16830d40c984ccb5acb3c048afed1c69f7b508-12000x6750.webp')" 
                }}
              />
            </div>
          </div>

          {/* Text/Content Column */}
          <div className="sp-content-col">
            <motion.div 
              className="sp-content-inner"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="sp-badge">{t('badge')}</div>
              
              <div className="sp-logo-wrapper">
                <img src="/logo oscuro.png" alt="The Cormorant at 55 South" className="sp-hotel-logo" />
              </div>
              
              <h2 className="sp-title">{t('title')}</h2>
              
              <p className="sp-description">
                <span dangerouslySetInnerHTML={{ __html: t.raw('p1') }} />
                <br /><br />
                {t('p2')}
              </p>
              
              <a 
                href="https://serviciosindustrialetailor.rexmas.com/jobs/the-cormorant-at-55-south" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="sp-cta-btn"
              >
                {t('cta')} &rarr;
              </a>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

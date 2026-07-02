"use client";

import React from 'react';
import './ClientLogos.css';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

// Premium SVG placeholders
const Logo1 = () => (
  <svg viewBox="0 0 160 40" fill="currentColor" className="premium-logo">
    <path d="M10 20 L20 10 L30 20 L20 30 Z" />
    <path d="M22 20 L32 10 L42 20 L32 30 Z" opacity="0.6" />
    <text x="50" y="26" fontFamily="sans-serif" fontSize="18" fontWeight="800" letterSpacing="1">NEXUS</text>
  </svg>
);

const Logo2 = () => (
  <svg viewBox="0 0 160 40" fill="currentColor" className="premium-logo">
    <circle cx="20" cy="20" r="10" />
    <circle cx="35" cy="20" r="10" opacity="0.5" />
    <text x="55" y="26" fontFamily="serif" fontSize="18" fontStyle="italic" fontWeight="600">Aura Group</text>
  </svg>
);

const Logo3 = () => (
  <svg viewBox="0 0 160 40" fill="currentColor" className="premium-logo">
    <rect x="10" y="10" width="8" height="20" />
    <rect x="22" y="15" width="8" height="15" opacity="0.7" />
    <rect x="34" y="20" width="8" height="10" opacity="0.4" />
    <text x="52" y="26" fontFamily="sans-serif" fontSize="17" fontWeight="bold">SYNTHESIS</text>
  </svg>
);

const Logo4 = () => (
  <svg viewBox="0 0 160 40" fill="currentColor" className="premium-logo">
    <polygon points="25,10 10,30 40,30" />
    <text x="50" y="26" fontFamily="sans-serif" fontSize="18" fontWeight="700" letterSpacing="-0.5">Vanguard</text>
  </svg>
);

const Logo5 = () => (
  <svg viewBox="0 0 160 40" fill="currentColor" className="premium-logo">
    <path d="M10 20 Q 20 10, 30 20 T 50 20" stroke="currentColor" strokeWidth="4" fill="none" />
    <text x="60" y="26" fontFamily="sans-serif" fontSize="17" fontWeight="800">FLUENT</text>
  </svg>
);

export default function ClientLogos() {
  const t = useTranslations('ClientLogos');
  const logos = [<Logo1 key={1} />, <Logo2 key={2} />, <Logo3 key={3} />, <Logo4 key={4} />, <Logo5 key={5} />];
  
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
            {/* Render three sets for smooth infinite scroll illusion without jumps */}
            {[...logos, ...logos, ...logos].map((Logo, index) => (
              <div className="logo-item" key={index}>
                {Logo}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

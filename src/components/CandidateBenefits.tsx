'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import './CandidateBenefits.css';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function CandidateBenefits() {
  const t = useTranslations('CandidateBenefits');

  const benefits = [
    {
      id: 1,
      title: t('b1_title'),
      description: t('b1_desc'),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      )
    },
    {
      id: 2,
      title: t('b2_title'),
      description: t('b2_desc'),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      )
    },
    {
      id: 3,
      title: t('b3_title'),
      description: t('b3_desc'),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    }
  ];

  return (
    <section className="c-benefits-section">
      <div className="fluid-container">
        <div className="c-benefits-header">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.6 }}
          >
            <span className="c-benefits-subtitle">{t('subtitle')}</span>
            <h2 className="c-benefits-title">{t('title')}</h2>
          </motion.div>
        </div>

        <motion.div 
          className="c-benefits-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {benefits.map((benefit) => (
            <motion.div className="c-benefit-card" key={benefit.id} variants={itemVariants}>
              <div className="c-benefit-icon">
                {benefit.icon}
              </div>
              <h3 className="c-benefit-title">{benefit.title}</h3>
              <p className="c-benefit-desc">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

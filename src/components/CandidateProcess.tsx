'use client';

import React from 'react';
import { motion } from 'framer-motion';
import './CandidateProcess.css';
import { useTranslations } from 'next-intl';

export default function CandidateProcess() {
  const t = useTranslations('CandidateProcess');

  const steps = [
    {
      id: 1,
      title: t('s1_title'),
      description: t('s1_desc'),
      number: "01"
    },
    {
      id: 2,
      title: t('s2_title'),
      description: t('s2_desc'),
      number: "02"
    },
    {
      id: 3,
      title: t('s3_title'),
      description: t('s3_desc'),
      number: "03"
    },
    {
      id: 4,
      title: t('s4_title'),
      description: t('s4_desc'),
      number: "04"
    }
  ];

  return (
    <section className="c-process-section">
      <div className="fluid-container">
        <div className="c-process-layout">
          
          <motion.div 
            className="c-process-text"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="c-process-subtitle">{t('subtitle')}</span>
            <h2 className="c-process-title">{t('title')}</h2>
            <p className="c-process-desc">
              {t('desc')}
            </p>
          </motion.div>

          <div className="c-process-timeline">
            {steps.map((step, index) => (
              <motion.div 
                className="c-process-step" 
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="c-step-number">{step.number}</div>
                <div className="c-step-content">
                  <h3 className="c-step-title">{step.title}</h3>
                  <p className="c-step-desc">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

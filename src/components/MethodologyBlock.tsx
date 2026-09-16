"use client";

import React from 'react';
import { motion } from 'framer-motion';
import './MethodologyBlock.css';
import { useTranslations } from 'next-intl';

export default function MethodologyBlock() {
  const t = useTranslations('MethodologyBlock');

  const steps = [
    {
      number: t('step1_num'),
      title: t('step1_title'),
      description: t('step1_desc')
    },
    {
      number: t('step2_num'),
      title: t('step2_title'),
      description: t('step2_desc')
    },
    {
      number: t('step3_num'),
      title: t('step3_title'),
      description: t('step3_desc')
    }
  ];

  return (
    <section className="methodology-section">
      <div className="fluid-container">
        
        <div className="methodology-header">
          <motion.h2 
            className="methodology-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('title')}
          </motion.h2>
          <motion.p 
            className="methodology-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {t('subtitle')}
          </motion.p>
        </div>

        <div className="methodology-steps">
          {steps.map((step, index) => (
            <motion.div 
              className="methodology-step" 
              key={step.number}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}

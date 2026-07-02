"use client";

import React from 'react';
import './MetricsBar.css';
import { motion, useInView, animate } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef, useEffect } from 'react';

function AnimatedCounter({ from = 0, to, prefix = "", suffix = "", colorClass = "color-accent" }: { from?: number, to: number, prefix?: string, suffix?: string, colorClass?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (inView && nodeRef.current) {
      const controls = animate(from, to, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(value) {
          if (nodeRef.current) {
            nodeRef.current.textContent = `${prefix}${Math.round(value)}${suffix}`;
          }
        },
      });
      return () => controls.stop();
    }
  }, [from, to, inView, prefix, suffix]);

  return <span ref={nodeRef} className={`metric-number ${colorClass}`}>{prefix}{from}{suffix}</span>;
}

export default function MetricsBar() {
  const t = useTranslations('MetricsBar');

  return (
    <div className="metrics-container fluid-container">
      <motion.div 
        className="metrics-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.2 }
          }
        }}
      >
        <motion.div className="metric-item" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <AnimatedCounter to={9} prefix="+" colorClass="color-accent-tertiary" />
          <span className="metric-text">{t('anos')}</span>
        </motion.div>
        <motion.div className="metric-item" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <AnimatedCounter to={45} prefix="+" colorClass="color-accent-tertiary" />
          <span className="metric-text">{t('empresas')}</span>
        </motion.div>
        <motion.div className="metric-item" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <AnimatedCounter to={12} suffix="k+" colorClass="color-accent-tertiary" />
          <span className="metric-text">{t('profesionales')}</span>
        </motion.div>
        <motion.div className="metric-item" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <AnimatedCounter to={95} suffix="%" colorClass="color-accent-tertiary" />
          <span className="metric-text">{t('efectividad')}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

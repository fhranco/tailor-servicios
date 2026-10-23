"use client";

import React from 'react';
import './MetricsBar.css';
import { motion, useInView, animate } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef, useEffect } from 'react';

function AnimatedCounter({ 
  to, 
  prefix = "", 
  suffix = "", 
  colorClass = "color-accent" 
}: { 
  to: number; 
  prefix?: string; 
  suffix?: string; 
  colorClass?: string; 
}) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, amount: 0.3 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (inView && nodeRef.current && !hasAnimated.current) {
      hasAnimated.current = true;
      const controls = animate(0, to, {
        duration: 2.2,
        ease: "easeOut",
        onUpdate(value) {
          if (nodeRef.current) {
            nodeRef.current.textContent = `${prefix}${Math.round(value)}${suffix}`;
          }
        },
      });
      return () => controls.stop();
    }
  }, [to, inView, prefix, suffix]);

  return (
    <span ref={nodeRef} className={`metric-number ${colorClass}`}>
      {prefix}{to}{suffix}
    </span>
  );
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
          <AnimatedCounter to={20} prefix="+" colorClass="color-accent-tertiary" />
          <span className="metric-text">{t('anos')}</span>
        </motion.div>
        <motion.div className="metric-item" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <AnimatedCounter to={100} prefix="+" colorClass="color-accent-tertiary" />
          <span className="metric-text">{t('empresas')}</span>
        </motion.div>
        <motion.div className="metric-item" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <AnimatedCounter to={25} suffix="k+" colorClass="color-accent-tertiary" />
          <span className="metric-text">{t('profesionales')}</span>
        </motion.div>
        <motion.div className="metric-item" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <AnimatedCounter to={3} suffix="k+" colorClass="color-accent-tertiary" />
          <span className="metric-text">{t('seleccionadas')}</span>
        </motion.div>
        <motion.div className="metric-item" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <AnimatedCounter to={95} suffix="%" colorClass="color-accent-tertiary" />
          <span className="metric-text">{t('efectividad')}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import './HeroDual.css';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function HeroDual() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = useTranslations('HeroDual');

  const slides = [
    {
      id: 1,
      badge: t('slides.1.badge'),
      titleBase: t('slides.1.titleBase'),
      titleAccent: t('slides.1.titleAccent'),
      titleEnd: "",
      desc: t('slides.1.desc'),
      bg: "/impulsando-el-desarrollo.webp",
      thumb: "/impulsando-el-desarrollo.webp",
      align: "left",
      objectPosition: "center right"
    },
    {
      id: 2,
      badge: t('slides.2.badge'),
      titleBase: t('slides.2.titleBase'),
      titleAccent: t('slides.2.titleAccent'),
      titleEnd: "",
      desc: t('slides.2.desc'),
      bg: "/conectamos-talento.webp",
      thumb: "/conectamos-talento.webp",
      align: "left",
      objectPosition: "center right"
    },
    {
      id: 3,
      badge: t('slides.3.badge'),
      titleBase: t('slides.3.titleBase'),
      titleAccent: t('slides.3.titleAccent'),
      titleEnd: "",
      desc: t('slides.3.desc'),
      bg: "/soluciones-realidad.webp",
      thumb: "/soluciones-realidad.webp",
      align: "right",
      objectPosition: "20% center"
    }
  ];

  const currentAlign = slides[currentSlide].align || "left";

  return (
    <section className="hero-robert-wrapper">
      
      {/* Background Image */}
      <AnimatePresence mode="popLayout">
        <motion.div 
          key={slides[currentSlide].id}
          className="hero-bg-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img 
            src={slides[currentSlide].bg} 
            alt="Fondo Tailor" 
            className="hero-bg-image"
            style={{ objectPosition: slides[currentSlide].objectPosition || "center right" }}
          />
        </motion.div>
      </AnimatePresence>
      <div className={`hero-overlay overlay-${currentAlign}`}></div>
      
      {/* Content Block (Glassmorphism) */}
      <div className={`fluid-container hero-container-layout layout-${currentAlign}`}>
        <div className={`hero-content-block ${currentAlign === 'right' ? 'hero-content-right' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={slides[currentSlide].id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="hero-slide-content"
            >
              <div className="hero-accent-shape"></div>
              <div className="hero-badge">{slides[currentSlide].badge}</div>
              <h1 className="hero-title" style={{ marginTop: '1rem' }}>
                {slides[currentSlide].titleBase}
                <span className="text-accent">{slides[currentSlide].titleAccent}</span>
                {slides[currentSlide].titleEnd}
              </h1>
              <p className="hero-desc">{slides[currentSlide].desc}</p>
            </motion.div>
          </AnimatePresence>
          
          <div className="hero-buttons">
            <Link 
              href="/candidatos" 
              className="btn btn-primary"
            >
              {t('cta_candidatos')}
            </Link>
            <Link href="/empresas" className="btn btn-outline">
              {t('cta_empresas')}
            </Link>
          </div>
          
          <div className="hero-footer-text">
            {t('footer_text')}
          </div>
        </div>
      </div>
      
      {/* Thumbnails Row */}
      <div className="hero-thumbnails">
        {slides.map((slide, idx) => (
          <button 
            key={slide.id}
            className={`hero-thumb-btn ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Ver slide ${idx + 1}`}
          >
            <img src={slide.thumb} alt={`Miniatura ${idx + 1}`} />
            <div className="hero-thumb-progress">
              {idx === currentSlide && (
                <motion.div 
                  className="hero-thumb-progress-bar"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>
          </button>
        ))}
      </div>

    </section>
  );
}

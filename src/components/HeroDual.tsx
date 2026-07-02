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
      bg: "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      thumb: "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 2,
      badge: t('slides.2.badge'),
      titleBase: t('slides.2.titleBase'),
      titleAccent: t('slides.2.titleAccent'),
      titleEnd: "",
      desc: t('slides.2.desc'),
      bg: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      thumb: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 3,
      badge: t('slides.3.badge'),
      titleBase: t('slides.3.titleBase'),
      titleAccent: t('slides.3.titleAccent'),
      titleEnd: "",
      desc: t('slides.3.desc'),
      bg: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      thumb: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ];



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
          transition={{ duration: 1 }}
        >
          <img 
            src={slides[currentSlide].bg} 
            alt="Fondo Tailor" 
            className="hero-bg-image"
          />
        </motion.div>
      </AnimatePresence>
      <div className="hero-overlay"></div>
      
      {/* Center Content Block (Glassmorphism) */}
      <div className="hero-content-block">
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
          <Link href="/postulantes" className="btn btn-primary">
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

"use client";

import React, { useState } from 'react';
import './HeroDual.css';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function HeroDual() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
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

  const handleSlideSelect = (idx: number) => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    setCurrentSlide(idx);
  };

  const currentAlign = slides[currentSlide].align || "left";

  return (
    <section className="hero-robert-wrapper">
      
      {/* Background Image: Pure static container on initial paint (zero Framer Motion dependency on critical path) */}
      {!hasInteracted ? (
        <div className="hero-bg-container">
          <Image 
            src={slides[0].bg} 
            alt="Fondo Tailor" 
            fill
            priority
            sizes="100vw"
            quality={80}
            className="hero-bg-image"
            style={{ 
              objectFit: 'cover',
              objectPosition: slides[0].objectPosition || "center right" 
            }}
          />
        </div>
      ) : (
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div 
            key={slides[currentSlide].id}
            className="hero-bg-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image 
              src={slides[currentSlide].bg} 
              alt="Fondo Tailor" 
              fill
              priority={currentSlide === 0}
              sizes="100vw"
              quality={80}
              className="hero-bg-image"
              style={{ 
                objectFit: 'cover',
                objectPosition: slides[currentSlide].objectPosition || "center right" 
              }}
            />
          </motion.div>
        </AnimatePresence>
      )}
      <div className={`hero-overlay overlay-${currentAlign}`}></div>
      
      {/* Content Block (Glassmorphism) - Static SSR container on initial load, animated on slide changes */}
      <div className={`fluid-container hero-container-layout layout-${currentAlign}`}>
        <div className={`hero-content-block ${currentAlign === 'right' ? 'hero-content-right' : ''}`}>
          {!hasInteracted ? (
            <div className="hero-slide-content">
              <div className="hero-accent-shape"></div>
              <div className="hero-badge">{slides[0].badge}</div>
              <h1 className="hero-title" style={{ marginTop: '1rem' }}>
                {slides[0].titleBase}
                <span className="text-accent">{slides[0].titleAccent}</span>
                {slides[0].titleEnd}
              </h1>
              <p className="hero-desc">{slides[0].desc}</p>
            </div>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
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
          )}
          
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
            onClick={() => handleSlideSelect(idx)}
            aria-label={`Ver slide ${idx + 1}`}
          >
            <Image 
              src={slide.thumb} 
              alt={`Miniatura ${idx + 1}`} 
              width={90}
              height={54}
              loading="lazy"
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
            <div className="hero-thumb-progress">
              {idx === currentSlide && (
                hasInteracted ? (
                  <motion.div 
                    className="hero-thumb-progress-bar"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                ) : (
                  <div className="hero-thumb-progress-bar" style={{ width: '100%' }} />
                )
              )}
            </div>
          </button>
        ))}
      </div>

    </section>
  );
}



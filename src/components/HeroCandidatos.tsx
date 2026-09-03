'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './HeroCandidatos.css';
import { useTranslations } from 'next-intl';

export default function HeroCandidatos() {
  const t = useTranslations('HeroCandidatos');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <section className="hero-candidatos-section">
      <div 
        className="hero-candidatos-bg" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
      />
      <div className="hero-candidatos-overlay"></div>

      <div className="fluid-container hero-candidatos-content">
        <div className="hero-candidatos-grid">
          
          {/* Columna Izquierda: Información & Acceso Primario Rex+ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hero-left-col"
          >
            <div className="hero-badge">{t('badge')}</div>
            <h1 className="hero-candidatos-title">
              {t('title1')} <span className="text-accent">{t('title_accent')}</span>
            </h1>
            <p className="hero-candidatos-description">
              {t('subtitle')}
            </p>

            {/* Acceso Primario Destacado: Portal General de Ofertas Laborales (Rex+) */}
            {/* Se elimina cualquier botón secundario confuso ("Postular con Taylor Servicios") */}
            <div className="hero-candidatos-actions">
              <a 
                href="https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hero-cta-btn-primary"
              >
                <span>Acceder al Portal General de Empleos (Rex+)</span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>

            <div className="hero-features-strip">
              <div className="feature-pill">
                <span className="pill-dot"></span>
                <span>Procesos 100% Confidenciales</span>
              </div>
              <div className="feature-pill">
                <span className="pill-dot"></span>
                <span>Plataforma Oficial Rex+</span>
              </div>
              <div className="feature-pill">
                <span className="pill-dot"></span>
                <span>Seguimiento en Tiempo Real</span>
              </div>
            </div>
          </motion.div>

          {/* Columna Derecha: Video Explicativo / Tutorial para Postulantes */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="hero-video-col"
          >
            <div className="hero-video-card">
              <div className="hero-video-card-header">
                <div className="video-header-left">
                  <span className="video-pill">Video Tutorial</span>
                  <span className="video-card-title">Guía para Postulantes</span>
                </div>
                <span className="video-duration">Tutorial Oficial</span>
              </div>

              <div className="hero-video-player-wrapper" onClick={toggleVideo}>
                <video 
                  ref={videoRef}
                  className="hero-video-element"
                  src="/hero-video.mp4"
                  poster="/scratch/hero_frame.jpg"
                  controls={isPlaying}
                  playsInline
                  onEnded={() => setIsPlaying(false)}
                />

                {!isPlaying && (
                  <div className="video-play-overlay">
                    <button className="video-play-btn" aria-label="Reproducir video tutorial">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="6 3 20 12 6 21 6 3"></polygon>
                      </svg>
                    </button>
                    <span className="video-play-label">Haz clic para reproducir el video explicativo</span>
                  </div>
                )}
              </div>

              <div className="hero-video-card-footer">
                <p>
                  Conoce cómo explorar nuestras vacantes, crear tu perfil en Rex+ y postular a cargos directivos, técnicos y operativos en el sur de Chile.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

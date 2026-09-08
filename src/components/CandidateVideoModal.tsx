'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CandidateVideoModal.css';

interface CandidateVideoModalProps {
  videoSrc?: string;
  delayMs?: number;
}

export default function CandidateVideoModal({
  videoSrc = '/TAILOR2.mp4',
  delayMs = 1200,
}: CandidateVideoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Abrir automáticamente la primera vez que visita la página de candidatos en la sesión
    const hasSeen = typeof window !== 'undefined' ? sessionStorage.getItem('tailor_candidate_video_seen') : null;
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('tailor_candidate_video_seen', 'true');
      }, delayMs);
      return () => clearTimeout(timer);
    }
  }, [delayMs]);

  // Permitir reabrir el popup desde cualquier botón o card de la página
  useEffect(() => {
    const handleOpenRequest = () => setIsOpen(true);
    window.addEventListener('open-candidate-video', handleOpenRequest);
    return () => window.removeEventListener('open-candidate-video', handleOpenRequest);
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="candidate-modal-overlay" onClick={handleClose}>
          <motion.div 
            className="candidate-modal-container"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Mensaje inspiracional para postulantes"
          >
            {/* Header del modal */}
            <div className="candidate-modal-header">
              <div className="modal-title-box">
                <span className="modal-badge">✨ Mensaje para Ti</span>
                <h3 className="modal-title">Tu talento puede transformar tu futuro</h3>
              </div>
              <button 
                className="modal-close-btn" 
                onClick={handleClose}
                aria-label="Cerrar video"
                title="Cerrar ventana"
              >
                ✕
              </button>
            </div>

            {/* Video Player */}
            <div className="candidate-modal-video-wrapper">
              <video 
                ref={videoRef}
                src={videoSrc}
                poster="/tailor2_cover.jpg"
                controls
                autoPlay
                playsInline
                className="candidate-modal-video"
              />
            </div>

            {/* Footer con CTA directo al portal de empleo Rex+ */}
            <div className="candidate-modal-footer">
              <p className="modal-footer-text">
                Detrás de cada oportunidad laboral hay personas comprometidas con su crecimiento. Da el siguiente gran paso en tu carrera junto a Tailor Servicios.
              </p>
              <div className="modal-footer-actions">
                <button className="modal-btn-secondary" onClick={handleClose}>
                  Continuar explorando
                </button>
                <a 
                  href="https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="modal-btn-primary"
                  onClick={handleClose}
                >
                  Ver Oportunidades Laborales →
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

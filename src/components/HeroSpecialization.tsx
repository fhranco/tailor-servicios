"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import './HeroSpecialization.css';

const heroImages = [
  "https://images.unsplash.com/photo-1524824267900-2fa9cbf7a506?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Acuicultura: Trabajador pesquero con redes
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Energía: Ingeniera industrial con casco
  "https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Logística: Trabajador de almacén
  "https://images.unsplash.com/photo-1556745753-b2904692b3cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"  // Turismo: Recepcionista / Hospitalidad
];

export default function HeroSpecialization() {
  const containerRef = useRef<HTMLElement>(null);
  const [currentImage, setCurrentImage] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Rotar imágenes cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-spec-section" ref={containerRef}>
      {/* Background Slider */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentImage}
          className="hero-spec-bg" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          style={{ 
            y: bgY,
            backgroundImage: `url('${heroImages[currentImage]}')` 
          }}
        />
      </AnimatePresence>
      <div className="hero-spec-overlay"></div>

      <div className="fluid-container hero-spec-content">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="hero-content"
          style={{ textAlign: 'left', margin: 0 }}
        >
          <div className="hero-badge">Sectores Clave</div>
          <h1 className="hero-title">
            TALENTO PARA LAS INDUSTRIAS QUE MUEVEN LA <span className="text-accent">REGIÓN</span>
          </h1>
          <p className="hero-subtitle" style={{ margin: '0 0 2rem 0', maxWidth: '650px' }}>
            En Tailor Servicios no solo reclutamos; entendemos la operación técnica y estratégica de los sectores más desafiantes del extremo sur de Chile. Nuestro modelo garantiza profesionales con el calce exacto para tu rubro.
          </p>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="mouse"></div>
      </div>
    </section>
  );
}

"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ValuesSection.css';

interface ValueItem {
  id: number;
  title: string;
  definition: string;
  colorClass: string;
  icon: React.ReactNode;
}

export default function ValuesSection() {
  const [selectedValue, setSelectedValue] = useState<ValueItem | null>(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const values: ValueItem[] = [
    {
      id: 1,
      title: "Socio Estratégico",
      colorClass: "red",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="value-icon">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <circle cx="12" cy="12" r="2"></circle>
        </svg>
      ),
      definition: "Nuestro compromiso es con la productividad y la rentabilidad de nuestros clientes, a quienes asesoramos para mejorar sus resultados desde su propia cultura organizacional y las necesidades del mercado, velando por sus objetivos e intereses organizacionales."
    },
    {
      id: 2,
      title: "Profesionalismo",
      colorClass: "green",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="value-icon">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="m9 11 2 2 4-4"></path>
        </svg>
      ),
      definition: "Consideramos a los mejores profesionales para conformar nuestro equipo de trabajo, cada uno experto en su área y con la preparación y años de experiencia que avalan su trabajo."
    },
    {
      id: 3,
      title: "Innovación",
      colorClass: "blue",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="value-icon">
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .6 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
          <path d="M9 18h6"></path>
          <path d="M10 22h4"></path>
        </svg>
      ),
      definition: "En los planes de trabajo que generamos para nuestros clientes, buscamos incorporar instrumentos o técnicas innovadoras que sean tendencia en otros lugares, y que, claramente, entreguen los resultados esperados."
    },
    {
      id: 4,
      title: "Calidad de Servicio",
      colorClass: "yellow",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="value-icon">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      ),
      definition: "Compromiso de responder a nuestros clientes con los mejores estándares y la optimización de sus propios procesos, agregando valor a sus organizaciones and colaborando en la gestión del cambio de cada una de ellas."
    },
    {
      id: 5,
      title: "Comunicación",
      colorClass: "orange",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="value-icon">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
      definition: "Para un trabajo impecable, será siempre vital el mantener una constante y fluida comunicación con nuestros clientes."
    },
    {
      id: 6,
      title: "Compromiso y Confidencialidad",
      colorClass: "gray",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="value-icon">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      ),
      definition: "Nos comprometemos con las metas de nuestros clientes, sus resultados, pero también con el resguardo de la información a la cual tenemos acceso."
    }
  ];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft;
    // Calculate index based on container offset width and padding
    const containerWidth = container.offsetWidth;
    const cardStep = containerWidth * 0.8;
    const index = Math.round(scrollPosition / cardStep);
    setActiveMobileIndex(Math.min(Math.max(index, 0), values.length - 1));
  };

  const scrollToCard = (index: number) => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const cardElement = container.children[index] as HTMLElement;
      if (cardElement) {
        container.scrollTo({
          left: cardElement.offsetLeft - 32, // 32px is 2rem padding
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <section className="values-section">
      <div className="fluid-container">
        <div className="values-header">
          <span className="values-badge">Nuestros Pilares</span>
          <h2 className="values-main-title">Nuestros Valores</h2>
          <p className="values-intro-text">
            Principios que orientan nuestra forma de trabajar y nuestra relación con cada organización.
          </p>
        </div>

        {/* Layout de Escritorio y Tablet: Distribución Circular en torno al Propósito */}
        <div className="values-desktop-layout">
          <div className="values-circular-composition">
            {/* Elemento Central */}
            <div className="center-motto-circle">
              <div className="motto-content">
                <span className="motto-small">Propósito</span>
                <span className="motto-large">Impulsando el desarrollo en Magallanes</span>
              </div>
            </div>

            {/* Distribución de Valores */}
            {values.map((value, index) => (
              <motion.button
                key={value.id}
                className={`value-circle-btn pos-${index + 1} accent-${value.colorClass}`}
                onClick={() => setSelectedValue(value)}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.08, translateY: -5 }}
              >
                <div className="value-circle-inner">
                  <div className="value-circle-icon-box">
                    {value.icon}
                  </div>
                  <span className="value-circle-title">{value.title}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Layout Móvil: Slider Horizontal Snap */}
        <div className="values-mobile-layout">
          <div 
            className="values-slider-container"
            ref={sliderRef}
            onScroll={handleScroll}
          >
            {values.map((value) => (
              <div 
                key={value.id} 
                className={`value-slider-card accent-${value.colorClass}`}
                onClick={() => setSelectedValue(value)}
              >
                <div className="value-card-inner">
                  <div className="value-card-top">
                    <div className="value-card-icon-box">
                      {value.icon}
                    </div>
                    <h3 className="value-card-title">{value.title}</h3>
                  </div>
                  <p className="value-card-preview">
                    {value.definition.length > 70 
                      ? `${value.definition.substring(0, 70)}...` 
                      : value.definition}
                  </p>
                  <span className="value-card-action">Ver definición completa →</span>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator for Mobile Navigation */}
          <div className="slider-dots">
            {values.map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${activeMobileIndex === index ? 'active' : ''}`}
                onClick={() => scrollToCard(index)}
                aria-label={`Ir al valor ${index + 1}`}
              />
            ))}
          </div>

          <div className="mobile-motto-banner">
            <span>Propósito: Impulsando el desarrollo en Magallanes</span>
          </div>
        </div>
      </div>

      {/* Modal Popup para la Definición */}
      <AnimatePresence>
        {selectedValue && (
          <motion.div 
            className="value-popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedValue(null)}
          >
            <motion.div 
              className={`value-popup-box accent-${selectedValue.colorClass}`}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="popup-close-btn" onClick={() => setSelectedValue(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="close-icon">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              <div className="popup-content">
                <div className="popup-icon-wrapper">
                  {selectedValue.icon}
                </div>
                <h3 className="popup-value-title">{selectedValue.title}</h3>
                <div className="popup-divider"></div>
                <p className="popup-value-desc">{selectedValue.definition}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

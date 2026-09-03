"use client";

import React, { useRef, useState } from 'react';
import './TestimonialSection.css';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export interface TestimonialItem {
  id: string | number;
  nombre: string;
  cargo: string;
  empresa: string;
  comentario: string;
  avatar?: string; // URL de fotografía del cliente / ejecutivo
  logo?: string;   // URL de logotipo corporativo de la empresa
  rating?: number; // 1 a 5 estrellas (opcional, default 5)
}

export default function TestimonialSection() {
  const t = useTranslations('TestimonialSection');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [activeIndex, setActiveIndex] = useState(0);

  // 6 Testimonios preparados con la estructura requerida:
  // { nombre, cargo, empresa, comentario, avatar/logo }
  const testimonials: TestimonialItem[] = [
    {
      id: 1,
      nombre: "Carolina Mendoza",
      cargo: "Directora de RR.HH.",
      empresa: "Líder en Energía",
      comentario: t('t1_quote') || "Tailor entendió nuestra cultura corporativa desde el primer día. Los ejecutivos que reclutaron compartían nuestra visión de negocio. Redujimos nuestra rotación en un 40%.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      logo: "", // Pendiente asset definitivo
      rating: 5
    },
    {
      id: 2,
      nombre: "Ricardo Álvarez",
      cargo: "Gerente General",
      empresa: "Servicios Industriales",
      comentario: t('t2_quote') || "El diagnóstico de clima laboral fue revelador. Logramos alinear a nuestros líderes y aumentar la productividad de los equipos de forma impresionante.",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      logo: "", // Pendiente asset definitivo
      rating: 5
    },
    {
      id: 3,
      nombre: "Patricia Loyola",
      cargo: "Gerente de Operaciones",
      empresa: "Logística y Transporte",
      comentario: t('t3_quote') || "Buscábamos talento muy específico para operaciones extremas. Tailor Servicios nos entregó candidatos excepcionales en tiempo récord.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      logo: "", // Pendiente asset definitivo
      rating: 5
    },
    {
      id: 4,
      nombre: "Felipe Contreras",
      cargo: "VP de Personas",
      empresa: "Holding Financiero",
      comentario: t('t4_quote') || "Diseñaron un sistema de gestión de desempeño a nuestra medida. Pasamos de evaluaciones anuales burocráticas a un modelo ágil y motivador.",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      logo: "", // Pendiente asset definitivo
      rating: 5
    },
    {
      id: 5,
      nombre: "Andrea Varas",
      cargo: "Subgerente de Desarrollo",
      empresa: "Consumo Masivo",
      comentario: t('t5_quote') || "El proceso de outplacement que gestionaron para nuestros ejecutivos salientes fue impecable. Muy humanos y orientados a resultados reales en el mercado.",
      avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      logo: "", // Pendiente asset definitivo
      rating: 5
    },
    {
      id: 6,
      nombre: "Gonzalo Ibarra",
      cargo: "CEO",
      empresa: "Start-up Tecnológica",
      comentario: t('t6_quote') || "Nos ayudaron a estructurar toda la gerencia comercial desde cero. Su conocimiento del mercado laboral y su metodología de evaluación son inigualables.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      logo: "", // Pendiente asset definitivo
      rating: 5
    }
  ];

  // Obtener iniciales para avatar de respaldo
  const getInitials = (nombre: string) => {
    return nombre
      .split(' ')
      .map(part => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Scroll horizontal en carrusel
  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const cards = scrollRef.current.querySelectorAll('.testimonial-card');
    if (cards[index]) {
      (cards[index] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      setActiveIndex(index);
    }
  };

  const handlePrev = () => {
    const prev = activeIndex > 0 ? activeIndex - 1 : testimonials.length - 1;
    scrollToIndex(prev);
  };

  const handleNext = () => {
    const next = activeIndex < testimonials.length - 1 ? activeIndex + 1 : 0;
    scrollToIndex(next);
  };

  // Detectar card visible al hacer scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const center = container.scrollLeft + container.offsetWidth / 2;
    const cards = container.querySelectorAll('.testimonial-card');
    
    let closestIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, idx) => {
      const cardEl = card as HTMLElement;
      const cardCenter = cardEl.offsetLeft + cardEl.offsetWidth / 2;
      const distance = Math.abs(center - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    setActiveIndex(closestIndex);
  };

  return (
    <section className="testimonial-section" id="testimonios">
      <div className="testimonial-bg-accent"></div>
      
      <div className="fluid-container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="testimonial-header-wrapper">
          <div className="testimonial-header">
            <motion.h2 
              className="section-title text-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              {t('title') || "Casos de Éxito"}
            </motion.h2>
            <motion.p 
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t('subtitle') || "Resultados medibles y relaciones de largo plazo. Desliza para leer más."}
            </motion.p>
          </div>

          {/* Selector de modo y botones de navegación */}
          <div className="testimonial-controls">
            <div className="view-toggle" role="group" aria-label="Modo de visualización">
              <button 
                className={`toggle-btn ${viewMode === 'carousel' ? 'active' : ''}`}
                onClick={() => setViewMode('carousel')}
                title="Vista Carrusel"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M7 15V9" />
                  <path d="M12 15V9" />
                  <path d="M17 15V9" />
                </svg>
                <span>Carrusel</span>
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Vista Cuadrícula"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
                <span>Cuadrícula</span>
              </button>
            </div>

            {viewMode === 'carousel' && (
              <div className="carousel-nav-arrows">
                <button 
                  className="nav-arrow-btn" 
                  onClick={handlePrev} 
                  aria-label="Testimonio anterior"
                  title="Anterior"
                >
                  ‹
                </button>
                <button 
                  className="nav-arrow-btn" 
                  onClick={handleNext} 
                  aria-label="Testimonio siguiente"
                  title="Siguiente"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Vista Carrusel */}
        {viewMode === 'carousel' ? (
          <div className="carousel-wrapper">
            <div 
              ref={scrollRef} 
              className="carousel-track"
              onScroll={handleScroll}
            >
              {testimonials.map((test, index) => (
                <div 
                  className={`testimonial-card glass-panel ${index === activeIndex ? 'is-active' : ''}`} 
                  key={test.id}
                  onClick={() => scrollToIndex(index)}
                >
                  <div className="card-top-row">
                    <div className="quote-icon">“</div>
                    <div className="stars" aria-label={`${test.rating || 5} de 5 estrellas`}>
                      {'★'.repeat(test.rating || 5)}
                    </div>
                  </div>

                  <p className="testimonial-text">
                    "{test.comentario}"
                  </p>
                  
                  <div className="testimonial-author">
                    {test.avatar ? (
                      <div 
                        className="author-image" 
                        style={{ backgroundImage: `url(${test.avatar})` }}
                        role="img"
                        aria-label={`Foto de ${test.nombre}`}
                      />
                    ) : (
                      <div className="author-initials" aria-label={`Iniciales de ${test.nombre}`}>
                        {getInitials(test.nombre)}
                      </div>
                    )}

                    <div className="author-info">
                      <h4 className="author-name">{test.nombre}</h4>
                      <span className="author-role">{test.cargo}</span>
                      <div className="author-company-row">
                        <span className="author-company">{test.empresa}</span>
                        {test.logo && (
                          <img 
                            src={test.logo} 
                            alt={`Logo ${test.empresa}`} 
                            className="company-logo-micro" 
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots indicadores de carrusel */}
            <div className="carousel-dots" role="tablist" aria-label="Indicadores de testimonios">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  className={`carousel-dot ${idx === activeIndex ? 'active' : ''}`}
                  onClick={() => scrollToIndex(idx)}
                  aria-label={`Ir al testimonio ${idx + 1}`}
                  role="tab"
                  aria-selected={idx === activeIndex}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Vista Cuadrícula (Grid) */
          <div className="testimonial-grid">
            {testimonials.map((test) => (
              <div 
                className="testimonial-card glass-panel grid-card" 
                key={test.id}
              >
                <div className="card-top-row">
                  <div className="quote-icon">“</div>
                  <div className="stars" aria-label={`${test.rating || 5} de 5 estrellas`}>
                    {'★'.repeat(test.rating || 5)}
                  </div>
                </div>

                <p className="testimonial-text">
                  "{test.comentario}"
                </p>
                
                <div className="testimonial-author">
                  {test.avatar ? (
                    <div 
                      className="author-image" 
                      style={{ backgroundImage: `url(${test.avatar})` }}
                      role="img"
                      aria-label={`Foto de ${test.nombre}`}
                    />
                  ) : (
                    <div className="author-initials" aria-label={`Iniciales de ${test.nombre}`}>
                      {getInitials(test.nombre)}
                    </div>
                  )}

                  <div className="author-info">
                    <h4 className="author-name">{test.nombre}</h4>
                    <span className="author-role">{test.cargo}</span>
                    <div className="author-company-row">
                      <span className="author-company">{test.empresa}</span>
                      {test.logo && (
                        <img 
                          src={test.logo} 
                          alt={`Logo ${test.empresa}`} 
                          className="company-logo-micro" 
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

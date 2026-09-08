"use client";

import React, { useState } from 'react';
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
  const [viewMode, setViewMode] = useState<'marquee' | 'grid'>('marquee');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSlow, setIsSlow] = useState(false);

  // 4 Testimonios reales de clientes y aliados estratégicos:
  const testimonials: TestimonialItem[] = [
    {
      id: 1,
      nombre: t('t1_name') || "Ximena Castro R.",
      cargo: t('t1_role') || "Gerente General",
      empresa: t('t1_company') || "Parque del Estrecho",
      comentario: t('t1_quote') || "Hemos tenido una experiencia altamente positiva al trabajar con Tailor Servicios. Su capacidad para identificar talento y conectarlo con nuestras necesidades ha sido fundamental para cubrir puestos clave y fortalecer nuestro equipo.",
      avatar: "",
      logo: "",
      rating: 5
    },
    {
      id: 2,
      nombre: t('t2_name') || "Joaquín Vásquez E.",
      cargo: t('t2_role') || "Gerente General",
      empresa: t('t2_company') || "IMPA",
      comentario: t('t2_quote') || "Pudimos liberar muchas horas de los mandos medios para enfocarse en los objetivos del negocio, nos han ayudado a ser más eficientes en el manejo documental de Recursos Humanos. Tailor ha generado un avance tremendo en nuestra área de Recursos Humanos, estamos muy contentos de trabajar con ellos.",
      avatar: "",
      logo: "",
      rating: 5
    },
    {
      id: 3,
      nombre: t('t3_name') || "Gabriela Peric U.",
      cargo: t('t3_role') || "Subgerente de Gestión de Personas",
      empresa: t('t3_company') || "Sánchez y Sánchez",
      comentario: t('t3_quote') || "El trabajo en conjunto con Tailor nos ha permitido concretar nuestras ideas de la mejor manera, lo que sin duda beneficia a todos nuestros colaboradores. La seriedad, compromiso y responsabilidad de Tailor son sus principales valores demostrados, y que a nosotros como clientes nos da seguridad de que el trabajo será exitoso… cumpliendo nuestras expectativas y las de quienes participan.",
      avatar: "",
      logo: "",
      rating: 5
    },
    {
      id: 4,
      nombre: t('t4_name') || "Kriss Castro",
      cargo: t('t4_role') || "Gerente Comercial",
      empresa: t('t4_company') || "Mutual de Seguridad",
      comentario: t('t4_quote') || "Con Tailor Servicios contamos con un Convenio de Colaboración, gracias a su conocimiento y experiencia hemos otorgado herramientas a los equipos de trabajo de nuestros adherentes para generar entornos laborales saludables y seguros para evitar enfermedades laborales.",
      avatar: "",
      logo: "",
      rating: 5
    }
  ];

  // Duplicamos 4 veces para garantizar un bucle infinito continuo (sin costuras) en monitores 4K / Ultrawide
  const marqueeCards = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

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

  const renderCard = (test: TestimonialItem, uniqueKey: string | number) => (
    <div 
      className="testimonial-card glass-panel" 
      key={uniqueKey}
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
  );

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
              {t('subtitle') || "Resultados medibles y relaciones de largo plazo en Magallanes."}
            </motion.p>
          </div>

          {/* Selector de modo y controles de animación */}
          <div className="testimonial-controls">
            <div className="view-toggle" role="group" aria-label="Modo de visualización">
              <button 
                className={`toggle-btn ${viewMode === 'marquee' ? 'active' : ''}`}
                onClick={() => setViewMode('marquee')}
                title="Vista Marquesina Continua"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12h16M4 12l4-4m-4 4l4 4M20 12l-4-4m4 4l-4 4" />
                </svg>
                <span>Marquesina</span>
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

            {viewMode === 'marquee' && (
              <div className="marquee-controls-group">
                <button 
                  className={`nav-arrow-btn play-pause-btn ${!isPlaying ? 'paused' : ''}`}
                  onClick={() => setIsPlaying(!isPlaying)} 
                  aria-label={isPlaying ? "Pausar marquesina" : "Reanudar marquesina"}
                  title={isPlaying ? "Pausar marquesina" : "Reanudar marquesina"}
                >
                  {isPlaying ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="5" y="4" width="4" height="16" rx="1" />
                      <rect x="15" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}>
                      <polygon points="6 4 20 12 6 20 6 4" />
                    </svg>
                  )}
                </button>
                <button 
                  className={`speed-toggle-btn ${isSlow ? 'active' : ''}`}
                  onClick={() => setIsSlow(!isSlow)}
                  title="Cambiar velocidad"
                >
                  {isSlow ? "Lenta" : "Normal"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Vista Marquesina Sin Fin */}
        {viewMode === 'marquee' ? (
          <div className="testimonial-marquee-wrapper">
            <div 
              className={`testimonial-marquee-track ${!isPlaying ? 'is-paused' : ''} ${isSlow ? 'is-slow' : ''}`}
            >
              {marqueeCards.map((test, index) => renderCard(test, `marquee-${test.id}-${index}`))}
            </div>

            <div className="marquee-hint-wrapper">
              <span className="marquee-hint-text">
                💡 Pasa el cursor sobre cualquier testimonio para pausar y leer
              </span>
            </div>
          </div>
        ) : (
          /* Vista Cuadrícula (Grid) */
          <div className="testimonial-grid">
            {testimonials.map((test) => (
              <div key={`grid-${test.id}`} className="grid-item-wrapper">
                {renderCard(test, `grid-card-${test.id}`)}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

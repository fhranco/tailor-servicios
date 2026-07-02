"use client";

import React, { useState, useEffect } from 'react';
import './BusinessLines.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type ServiceKey = 'reclutamiento' | 'gestion' | 'desarrollo';

const servicesData: Record<ServiceKey, any> = {
  reclutamiento: {
    title: "Reclutamiento y Selección",
    shortDesc: "Encontramos a las personas que harán crecer su organización. Identificamos talento que aporte valor y resultados sostenibles.",
    longDesc: "Nuestro proceso de Reclutamiento y Selección no se basa solo en habilidades técnicas, sino en el encaje cultural y el potencial de desarrollo. Realizamos un levantamiento exhaustivo del perfil, utilizamos redes de contacto especializadas y aplicamos evaluaciones por competencias para asegurar que el candidato no solo pueda hacer el trabajo, sino que se alinee con la visión de su empresa.",
    benefits: [
      "Levantamiento de perfil profundo y a medida.",
      "Evaluaciones por competencias y psicolaborales.",
      "Garantía de reposición ante desvinculaciones.",
      "Red de talento en todo Chile, con foco en Magallanes y Santiago."
    ],
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    color: "var(--color-accent)"
  },
  gestion: {
    title: "Gestión de Personas",
    shortDesc: "Transformamos la gestión de recursos humanos en una ventaja competitiva equilibrando bienestar y productividad.",
    longDesc: "Diseñamos políticas y prácticas que ponen a las personas en el centro sin perder de vista los objetivos del negocio. Desde la evaluación del desempeño hasta planes de compensación y beneficios, nuestro enfoque estructurado permite a las empresas retener el talento crítico y mantener altos niveles de motivación y compromiso.",
    benefits: [
      "Sistemas de evaluación de desempeño continuos.",
      "Diseño de estructuras de compensación y beneficios.",
      "Planes de carrera y sucesión.",
      "Asesoría laboral y cumplimiento normativo."
    ],
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    color: "var(--color-accent-secondary)"
  },
  desarrollo: {
    title: "Desarrollo Organizacional",
    shortDesc: "Entregamos herramientas para optimizar el funcionamiento de su organización, analizando y mejorando el clima laboral.",
    longDesc: "Las organizaciones son ecosistemas vivos que requieren adaptación constante. Intervenimos a nivel de cultura y clima laboral, liderazgo y gestión del cambio para asegurar que su equipo esté preparado para enfrentar nuevos desafíos. Diagnosticamos las brechas existentes y construimos rutas de desarrollo que potencien la agilidad y colaboración en todos los niveles.",
    benefits: [
      "Diagnósticos e intervenciones de clima organizacional.",
      "Programas de formación y desarrollo de líderes.",
      "Gestión de procesos de cambio organizacional.",
      "Alineación de cultura corporativa con estrategia de negocio."
    ],
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    color: "var(--color-accent)"
  }
};

export default function BusinessLines() {
  const t = useTranslations('BusinessLines');
  const [selectedService, setSelectedService] = useState<ServiceKey | null>(null);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedService]);

  const handleOpenModal = (e: React.MouseEvent, key: ServiceKey) => {
    e.preventDefault();
    setSelectedService(key);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  return (
    <section className="business-lines-section fluid-container">
      <div className="bl-header text-center">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          {t('title')}
        </motion.h2>
        <motion.p 
          className="section-description"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t('desc')}
        </motion.p>
      </div>

      <motion.div 
        className="cards-container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.2 }
          }
        }}
      >
        {Object.entries(servicesData).map(([key, service], index) => {
          const serviceKey = key as ServiceKey;
          const isSecondary = index === 1;
          return (
            <motion.div key={key} className={`service-card ${isSecondary ? 'secondary' : ''}`} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
              <div className="card-bg" style={{ backgroundImage: `url(${service.image})` }}></div>
              <div className="card-overlay"></div>
              <div className="card-accent" style={{ backgroundColor: service.color }}></div>
              <div className="card-content">
                <h3 className="card-title">{t(`${serviceKey}_title`)}</h3>
                <p className="card-desc">
                  {t(`${serviceKey}_desc`)}
                </p>
                <button 
                  onClick={(e) => handleOpenModal(e, serviceKey)} 
                  className="card-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', font: 'inherit' }}
                >
                  {t('ver_mas')} <span className="arrow">→</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Modal / Popup */}
      <AnimatePresence>
        {selectedService && (
          <div className="service-modal-portal">
            <motion.div 
              className="service-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            ></motion.div>
            
            <div className="service-modal-wrapper" onClick={closeModal}>
              <motion.div 
                className="service-modal-content"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
              >
                <button className="service-modal-close" onClick={closeModal}>×</button>
                
                <div className="modal-header">
                  <div className="modal-image" style={{ backgroundImage: `url(${servicesData[selectedService].image})` }}></div>
                  <div className="modal-accent" style={{ backgroundColor: servicesData[selectedService].color }}></div>
                </div>
                
                <div className="modal-body">
                  <h3 className="modal-title">{servicesData[selectedService].title}</h3>
                  <p className="modal-desc">{servicesData[selectedService].longDesc}</p>
                  
                  <h4 className="modal-subtitle">¿Qué incluye este servicio?</h4>
                  <ul className="modal-benefits">
                    {servicesData[selectedService].benefits.map((benefit: string, i: number) => (
                      <li key={i}>
                        <span className="benefit-icon" style={{ color: servicesData[selectedService].color }}>✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="modal-actions">
                    <button onClick={closeModal} className="btn btn-outline">Cerrar</button>
                    <a href="#contacto" onClick={closeModal} className="btn btn-primary">Agendar reunión</a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

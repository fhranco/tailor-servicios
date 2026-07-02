'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './JobOffersCarousel.css';
import { useTranslations } from 'next-intl';

// Ejemplo de datos estructurados para las ofertas
// En el futuro, esto podría venir de una API de Rexmas
const jobOffers = [
  {
    id: 1,
    title: "Analista de Selección y Desarrollo Junior",
    location: "Punta Arenas, Chile",
    type: "Tiempo completo",
    department: "Administración de Personal",
    link: "https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios"
  },
  {
    id: 2,
    title: "Analista de Facturación",
    location: "Punta Arenas, Chile",
    type: "Tiempo completo",
    department: "Facturación",
    link: "https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios"
  },
  {
    id: 3,
    title: "Jefe de Contabilidad",
    location: "Punta Arenas, Chile",
    type: "Tiempo completo",
    department: "Contabilidad",
    link: "https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios"
  },
  {
    id: 4,
    title: "Encargado de Administración y Control",
    location: "Punta Arenas, Chile",
    type: "Tiempo completo",
    department: "Administración",
    link: "https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios"
  },
  {
    id: 5,
    title: "Ejecutivo/a de Venta Automotriz",
    location: "Punta Arenas, Chile",
    type: "Tiempo completo",
    department: "Ventas",
    link: "https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios"
  },
  {
    id: 6,
    title: "Vendedor/a de Sala Ferretería",
    location: "Punta Arenas, Chile",
    type: "Tiempo completo",
    department: "Ventas",
    link: "https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios"
  },
  {
    id: 7,
    title: "Operador/a de Planta GLP - Puerto Williams",
    location: "Cabo de Hornos, Chile",
    type: "Tiempo completo",
    department: "Operaciones",
    link: "https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios"
  },
  {
    id: 8,
    title: "Operador/a Mantenedor/a Mecánico y Electromecánico",
    location: "Coyhaique, Chile",
    type: "Tiempo completo",
    department: "Operaciones",
    link: "https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios"
  },
  {
    id: 9,
    title: "Asistente de Recursos Humanos",
    location: "Punta Arenas, Chile",
    type: "Tiempo completo",
    department: "Recursos Humanos",
    link: "https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios"
  },
  {
    id: 10,
    title: "Jefe/a de Operaciones",
    location: "Punta Arenas, Chile",
    type: "Tiempo completo",
    department: "Operaciones",
    link: "https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios"
  },
  {
    id: 11,
    title: "Coordinador/a Gestión de Personas",
    location: "Punta Arenas, Chile",
    type: "Tiempo completo",
    department: "Recursos Humanos",
    link: "https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios"
  },
  {
    id: 12,
    title: "Gerente/a de Operaciones",
    location: "Punta Arenas, Chile",
    type: "Tiempo completo",
    department: "Gerencia / Dirección General",
    link: "https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios"
  }
];

export default function JobOffersCarousel() {
  const t = useTranslations('JobOffersCarousel');
  const [currentIndex, setCurrentIndex] = useState(0);
  // Duplicamos el array para el efecto de scroll infinito sin saltos
  const marqueeItems = [...jobOffers, ...jobOffers];

  return (
    <section className="c-jobs-section">
      <div className="fluid-container">
        <div className="c-jobs-header">
          <div>
            <span className="c-jobs-badge">{t('activeOpportunities')}</span>
            <h2 className="c-jobs-title">{t('featuredOffers')}</h2>
          </div>
          <div className="c-jobs-controls">
             <a href="https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios" target="_blank" rel="noopener noreferrer" className="c-jobs-all-btn">
               {t('viewAll')} &rarr;
             </a>
          </div>
        </div>
      </div>

      {/* Marquee Container (Full width) */}
      <div className="c-jobs-marquee-wrapper">
        <div className="c-jobs-marquee-track">
          {marqueeItems.map((job, index) => (
            <a 
              key={`${job.id}-${index}`} 
              href={job.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="c-job-card-marquee"
              style={{ textDecoration: 'none' }}
            >
              <div className="c-job-card-header">
                <span className="c-job-department">{job.department}</span>
                <span className="c-job-type">{job.type}</span>
              </div>
              
              <h3 className="c-job-title">{job.title}</h3>
              
              <div className="c-job-location">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {job.location}
              </div>

              <div className="c-job-apply-btn">
                {t('btn')} &rarr;
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

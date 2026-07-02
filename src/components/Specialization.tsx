"use client";

import React from 'react';
import { motion } from 'framer-motion';
import './Specialization.css';

const industries = [
  {
    id: 1,
    title: "Jaulas Salmonicultura",
    description: "Expertos en reclutar perfiles críticos para operaciones marítimas y de cultivo.",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12C2 12 5 14 12 14C19 14 22 12 22 12" />
        <path d="M12 14V22" />
        <path d="M8 22H16" />
        <path d="M20.59 7.59L17 4H12L8.41 7.59C7.52 8.48 7.52 9.92 8.41 10.81L12 14.4L15.59 10.81C16.48 9.92 16.48 8.48 15.59 7.59Z" />
      </svg>
    )
  },
  {
    id: 2,
    title: "Energía e Hidrógeno",
    description: "Impulsando el talento para proyectos de energía renovable y nuevas tecnologías.",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
      </svg>
    )
  },
  {
    id: 3,
    title: "Logística y Transporte",
    description: "Optimizando operaciones complejas y transporte marítimo antártico.",
    image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <path d="M2 10H22" />
        <path d="M6 14V17" />
        <path d="M18 14V17" />
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </svg>
    )
  },
  {
    id: 4,
    title: "Turismo y Hospitalidad",
    description: "Seleccionamos perfiles de excelencia para la atención en hoteles y cruceros boutique.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21H21" />
        <path d="M5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21" />
        <path d="M9 7H11" />
        <path d="M13 7H15" />
        <path d="M9 11H11" />
        <path d="M13 11H15" />
        <path d="M9 15H11" />
        <path d="M13 15H15" />
        <path d="M10 21V17H14V21" />
      </svg>
    )
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Specialization() {
  return (
    <section className="specialization-section">
      <div className="fluid-container">
        <div className="specialization-header">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title text-center">Nuestra Especialización</h2>
            <p className="section-subtitle text-center">
              Comprendemos los desafíos únicos de las industrias clave de la región.
              Nuestra metodología se adapta a la realidad operativa de cada sector.
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="specialization-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {industries.map((item) => (
            <motion.div className="spec-card-clean" key={item.id} variants={itemVariants}>
              
              <div className="spec-icon-clean">
                {item.icon}
              </div>
              
              <h3 className="spec-card-title">{item.title}</h3>
              <p className="spec-card-desc">{item.description}</p>
              
              <div className="spec-card-footer">
                <span className="spec-card-link">Conocer más</span>
                <svg className="spec-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div className="spec-hover-bar"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

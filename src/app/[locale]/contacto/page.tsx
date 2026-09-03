"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import B2B_LeadForm from '@/components/B2B_LeadForm';
import LocationMap from '@/components/LocationMap';
import './page.css';

export default function ContactoPage() {
  return (
    <main className="contacto-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-bg">
          <img 
            src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Contacto Tailor Servicios" 
          />
        </div>
        <div className="fluid-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-content"
          >
            <div className="hero-badge">Comunicación Directa</div>
            <h1 className="hero-title">
              HABLEMOS SOBRE EL FUTURO <br /> DE TU <span className="text-accent">EQUIPO</span>
            </h1>
            <p className="hero-subtitle" style={{ maxWidth: '700px', textAlign: 'center' }}>
              Desde Magallanes para todo Chile. Ya sea que necesite encontrar al líder ideal o transformar su cultura organizacional, estamos aquí para escucharlo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="contacto-main">
        <div className="fluid-container">
          <div className="contacto-grid">
            
            {/* Left Column: Contact Info */}
            <motion.div 
              className="contacto-info"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="info-title">Nuestras Oficinas</h2>
              <p className="info-desc">
                Contamos con presencia local sólida en la Región de Magallanes y alcance estratégico a nivel nacional.
              </p>

              <div className="contact-detail-list">
                <motion.div 
                  className="contact-detail-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="detail-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <div className="detail-text">
                    <h3>Dirección Corporativa</h3>
                    <p>21 de mayo #2918, Punta Arenas.</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="contact-detail-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                >
                  <div className="detail-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <div className="detail-text">
                    <h3>WhatsApp / Teléfono</h3>
                    <p><a href="https://wa.me/56997580085" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>+56 9 9758 0085</a></p>
                  </div>
                </motion.div>

                <motion.div 
                  className="contact-detail-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="detail-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <div className="detail-text">
                    <h3>Correo Electrónico</h3>
                    <p><a href="mailto:Contacto@tailorservicios.cl" style={{ color: 'inherit', textDecoration: 'none' }}>Contacto@tailorservicios.cl</a></p>
                  </div>
                </motion.div>

                <motion.div 
                  className="contact-detail-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="detail-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <div className="detail-text">
                    <h3>Horario de Atención</h3>
                    <p>Lunes a Viernes: 09:00 a 18:00 hrs.</p>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                style={{ marginTop: '3rem', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <LocationMap />
              </motion.div>

            </motion.div>

            {/* Right Column: B2B Form */}
            <motion.div 
              className="contacto-form-wrapper"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="form-title">Solicite Asesoría o Presupuesto</h2>
              <p className="form-subtitle">Complete el formulario y un especialista corporativo le contactará a la brevedad.</p>
              
              <B2B_LeadForm />
            </motion.div>

          </div>

          {/* Candidates CTA */}
          <motion.div 
            className="candidates-cta"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3>¿Eres un profesional buscando nuevos desafíos?</h3>
            <p>Este formulario es exclusivo para empresas. Si deseas ser parte de nuestra red de talento y acceder a oportunidades confidenciales en el sur de Chile, te invitamos a postular directamente en nuestro portal de empleos.</p>
            <a 
              href="https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-glass"
            >
              Postular en Rex+
            </a>
          </motion.div>

        </div>
      </section>
    </main>
  );
}

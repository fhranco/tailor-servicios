"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import './page.css';

export default function ServiciosPage() {
  return (
    <main className="services-page">
      {/* Hero Section */}
      <section className="inner-hero">
        <div className="fluid-container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <div className="hero-badge">Líneas de Negocio</div>
            <h1 className="hero-title">
              NUESTRAS LÍNEAS DE <span className="text-accent">NEGOCIO</span>
            </h1>
            <p className="hero-subtitle">
              Soluciones integrales de talento diseñadas a medida para los desafíos productivos de la región y todo Chile.
            </p>
          </motion.div>
        </div>
        <div className="hero-background-gradient"></div>
      </section>

      {/* Servicio 1: Reclutamiento */}
      <section className="service-block dark-block" id="reclutamiento">
        <div className="fluid-container service-grid">
          <motion.div 
            className="service-text-col"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="service-number">01</div>
            <h2>Reclutamiento y <br/>Selección de Personal</h2>
            <h3>Encontramos a las personas que harán crecer su organización</h3>
            <div className="service-divider"></div>
            <p>
              En Tailor Servicios entendemos que un proceso de selección exitoso va mucho más allá de revisar currículums. Nuestro trabajo consiste en identificar personas que no sólo cumplan con los requisitos técnicos de un cargo, sino que además sean capaces de integrarse a la cultura organizacional, aportar valor y generar resultados sostenibles en el tiempo.
            </p>
            <p>
              Contamos con amplia experiencia desarrollando procesos de reclutamiento y selección para cargos operativos, administrativos, técnicos, profesionales, supervisores, jefaturas, subgerencias y gerencias.
            </p>
            <p>
              El talento adecuado puede transformar una empresa. Por el contrario, una contratación equivocada puede generar importantes costos económicos, operacionales y humanos.
            </p>
            <div className="quote-box" style={{marginTop: '4rem'}}>
              <svg className="quote-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 11L8 15H11V19H5V15L7 11H5V7H11V11H10ZM20 11L18 15H21V19H15V15L17 11H15V7H21V11H20Z" fill="currentColor"/></svg>
              <p style={{fontSize: '1.2rem'}}>Porque contratar personas no es llenar vacantes; es construir el futuro de una organización.</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="service-list-col glass-panel"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <h4>Nuestro servicio considera un acompañamiento integral que incluye:</h4>
            </div>
            <ul className="service-list luxury-list" style={{marginBottom: '2rem'}}>
              <li>Levantamiento y análisis de perfiles</li>
              <li>Definición de competencias críticas</li>
              <li>Estrategias de búsqueda y atracción de talento</li>
              <li>Publicación y difusión en múltiples plataformas</li>
              <li>Reclutamiento activo y búsqueda directa</li>
              <li>Filtro curricular especializado</li>
              <li>Screening telefónico</li>
              <li>Entrevistas por competencias</li>
              <li>Evaluaciones psicolaborales</li>
              <li>Verificación de referencias laborales</li>
              <li>Apoyo en la confección de cartas oferta</li>
              <li>Acompañamiento durante el proceso de incorporación</li>
            </ul>
            
            <p style={{color: 'var(--color-gray-dark)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '1rem'}}>
              Gracias a nuestra presencia regional y nacional, contamos con una sólida red de contactos y una comprensión profunda de los mercados laborales, especialmente en sectores donde la escasez de talento representa un desafío permanente.
            </p>
            <p style={{color: 'var(--color-gray-dark)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem'}}>
              Nuestro objetivo es entregar candidatos que realmente agreguen valor a la organización, reduciendo tiempos de contratación, minimizando riesgos y mejorando la calidad de las decisiones de selección.
            </p>

          </motion.div>
        </div>
      </section>

      {/* Servicio 2: Gestión de Dotaciones */}
      <section className="service-block light-block" id="gestion">
        <div className="fluid-container service-grid reverse-grid">
          <motion.div 
            className="service-text-col"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="service-number dark-number">02</div>
            <h2>Gestión de <br/>Dotaciones</h2>
            <h3>Acompañamiento operativo, legal y estratégico en la administración de su personal</h3>
            <div className="service-divider dark-divider"></div>
            <p>
              La administración eficiente y ordenada del personal es fundamental para la continuidad operativa y la solidez de cualquier empresa.
            </p>
            <p>
              En Tailor Servicios brindamos soporte integral en la gestión de dotaciones, desde la externalización de remuneraciones hasta auditorías de cumplimiento normativo y asesoría técnica en leyes de excepción para contratación en zonas extremas.
            </p>
            <p>
              Aseguramos procesos precisos, transparentes y orientados al bienestar laboral y la optimización de costos para su organización.
            </p>
            <div className="quote-box dark-quote">
              <svg className="quote-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 11L8 15H11V19H5V15L7 11H5V7H11V11H10ZM20 11L18 15H21V19H15V15L17 11H15V7H21V11H20Z" fill="currentColor"/></svg>
              <p>Optimizar la dotación y la nómina es garantizar la sostenibilidad operativa y legal de su negocio.</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="service-list-col dark-glass-panel"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <h4>Nuestros servicios operativos incluyen:</h4>
            </div>
            <ul className="service-list luxury-list dark-list">
              <li>Auditorías internas de personal</li>
              <li>Externalización y administración de remuneraciones / nómina</li>
              <li>Gestión integral de dotaciones</li>
              <li>Implementación, asesoría y optimización en ERPs de personas</li>
              <li>Servicios orientados al bienestar laboral</li>
              <li>Gestión y asesoría en bonificación a la contratación de mano de obra en zonas extremas (Leyes de excepción)</li>
              <li>Estudios de mercado laboral y mano de obra regional</li>
              <li>Programas y planes de acción tipo semillero de talento</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Servicio 3: Desarrollo */}
      <section className="service-block dark-block" id="desarrollo">
        <div className="fluid-container service-grid">
          <motion.div 
            className="service-text-col"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="service-number">03</div>
            <h2>Desarrollo <br/>Organizacional</h2>
            <h3>Construimos organizaciones preparadas para el futuro</h3>
            <div className="service-divider"></div>
            <p>
              Las empresas evolucionan constantemente. Nuevos desafíos, mercados más exigentes, cambios tecnológicos y transformaciones culturales obligan a las organizaciones a adaptarse de manera permanente. El Desarrollo Organizacional permite gestionar ese cambio de forma planificada y sostenible.
            </p>
            <p>
              En Tailor Servicios ayudamos a las organizaciones a fortalecer su cultura, desarrollar liderazgo, mejorar la colaboración entre equipos y preparar a las personas para enfrentar los desafíos del futuro. Diseñamos e implementamos iniciativas que generan transformaciones reales en la manera en que las empresas trabajan.
            </p>
            <p>
              Creemos firmemente que las mejores ideas nacen desde las personas que viven diariamente los desafíos de una organización. Por ello impulsamos espacios de participación e innovación que permitan aprovechar el talento colectivo.
            </p>
            <div className="quote-box">
              <svg className="quote-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 11L8 15H11V19H5V15L7 11H5V7H11V11H10ZM20 11L18 15H21V19H15V15L17 11H15V7H21V11H20Z" fill="currentColor"/></svg>
              <p>Porque las organizaciones que invierten en sus personas son las que mejor preparadas están para enfrentar el futuro.</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="service-list-col glass-panel"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              <h4>Nuestros servicios incluyen:</h4>
            </div>
            <ul className="service-list luxury-list">
              <li>Sistemas continuos de evaluación de desempeño</li>
              <li>Planes de capacitación, carrera y sucesión</li>
              <li>Estudios y diagnósticos de clima laboral</li>
              <li>Diseño de estructuras de compensación y beneficios</li>
              <li>Asesoría laboral y cumplimiento normativo</li>
              <li>Auditoría de estructuras organizacionales y levantamiento de perfiles de cargo</li>
              <li>Colaboración en planificaciones estratégicas y pilares corporativos</li>
              <li>Diseño e implementación del sistema integral de Desarrollo Organizacional</li>
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="fluid-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>¿Listo para impulsar el talento de tu empresa?</h2>
            <p>Conozcamos los desafíos de tu organización y diseñemos juntos una solución a medida.</p>
            <Link href="/empresas" className="btn-luxury-solid">
              Contáctanos hoy
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

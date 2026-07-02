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

      {/* Servicio 2: Gestión */}
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
            <h2>Gestión <br/>de Personas</h2>
            <h3>Transformamos la gestión de recursos humanos en una ventaja competitiva</h3>
            <div className="service-divider dark-divider"></div>
            <p>
              Las organizaciones exitosas entienden que la gestión de personas no es únicamente una función administrativa; es una herramienta estratégica para alcanzar resultados.
            </p>
            <p>
              En Tailor Servicios apoyamos a las empresas en el diseño, implementación y fortalecimiento de procesos que permitan gestionar a sus equipos de manera eficiente, ordenada y alineada con sus objetivos organizacionales. Nuestro enfoque busca equilibrar las necesidades del negocio con el bienestar de las personas, generando entornos laborales que favorezcan la productividad y el compromiso.
            </p>
            <p>
              Entendemos que detrás de cada proceso existen personas con expectativas y proyectos de vida. Por ello buscamos construir soluciones que generen valor tanto para las empresas como para quienes forman parte de ellas.
            </p>
            <div className="quote-box dark-quote">
              <svg className="quote-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 11L8 15H11V19H5V15L7 11H5V7H11V11H10ZM20 11L18 15H21V19H15V15L17 11H15V7H21V11H20Z" fill="currentColor"/></svg>
              <p>Gestionar personas correctamente no es un gasto; es una inversión en productividad, sostenibilidad y crecimiento.</p>
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
              <h4>Trabajamos junto a nuestros clientes en:</h4>
            </div>
            <ul className="service-list luxury-list dark-list">
              <li>Diseño de estructuras organizacionales</li>
              <li>Descripciones y perfiles de cargo</li>
              <li>Políticas y procedimientos de RRHH</li>
              <li>Gestión del desempeño</li>
              <li>Evaluación de competencias</li>
              <li>Sistemas de reconocimiento y beneficios</li>
              <li>Estudios de rentas y equidad interna</li>
              <li>Diagnósticos organizacionales</li>
              <li>Clima laboral</li>
              <li>Encuestas de satisfacción</li>
              <li>Gestión documental laboral</li>
              <li>Asesoría en relaciones laborales</li>
              <li>Cumplimiento normativo</li>
              <li>Apoyo en implementación de Ley Karin</li>
              <li>Procesos de comunicación interna</li>
              <li>Acompañamiento a áreas de RRHH</li>
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
              <li>Diagnósticos organizacionales</li>
              <li>Desarrollo de liderazgo</li>
              <li>Programas de formación y capacitación</li>
              <li>Gestión del cambio</li>
              <li>Cultura organizacional</li>
              <li>Programas de innovación interna</li>
              <li>Diseño de competencias organizacionales</li>
              <li>Team building</li>
              <li>Desarrollo de habilidades directivas</li>
              <li>Evaluaciones de potencial</li>
              <li>Programas de sucesión</li>
              <li>Procesos de crecimiento organizacional</li>
              <li>Facilitación de talleres estratégicos</li>
              <li>Proyectos de mejora continua</li>
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

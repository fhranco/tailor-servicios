"use client";

import React from 'react';
import { motion } from 'framer-motion';
import './page.css';

export default function NosotrosPage() {
  return (
    <main className="nosotros-page">
      <section className="inner-hero">
        <div className="fluid-container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <div className="hero-badge">Acerca de Tailor</div>
            <h1 className="hero-title">
              SOBRE <span className="text-accent">NOSOTROS</span>
            </h1>
            <p className="hero-subtitle">
              Conocimiento local y visión nacional para transformar la gestión de personas en su organización.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quiénes Somos */}
      <section className="story-section fluid-container">
        <div className="story-container">
          <h2>Nuestra Historia</h2>
          <p className="lead-text" style={{ fontWeight: 600, color: 'var(--color-dark)', fontSize: '1.4rem' }}>
            En Tailor Servicios creemos que las <span className="text-accent">organizaciones crecen</span> cuando las <span className="text-accent">personas crecen</span> con ellas.
          </p>
          <p>
            Somos una consultora especializada en Recursos Humanos con más de nueve años de experiencia acompañando a empresas de distintos tamaños e industrias en la Región de Magallanes y en todo Chile. Desde nuestras oficinas en Punta Arenas y Santiago, hemos construido relaciones de largo plazo con más de 100 clientes, transformándonos en un socio estratégico para organizaciones que buscan atraer talento, fortalecer sus equipos y desarrollar culturas organizacionales sostenibles.
          </p>
          <p>
            Nuestro trabajo combina conocimiento técnico, experiencia práctica y una profunda comprensión de las realidades de cada territorio, especialmente de los desafíos que implica gestionar personas en zonas extremas, industrias complejas y mercados laborales altamente competitivos.
          </p>
          <p>
            Nos diferenciamos por entregar soluciones personalizadas, cercanas y orientadas a resultados. No creemos en las recetas estándar ni en los servicios genéricos. Cada cliente posee una realidad distinta, una cultura única y objetivos específicos que requieren respuestas diseñadas a medida.
          </p>
          <p>
            Hoy acompañamos a empresas de sectores tan diversos como turismo, hotelería, energía, transporte, logística, retail, servicios, industria, construcción, salmonicultura, sector público y organizaciones sin fines de lucro, aportando valor en cada etapa de la gestión de personas.
          </p>
          <div className="quote-box" style={{ marginTop: '3rem', marginBottom: '1rem' }}>
            <svg className="quote-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 11L8 15H11V19H5V15L7 11H5V7H11V11H10ZM20 11L18 15H21V19H15V15L17 11H15V7H21V11H20Z" fill="currentColor"/></svg>
            <p>
              Nuestro propósito es simple pero desafiante: ayudar a las organizaciones a construir equipos más sólidos, culturas más saludables y procesos más eficientes.
            </p>
          </div>
          <p style={{ fontWeight: 'bold', color: 'var(--color-accent)', fontSize: '1.25rem', marginTop: '2rem' }}>
            Impulsando el desarrollo desde Magallanes.
          </p>
        </div>
      </section>

      {/* Por qué nos eligen */}
      <section className="why-section">
        <div className="fluid-container">
          <h2 style={{textAlign: 'center', fontSize: '2.5rem', color: 'var(--color-dark)'}}>¿Por qué Tailor Servicios?</h2>
          <p style={{textAlign: 'center', fontSize: '1.25rem', color: 'var(--color-gray-dark)', marginTop: '1rem', maxWidth: '800px', margin: '1rem auto 0'}}>
            Porque conocemos las personas, comprendemos las organizaciones y entendemos los desafíos de los distintos sectores productivos.
          </p>

          <div className="why-grid">
            <div className="why-card">
              <h3>Conocimiento y Visión</h3>
              <p>Conocimiento local y visión nacional, con experiencia regional comprobada.</p>
            </div>
            <div className="why-card">
              <h3>Atención Personalizada</h3>
              <p>Cercanía y acompañamiento permanente en todas las etapas del proceso.</p>
            </div>
            <div className="why-card">
              <h3>Experiencia Comprobada</h3>
              <p>Años de trayectoria respaldando la calidad de nuestro trabajo.</p>
            </div>
            <div className="why-card">
              <h3>Soluciones a Medida</h3>
              <p>No usamos recetas genéricas, adaptamos nuestras herramientas a su realidad.</p>
            </div>
            <div className="why-card">
              <h3>Foco en Resultados</h3>
              <p>Relaciones de largo plazo basadas en la confianza y el impacto real en su organización.</p>
            </div>
            <div className="why-card">
              <h3>Respuesta Rápida</h3>
              <p>Agilidad y compromiso profesional para resolver sus necesidades a tiempo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Las personas detrás */}
      <section className="team-section">
        <div className="fluid-container team-grid">
          <div className="team-image-placeholder">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Reunión de equipo profesional" 
            />
          </div>
          
          <div className="team-content">
            <h2>Las personas detrás de Tailor Servicios</h2>
            <ul className="team-list">
              <li><strong>Más de 20 profesionales especializados</strong> dedicados a potenciar su organización.</li>
              <li><strong>Equipo multidisciplinario</strong> que aporta diversas perspectivas y soluciones innovadoras.</li>
              <li><strong>Experiencia acumulada de más de 15 años</strong> en distintas especialidades de recursos humanos.</li>
              <li><strong>Presencia regional y nacional</strong>, entendiendo las realidades de cada zona.</li>
              <li><strong>Conocimiento profundo</strong> de las industrias donde participamos y sus dinámicas.</li>
              <li><strong>Cercanía y acompañamiento permanente</strong> a clientes y candidatos, humanizando cada proceso.</li>
            </ul>
          </div>
        </div>
      </section>

    </main>
  );
}

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import './page.css';
import ValuesSection from '@/components/ValuesSection';
import TestimonialSection from '@/components/TestimonialSection';
import IndustriesMarquee from '@/components/IndustriesMarquee';

export default function NosotrosPage() {
  const t = useTranslations('NosotrosPage');

  const alliances = [
    {
      id: 'canales',
      name: 'ONG Canales',
      desc: t('canales_desc'),
      tag: t('canales_tag'),
      logo: '/alianzas/ong-canales.png'
    },
    {
      id: 'austro',
      name: 'Austro Chile',
      desc: t('austro_desc'),
      tag: t('austro_tag'),
      logo: '/alianzas/austro.png'
    },
    {
      id: 'hyst',
      name: 'HYST',
      desc: t('hyst_desc'),
      tag: t('hyst_tag'),
      logo: '/alianzas/hyst.png'
    },
    {
      id: 'ist',
      name: 'IST',
      desc: t('ist_desc'),
      tag: t('ist_tag'),
      logo: '/alianzas/ist.png'
    },
    {
      id: 'britanico',
      name: 'Instituto Británico',
      desc: t('britanico_desc'),
      tag: t('britanico_tag'),
      logo: '/alianzas/instituto-britanico.png'
    }
  ];

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
            <div className="hero-badge">{t('badge')}</div>
            <h1 className="hero-title">
              {t('title')} <span className="text-accent">{t('title_accent')}</span>
            </h1>
            <p className="hero-subtitle">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quiénes Somos / Nuestra Historia */}
      <section className="story-section">
        <div className="fluid-container story-grid-layout">
          <div className="story-text-column">
            <h2>{t('story_title')}</h2>
            <p className="lead-text" style={{ fontWeight: 600, color: 'var(--color-dark)', fontSize: '1.4rem' }}>
              {t('lead_1')} <span className="text-accent">{t('lead_accent1')}</span> {t('lead_2')} <span className="text-accent">{t('lead_accent2')}</span> {t('lead_3')}
            </p>
            <p>
              {t('story_p1')}
            </p>
            <p>
              {t('story_p2')}
            </p>
            <p>
              {t('story_p3')}
            </p>
            <p>
              {t('story_p4')}
            </p>
            <div className="quote-box" style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
              <svg className="quote-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 11L8 15H11V19H5V15L7 11H5V7H11V11H10ZM20 11L18 15H21V19H15V15L17 11H15V7H21V11H20Z" fill="currentColor" /></svg>
              <p>
                {t('quote')}
              </p>
            </div>
            <p style={{ fontWeight: 'bold', color: 'var(--color-dark)', fontSize: '1.25rem', marginTop: '1.5rem' }}>
              {t('motto')}
            </p>
          </div>

          <motion.div 
            className="story-image-column"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <div className="story-image-card">
              <div className="story-image-wrap">
                <img 
                  src="/maria-avendano.webp" 
                  alt="María Avendaño — Directora Ejecutiva y Socia Fundadora de Tailor Servicios" 
                  className="story-leader-photo"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="story-image-caption">
                <h3 className="leader-name">{t('story_leader_name')}</h3>
                <p className="leader-role">{t('story_leader_role')}</p>
                
                <div className="leader-bio-body">
                  <p>{t('story_leader_bio_1')}</p>
                  <p>{t('story_leader_bio_2')}</p>
                </div>

                <div className="leader-quote-box">
                  <svg className="leader-quote-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                  <p className="leader-quote-text">
                    &ldquo;{t('story_leader_quote')}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="mission-vision-section">
        <div className="fluid-container">
          <div className="mission-vision-grid">
            <motion.div
              className="mv-card mission-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mv-card-header">
                <div className="mv-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mv-icon">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                  </svg>
                </div>
                <h2>{t('mission_title')}</h2>
              </div>
              <p className="mv-text">
                {t('mission_text')}
              </p>
            </motion.div>

            <motion.div
              className="mv-card vision-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mv-card-header">
                <div className="mv-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mv-icon">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
                <h2>{t('vision_title')}</h2>
              </div>
              <p className="mv-text">
                {t('vision_text')} <span className="text-highlight">{t('vision_highlight')}</span>.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <ValuesSection />

      {/* Sección de Rubros e Industrias (Marquesina Coloreada con Clic Sostenido / Drag) */}
      <IndustriesMarquee />

      {/* Por qué nos eligen */}
      <section className="why-section">
        <div className="fluid-container">
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', color: 'var(--color-dark)' }}>{t('why_title')}</h2>
          <p style={{ textAlign: 'center', fontSize: '1.25rem', color: 'var(--color-gray-dark)', marginTop: '1rem', maxWidth: '800px', margin: '1rem auto 0' }}>
            {t('why_subtitle')}
          </p>

          <div className="why-grid">
            <div className="why-card">
              <h3>{t('why_1_title')}</h3>
              <p>{t('why_1_desc')}</p>
            </div>
            <div className="why-card">
              <h3>{t('why_2_title')}</h3>
              <p>{t('why_2_desc')}</p>
            </div>
            <div className="why-card">
              <h3>{t('why_3_title')}</h3>
              <p>{t('why_3_desc')}</p>
            </div>
            <div className="why-card">
              <h3>{t('why_4_title')}</h3>
              <p>{t('why_4_desc')}</p>
            </div>
            <div className="why-card">
              <h3>{t('why_5_title')}</h3>
              <p>{t('why_5_desc')}</p>
            </div>
            <div className="why-card">
              <h3>{t('why_6_title')}</h3>
              <p>{t('why_6_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Las personas detrás - Cuadro azul / Destacado de equipo */}
      <section className="team-section">
        <div className="fluid-container team-grid">
          <div className="team-image-placeholder">
            <img
              src="/Images/team-nosotros.webp"
              alt="Reunión de equipo profesional Tailor Servicios"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="team-content">
            <h2>{t('team_title')}</h2>
            <ul className="team-list">
              <li><strong>{t('team_li1_bold')}</strong> {t('team_li1_text')}</li>
              <li><strong>{t('team_li2_bold')}</strong> {t('team_li2_text')}</li>
              <li><strong>{t('team_li3_bold')}</strong> {t('team_li3_text')}</li>
              <li><strong>{t('team_li4_bold')}</strong> {t('team_li4_text')}</li>
              <li><strong>{t('team_li5_bold')}</strong> {t('team_li5_text')}</li>
              <li><strong>{t('team_li6_bold')}</strong> {t('team_li6_text')}</li>
            </ul>

            {/* Identificador de Marca Oficial Vigente en el pie de la sección */}
            <div className="team-brand-badge">
              <div className="team-brand-logo-wrap">
                <img
                  src="/tailor-logo-white.png"
                  alt="Tailor Servicios — Identificador Oficial"
                  className="team-brand-logo"
                />
              </div>
              <div className="team-brand-text">
                <span className="team-brand-title">{t('team_badge_title')}</span>
                <span className="team-brand-sub">{t('team_badge_sub')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Casos de Éxito / Testimonios (Área de Testimonios / Post-its) */}
      <TestimonialSection />

      {/* Nueva Sección: "Alianzas Estratégicas" (Alianzas y Convenios) */}
      <section className="alliances-section">
        <div className="fluid-container">
          <div className="alliances-header">
            <span className="alliances-badge">{t('alliances_badge')}</span>
            <h2 className="alliances-title">{t('alliances_title')}</h2>
            <p className="alliances-subtitle">
              {t('alliances_subtitle')}
            </p>
          </div>

          <div className="alliances-grid">
            {alliances.map((alliance, i) => (
              <motion.div
                key={alliance.id}
                className="alliance-card"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="alliance-logo-box">
                  <img
                    src={alliance.logo}
                    alt={`Logo Alianza ${alliance.name}`}
                    className="alliance-logo-img"
                  />
                </div>
                <h3 className="alliance-entity-name">{alliance.name}</h3>
                <p className="alliance-entity-desc">{alliance.desc}</p>
                <span className="alliance-tag">
                  <span className="alliance-tag-dot"></span>
                  {alliance.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}

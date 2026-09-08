'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './CandidateUpload.css';

export default function CandidateUpload() {
  const [copied, setCopied] = useState(false);
  const emailAddress = 'seleccion@tailorservicios.cl';

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(emailAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const mailtoUrl = `mailto:${emailAddress}?subject=Postulaci%C3%B3n%20Laboral%20-%20Curr%C3%ADculum%20Vitae&body=Estimado%20equipo%20de%20Selecci%C3%B3n%20de%20Tailor%20Servicios%2C%0A%0AAdjunto%20mi%20Curr%C3%ADculum%20Vitae%20para%20futuras%20b%C3%BAsquedas%20y%20oportunidades%20laborales.%0A%0A-%20Nombre%20completo%3A%0A-%20%C3%81rea%20o%20Especialidad%3A%0A-%20Ciudad%20de%20residencia%3A%0A-%20Tel%C3%A9fono%20de%20contacto%3A%0A%0ASaludos%20cordiales.`;

  return (
    <section className="c-upload-section" id="envia-tu-cv">
      <div className="fluid-container">
        <motion.div 
          className="c-upload-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          {/* Columna Izquierda: Información de la Red de Talento */}
          <div className="c-upload-text">
            <span className="c-upload-badge">Red de Talento Austral</span>
            <h2 className="c-upload-title">Envía tu Currículum Vitae</h2>
            <p className="c-upload-desc">
              Si tu perfil no corresponde a ninguna de las vacantes activas en nuestro portal o deseas formar parte de nuestra base de datos para futuras búsquedas estratégicas en Magallanes y todo Chile, te invitamos a enviarnos tus antecedentes directamente por correo electrónico.
            </p>

            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>✓</span>
                <span><strong>Privacidad total:</strong> No subes archivos a la web; tú mantienes el control enviándolo desde tu propio correo.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>✓</span>
                <span><strong>Evaluación experta:</strong> Tu perfil es revisado por nuestro equipo de consultores especializados.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>✓</span>
                <span><strong>Búsquedas confidenciales:</strong> Acceso a oportunidades laborales de alta dirección y proyectos exclusivos.</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta de Instrucciones de Envío */}
          <div className="c-upload-form-wrapper" style={{ display: 'flex', flexDirection: 'column', padding: '2.75rem 2.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                backgroundColor: 'rgba(190, 22, 34, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary, #153a61)',
                flexShrink: 0
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#be1622' }}>
                  Envío Directo
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-dark)', margin: '0.1rem 0 0 0' }}>
                  Canal Oficial de Selección
                </h3>
              </div>
            </div>

            <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Para postular de forma espontánea, abre tu proveedor de correo habitual (Gmail, Outlook, etc.) y envía tu CV adjunto a nuestra casilla técnica:
            </p>

            {/* Caja de Correo con Copiado Rápido */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '0.85rem 1.15rem',
              marginBottom: '1.5rem',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                <span style={{ fontSize: '1.1rem' }}>✉️</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  {emailAddress}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                style={{
                  background: copied ? '#059669' : '#ffffff',
                  color: copied ? '#ffffff' : '#334155',
                  border: '1px solid',
                  borderColor: copied ? '#059669' : '#cbd5e1',
                  borderRadius: '6px',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                {copied ? '✓ ¡Copiado!' : 'Copiar'}
              </button>
            </div>

            {/* Pasos a seguir */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #f1f5f9',
              borderRadius: '10px',
              padding: '1.1rem',
              marginBottom: '1.5rem',
              fontSize: '0.88rem',
              color: '#475569'
            }}>
              <div style={{ fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Instrucciones para tu postulación:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li><strong>Adjunto:</strong> Envía tu archivo en formato PDF o Word actualizado.</li>
                <li><strong>Asunto del correo:</strong> Indica tu área de especialidad (ej. <em>Postulación - Operaciones y Logística</em>).</li>
                <li><strong>En el cuerpo:</strong> Menciona brevemente tus años de experiencia y ciudad de residencia.</li>
              </ul>
            </div>

            {/* Botón Principal: Abrir Correo */}
            <a 
              href={mailtoUrl}
              className="btn-primary"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                fontSize: '1rem',
                fontWeight: 700,
                padding: '0.95rem 1.5rem',
                borderRadius: '8px',
                width: '100%',
                backgroundColor: 'var(--color-primary, #0f172a)',
                color: '#ffffff',
                transition: 'all 0.2s ease',
                marginBottom: '1.25rem'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              Abrir en mi Correo Electrónico
            </a>

            {/* Alternativa secundaria: Portal Rex+ */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.1rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>¿Prefieres postular a convocatorias activas en línea?</span>
              <br />
              <a 
                href="https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#be1622',
                  textDecoration: 'none',
                  marginTop: '0.35rem'
                }}
              >
                Ver Ofertas en Portal Rex+
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>

            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '1rem', textAlign: 'center' }}>
              🔒 Sin intermediarios ni retención de archivos en la web. Regulado por la Ley 21.719 de Chile.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

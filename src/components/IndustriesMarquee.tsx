"use client";

import React, { useRef, useState, useEffect } from 'react';
import './IndustriesMarquee.css';

interface IndustryItem {
  id: string;
  title: string;
  tag: string;
  desc: string;
  color: string;
  glow: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}

export default function IndustriesMarquee() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const speed = 1.0; // Velocidad de auto-scroll continuo

  const industries: IndustryItem[] = [
    {
      id: 'salmonicultura',
      title: 'Salmonicultura',
      tag: 'Acuicultura Austral',
      color: '#06b6d4', // Cyan
      glow: 'rgba(6, 182, 212, 0.25)',
      iconBg: 'rgba(6, 182, 212, 0.15)',
      iconColor: '#22d3ee',
      desc: 'Búsqueda, selección y gestión de personas para centros de cultivo, plantas de proceso, centros de acopio y logística acuícola en fiordos y canales australes.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6s-7.56-2.54-8.5-6Z" />
          <path d="M18 12c-.5 1.5-2 2-3 2s-2.5-.5-3-2c.5-1.5 2-2 3-2s2.5.5 3 2Z" />
          <path d="M2 16l4.5-4L2 8" />
        </svg>
      )
    },
    {
      id: 'energia',
      title: 'Energía e Hidrógeno Verde',
      tag: 'Transición Energética',
      color: '#10b981', // Esmeralda / Verde H2V
      glow: 'rgba(16, 185, 129, 0.25)',
      iconBg: 'rgba(16, 185, 129, 0.15)',
      iconColor: '#34d399',
      desc: 'Reclutamiento de perfiles especializados para la transición energética, parques eólicos, plantas de H2V y megaproyectos industriales sostenibles en Magallanes.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v8" />
          <path d="m4.93 10.93 5.66 5.66" />
          <path d="M2 18h8" />
          <path d="M20 18h2" />
          <path d="m19.07 10.93-5.66 5.66" />
          <circle cx="12" cy="14" r="4" />
          <path d="M12 18v4" />
        </svg>
      )
    },
    {
      id: 'logistica',
      title: 'Logística y Transporte',
      tag: 'Conectividad & Carga',
      color: '#f59e0b', // Ámbar / Dorado
      glow: 'rgba(245, 158, 11, 0.25)',
      iconBg: 'rgba(245, 158, 11, 0.15)',
      iconColor: '#fbbf24',
      desc: 'Dotaciones operativas y ejecutivas para conectividad marítima, terrestre y portuaria en rutas complejas y operaciones de abastecimiento en zonas extremas.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="2" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      )
    },
    {
      id: 'turismo',
      title: 'Turismo y Hotelería',
      tag: 'Hospitalidad Austral',
      color: '#38bdf8', // Azul Glaciar
      glow: 'rgba(56, 189, 248, 0.25)',
      iconBg: 'rgba(56, 189, 248, 0.15)',
      iconColor: '#7dd3fc',
      desc: 'Selección de talento para hotelería boutique, lodges de expedición, cruceros australes y servicios gastronómicos de estándar internacional en la Patagonia.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
          <path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19" />
        </svg>
      )
    },
    {
      id: 'ganaderia',
      title: 'Ganadería',
      tag: 'Agroindustria & Campo',
      color: '#fb923c', // Naranja Óxido / Campo
      glow: 'rgba(251, 146, 60, 0.25)',
      iconBg: 'rgba(251, 146, 60, 0.15)',
      iconColor: '#fdba74',
      desc: 'Atracción y administración de personas para estancias patagónicas, plantas faenadoras, frigoríficos y cadenas de producción agropecuaria regional.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <circle cx="12" cy="11" r="3" />
          <path d="M6 18c1.5-2 3.5-3 6-3s4.5 1 6 3" />
        </svg>
      )
    },
    {
      id: 'retail',
      title: 'Retail',
      tag: 'Comercio & Sucursales',
      color: '#a855f7', // Púrpura / Retail
      glow: 'rgba(168, 85, 247, 0.25)',
      iconBg: 'rgba(168, 85, 247, 0.15)',
      iconColor: '#c084fc',
      desc: 'Gestión integral de dotaciones para grandes tiendas, sucursales regionales, centros comerciales y posiciones comerciales de alta rotación y atención a clientes.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      )
    },
    {
      id: 'alimentos',
      title: 'Industria de Alimentos y Consumo Masivo',
      tag: 'Plantas & Procesamiento',
      color: '#f43f5e', // Coral / Rosa
      glow: 'rgba(244, 63, 94, 0.25)',
      iconBg: 'rgba(244, 63, 94, 0.15)',
      iconColor: '#fb7185',
      desc: 'Reclutamiento técnico y supervisión para plantas elaboradoras, centros de distribución, envasado y control de calidad en cadenas alimentarias.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          <rect x="3" y="3" width="18" height="18" rx="4" />
        </svg>
      )
    }
  ];

  // Triplicar para garantizar scroll infinito sin cortes visuales al arrastrar
  const displayItems = [...industries, ...industries, ...industries];

  // Auto-scroll continuo en bucle
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const tick = () => {
      if (!isDragging && !isHovered && el) {
        el.scrollLeft += speed;
        // Bucle continuo al sobrepasar un tercio
        const singleSetWidth = el.scrollWidth / 3;
        if (el.scrollLeft >= singleSetWidth * 2) {
          el.scrollLeft -= singleSetWidth;
        } else if (el.scrollLeft <= 0) {
          el.scrollLeft += singleSetWidth;
        }
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDragging, isHovered]);

  // Clic Sostenido (Drag-to-scroll) con Pointer Events
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = viewportRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = viewportRef.current;
    if (!el) return;

    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.6; // Sensibilidad de arrastre fluido
    el.scrollLeft = scrollLeftState - walk;

    // Ajuste de bucle durante el arrastre interactivo
    const singleSetWidth = el.scrollWidth / 3;
    if (el.scrollLeft >= singleSetWidth * 2) {
      el.scrollLeft -= singleSetWidth;
      setScrollLeftState(el.scrollLeft);
      setStartX(x);
    } else if (el.scrollLeft <= 0) {
      el.scrollLeft += singleSetWidth;
      setScrollLeftState(el.scrollLeft);
      setStartX(x);
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <section className="industries-section-colored">
      <div className="fluid-container">
        <div className="industries-header-colored">
          <div className="industries-badge-colored">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Sectores Estratégicos
          </div>
          <h2 className="industries-title-colored">
            Rubros e <span className="accent-title">Industrias</span>
          </h2>
          <p className="industries-desc-colored">
            Acompañamos a organizaciones en sectores clave con soluciones de capital humano adaptadas a la geografía, regulación y exigencias operativas de cada territorio.
          </p>
        </div>
      </div>

      {/* Viewport interactivo con Clic Sostenido y Auto-scroll */}
      <div 
        ref={viewportRef}
        className={`industries-drag-viewport ${isDragging ? 'is-dragging' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsDragging(false);
        }}
      >
        <div className="industries-drag-track">
          {displayItems.map((item, idx) => (
            <div 
              key={`${item.id}-${idx}`}
              className="industry-drag-card"
              style={{
                '--card-color': item.color,
                '--card-glow': item.glow
              } as React.CSSProperties}
            >
              <div className="card-top-row">
                <div 
                  className="industry-icon-box"
                  style={{
                    backgroundColor: item.iconBg,
                    color: item.iconColor
                  }}
                >
                  {item.icon}
                </div>
                <span className="industry-card-tag">{item.tag}</span>
              </div>

              <h3>{item.title}</h3>
              <p>{item.desc}</p>

              <div className="card-footer-action">
                <span>Especialidad Tailor</span>
                <div className="card-indicator-dot"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Barra de ayuda interactiva */}
      <div className="drag-hint-bar">
        <div className="drag-hint-pill">
          <svg className="drag-icon-anim" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
            <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
            <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
          </svg>
          <span>Haz clic sostenido y arrastra hacia cualquier lado · Se pausa al pasar el cursor</span>
        </div>
      </div>
    </section>
  );
}

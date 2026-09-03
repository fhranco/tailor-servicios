"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import './page.css';

const blogPosts = [
  {
    id: 1,
    title: "Estrategias de atracción de talento en zonas extremas de Chile",
    category: "Atracción de Talento",
    date: "Septiembre 2024",
    readTime: "4 min de lectura",
    summary: "Descubre cómo las organizaciones en Magallanes y la Patagonia están superando la escasez de perfiles técnicos y directivos mediante propuestas de valor atractivas.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Implementación efectiva de la Ley Karin en la cultura organizacional",
    category: "Gestión de Personas",
    date: "Agosto 2024",
    readTime: "6 min de lectura",
    summary: "Aspectos clave, protocolos preventivos y buenas prácticas para fomentar ambientes laborales seguros, respetuosos y en pleno cumplimiento de la nueva normativa.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "El impacto del Desarrollo Organizacional en la retención del talento clave",
    category: "Desarrollo Organizacional",
    date: "Julio 2024",
    readTime: "5 min de lectura",
    summary: "Planes de carrera, liderazgo empático y medición continua de clima laboral como pilares para reducir la rotación no deseada en empresas del sur.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export default function BlogPage() {
  return (
    <main className="blog-page">
      <section className="inner-hero">
        <div className="fluid-container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <div className="hero-badge">Actualidad & Insights</div>
            <h1 className="hero-title">
              NUESTRO <span className="text-accent">BLOG</span>
            </h1>
            <p className="hero-subtitle">
              Tendencias, análisis del mercado laboral y reflexiones sobre gestión de personas y talento en el sur de Chile.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="blog-content-section">
        <div className="fluid-container">
          <div className="blog-grid">
            {blogPosts.map((post, idx) => (
              <motion.article 
                key={post.id}
                className="blog-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="blog-card-image-wrapper">
                  <img src={post.image} alt={post.title} className="blog-card-img" />
                  <span className="blog-category-badge">{post.category}</span>
                </div>
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="blog-card-title">{post.title}</h2>
                  <p className="blog-card-summary">{post.summary}</p>
                  <Link href="/contacto" className="blog-card-link">
                    Conversar sobre este tema →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="blog-cta-box">
            <h3>¿Quieres mantenerte actualizado en gestión de personas?</h3>
            <p>Contáctanos para conocer nuestros estudios de rentas, diagnósticos de clima y consultoría personalizada.</p>
            <Link href="/contacto" className="btn-luxury-solid">
              Contactar con un consultor
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

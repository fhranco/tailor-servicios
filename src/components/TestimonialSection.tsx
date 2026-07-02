"use client";

import React, { useRef, useState, useEffect } from 'react';
import './TestimonialSection.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function TestimonialSection() {
  const t = useTranslations('TestimonialSection');
  const [width, setWidth] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      id: 1,
      quote: t('t1_quote'),
      name: "Carolina Mendoza",
      role: "Directora de RR.HH.",
      company: "Líder en Energía",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 5
    },
    {
      id: 2,
      quote: t('t2_quote'),
      name: "Ricardo Álvarez",
      role: "Gerente General",
      company: "Servicios Industriales",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 5
    },
    {
      id: 3,
      quote: t('t3_quote'),
      name: "Patricia Loyola",
      role: "Gerente de Operaciones",
      company: "Logística y Transporte",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 5
    },
    {
      id: 4,
      quote: t('t4_quote'),
      name: "Felipe Contreras",
      role: "VP de Personas",
      company: "Holding Financiero",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 5
    },
    {
      id: 5,
      quote: t('t5_quote'),
      name: "Andrea Varas",
      role: "Subgerente de Desarrollo",
      company: "Consumo Masivo",
      image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 5
    },
    {
      id: 6,
      quote: t('t6_quote'),
      name: "Gonzalo Ibarra",
      role: "CEO",
      company: "Start-up Tecnológica",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 5
    }
  ];

  useEffect(() => {
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
    }
    
    // Update on resize
    const handleResize = () => {
      if (carousel.current) {
        setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="testimonial-section">
      <div className="testimonial-bg-accent"></div>
      
      <div className="fluid-container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="testimonial-header">
          <motion.h2 
            className="section-title text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            {t('title')}
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('subtitle')}
          </motion.p>
        </div>

        <motion.div ref={carousel} className="carousel-container" whileTap={{ cursor: "grabbing" }}>
          <motion.div 
            drag="x" 
            dragConstraints={{ right: 0, left: -width }} 
            className="inner-carousel"
            animate={{ x: [-width, 0] }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "mirror", 
              duration: 30, 
              ease: "linear" 
            }}
          >
            {testimonials.map((test) => (
              <motion.div 
                className="testimonial-card glass-panel" 
                key={test.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="quote-icon">"</div>
                <div className="stars">
                  {'★'.repeat(test.rating)}
                </div>
                <p className="testimonial-text">
                  {test.quote}
                </p>
                
                <div className="testimonial-author">
                  <div className="author-image" style={{ backgroundImage: `url(${test.image})` }}></div>
                  <div className="author-info">
                    <h4 className="author-name">{test.name}</h4>
                    <span className="author-role">{test.role}</span>
                    <span className="author-company">{test.company}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import './page.css';
import { useTranslations, useLocale } from 'next-intl';

export default function BlogPage() {
  const t = useTranslations('BlogPage');
  const locale = useLocale();
  const isEn = locale === 'en';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const defaultBlogPosts = [
    {
      id: 1791667200000,
      slug: 'siete-anos-de-historia-y-compromiso-con-magallanes',
      title: isEn
        ? "Seven Years of History and Commitment to Magallanes"
        : "Siete años de historia y compromiso con Magallanes",
      category: isEn ? "People & Strategy" : "Gestión de Personas",
      date: isEn ? "October 10, 2026" : "10 de octubre de 2026",
      isoDate: "2026-10-10",
      readTime: isEn ? "5 min read" : "5 min de lectura",
      summary: isEn
        ? "Today at Tailor Servicios, we celebrate seven years of history in Magallanes. A reflection on our journey, the trust built with companies and individuals, and a renewed commitment to opportunities and regional development."
        : "Hoy, en Tailor Servicios, cumplimos siete años de historia en Magallanes. Siete años que representan mucho más que el crecimiento de una empresa: representan confianza construida, desafíos compartidos y un compromiso renovado con nuestra región.",
      image: '/aniversario.webp',
      featured: true,
      categoryKey: 'personas',
      author: {
        name: 'Ma. Pía Avendaño A.',
        role: isEn ? 'Executive Director - Institutional Leadership & Strategy' : 'Directora Ejecutiva - Liderazgo Institucional & Estrategia',
        institution: 'Tailor Servicios',
        avatar: 'MP'
      }
    },
    {
      id: 1790975336156,
      slug: 'hay-lugares-que-uno-habita-y-hay-otros-que-de-alguna-manera-terminan-habitandolo-a-uno-magallanes-tiene-algo-de-eso',
      title: isEn
        ? "There are places one inhabits, and others that somehow end up inhabiting you. Magallanes has something of that."
        : "Hay lugares que uno habita y hay otros que, de alguna manera, terminan habitándolo a uno. Magallanes tiene algo de eso.",
      category: isEn ? "People & Strategy" : "Gestión de Personas",
      date: isEn ? "October 2, 2026" : "2 de octubre de 2026",
      isoDate: "2026-10-02",
      readTime: isEn ? "7 min read" : "7 min de lectura",
      summary: isEn
        ? "For those of us born in Punta Arenas who have built our lives in this territory, its realities are not something told to us. We live them."
        : "Para quienes nacimos en Punta Arenas y hemos desarrollado buena parte de nuestras vidas en este territorio, sus particularidades no son algo que nos hayan contado. Las vivimos.",
      image: '/Images/tailor-web15.webp',
      featured: false,
      categoryKey: 'personas',
      author: {
        name: 'Ma. Pía Avendaño A.',
        role: isEn ? 'Executive Director - Institutional Leadership & Strategy' : 'Directora Ejecutiva - Liderazgo Institucional & Estrategia',
        institution: 'Tailor Servicios',
        avatar: 'MP'
      }
    },
    {
      id: 1,
      slug: 'estrategias-atraccion-talento-zonas-extremas-chile',
      title: t('post1_title'),
      category: t('post1_cat'),
      date: t('post1_date'),
      isoDate: "2024-09-15",
      readTime: t('post1_time'),
      summary: t('post1_summary'),
      image: '/Images/tailor-web15.webp',
      featured: false,
      categoryKey: 'atraccion',
      author: {
        name: 'Equipo de Consultoría Tailor',
        role: 'Especialistas en Reclutamiento & Gestión de Personas',
        institution: 'Tailor Servicios',
        avatar: 'TS'
      }
    },
    {
      id: 2,
      slug: 'implementacion-ley-karin-cultura-organizacional-chile',
      title: t('post2_title'),
      category: t('post2_cat'),
      date: t('post2_date'),
      isoDate: "2024-08-28",
      readTime: t('post2_time'),
      summary: t('post2_summary'),
      image: '/Images/tailor-web2.webp',
      featured: false,
      categoryKey: 'personas'
    },
    {
      id: 3,
      slug: 'impacto-desarrollo-organizacional-retencion-talento',
      title: t('post3_title'),
      category: t('post3_cat'),
      date: t('post3_date'),
      isoDate: "2024-07-19",
      readTime: t('post3_time'),
      summary: t('post3_summary'),
      image: '/desarrollo-organizacional.webp',
      featured: false,
      categoryKey: 'do'
    },
    {
      id: 4,
      slug: 'desafios-ley-40-horas-turnos-continuos-faenas',
      title: t('post4_title'),
      category: t('post4_cat'),
      date: t('post4_date'),
      isoDate: "2024-06-10",
      readTime: t('post4_time'),
      summary: t('post4_summary'),
      image: '/Images/tailor-web7.webp',
      featured: false,
      categoryKey: 'normativa'
    }
  ];

  const [posts, setPosts] = useState(defaultBlogPosts);

  useEffect(() => {
    let isMounted = true;
    async function loadDynamicArticles() {
      try {
        const res = await fetch('/api/blog');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && Array.isArray(data.articles) && data.articles.length > 0) {
            setPosts(data.articles);
          }
        }
      } catch (err) {
        // Fallback to default posts
      }
    }
    loadDynamicArticles();
    return () => { isMounted = false; };
  }, []);

  // Helper determinista para obtener timestamp seguro sin riesgo de NaN y proteger orden canónico
  const getPostTimestamp = (p: any): number => {
    const CANONICAL_TIMESTAMPS: Record<string, number> = {
      'siete-anos-de-historia-y-compromiso-con-magallanes': 1791667200000, // 10 de octubre de 2026 (7° Aniversario / Destacado)
      'hay-lugares-que-uno-habita-y-hay-otros-que-de-alguna-manera-terminan-habitandolo-a-uno-magallanes-tiene-algo-de-eso': 1790975336156, // 2 de octubre de 2026
      'estrategias-atraccion-talento-zonas-extremas-chile': 1726358400000, // 15 de septiembre de 2024
      'implementacion-ley-karin-cultura-organizacional-chile': 1724803200000, // 28 de agosto de 2024
      'impacto-desarrollo-organizacional-retencion-talento': 1721347200000, // 19 de julio de 2024
      'desafios-ley-40-horas-turnos-continuos-faenas': 1717977600000, // 10 de junio de 2024
    };
    if (p.slug && CANONICAL_TIMESTAMPS[p.slug]) {
      return CANONICAL_TIMESTAMPS[p.slug];
    }
    if (p.isoDate) {
      const t = new Date(p.isoDate).getTime();
      if (!isNaN(t)) return t;
    }
    if (p.published_at) {
      const t = new Date(p.published_at).getTime();
      if (!isNaN(t)) return t;
    }
    if (p.created_at) {
      const t = new Date(p.created_at).getTime();
      if (!isNaN(t)) return t;
    }
    if (typeof p.id === 'number' && p.id > 1000000000) {
      return p.id;
    }
    return 0;
  };

  // Garantizar orden estrictamente cronológico inverso: el artículo más reciente es siempre el índice 0 (destacado)
  const sortedPosts = [...posts].sort((a, b) => getPostTimestamp(b) - getPostTimestamp(a));

  const categories = [
    { id: 'all', label: t('filter_all') },
    ...Array.from(new Set(sortedPosts.map(p => p.category))).map(cat => ({
      id: cat,
      label: cat
    }))
  ];

  const filteredPosts = selectedCategory === 'all'
    ? sortedPosts
    : sortedPosts.filter(p => p.category === selectedCategory);

  const featuredPost = selectedCategory === 'all' ? sortedPosts[0] : null;
  const gridPosts = filteredPosts;

  return (
    <main className="blog-page">
      {/* Hero Section Corporativo con Fondo Oscuro y Jerarquía Visual */}
      <section className="inner-hero blog-hero">
        <div className="fluid-container">
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-content"
          >
            <nav className="blog-breadcrumbs" aria-label="Breadcrumb">
              <Link href="/" className="breadcrumb-link">{t('breadcrumb_home')}</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{t('breadcrumb_blog')}</span>
            </nav>

            <div className="hero-badge">{t('badge')}</div>
            
            <h1 className="hero-title">
              {t('title_prefix')} <span className="text-accent">{t('title_accent')}</span>
            </h1>
            
            <p className="hero-subtitle">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contenido Principal con Filtros y Tarjetas */}
      <section className="blog-content-section">
        <div className="fluid-container">

          {/* Barra de Filtros por Categoría */}
          <div className="blog-filter-bar">
            <span className="filter-label">{t('filter_label')}</span>
            <div className="filter-pill-group" role="tablist">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Artículo Destacado (cuando se visualizan todos) */}
          {featuredPost && (
            <motion.div 
              className="featured-post-wrapper"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <article className="featured-card">
                <div className="featured-image-container">
                  <img 
                    src={featuredPost.image} 
                    alt={(isEn && (featuredPost as any).titleEn) ? (featuredPost as any).titleEn : featuredPost.title} 
                    className="featured-img"
                    loading="eager"
                  />
                  <div className="featured-tag-badge">
                    <span className="tag-sparkle">★</span> {t('featured_badge')}
                  </div>
                  <span className="featured-cat-badge">
                    {(isEn && (featuredPost as any).categoryEn) ? (featuredPost as any).categoryEn : featuredPost.category}
                    {isEn && (
                      <span style={{
                        marginLeft: '0.45rem',
                        padding: '0.12rem 0.4rem',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        background: (featuredPost as any).titleEn ? '#1e40af' : '#92400e',
                        color: '#ffffff'
                      }}>
                        {(featuredPost as any).titleEn ? 'EN' : 'ES'}
                      </span>
                    )}
                  </span>
                </div>

                <div className="featured-body">
                  <div className="featured-meta">
                    <span className="meta-author">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      {(featuredPost as any).author?.name || t('author_tailor')}
                    </span>
                    <span className="meta-bullet">•</span>
                    <span>{featuredPost.date}</span>
                    <span className="meta-bullet">•</span>
                    <span className="meta-readtime">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      {(isEn && (featuredPost as any).readTimeEn) ? (featuredPost as any).readTimeEn : featuredPost.readTime}
                    </span>
                  </div>

                  <Link href={`/blog/${featuredPost.slug}`} className="article-title-link">
                    <h2 className="featured-title">
                      {(isEn && (featuredPost as any).titleEn) ? (featuredPost as any).titleEn : featuredPost.title}
                    </h2>
                  </Link>
                  <p className="featured-summary">
                    {(isEn && (featuredPost as any).summaryEn) ? (featuredPost as any).summaryEn : featuredPost.summary}
                  </p>

                  <div className="featured-footer">
                    <Link href={`/blog/${featuredPost.slug}`} className="btn-luxury-action">
                      <span>{t('read_more')} →</span>
                    </Link>
                  </div>
                </div>
              </article>
            </motion.div>
          )}

          {/* Grid de Artículos */}
          <div className="blog-grid">
            <AnimatePresence mode="popLayout">
              {gridPosts.map((post, idx) => {
                const title = (isEn && (post as any).titleEn) ? (post as any).titleEn : post.title;
                const summary = (isEn && (post as any).summaryEn) ? (post as any).summaryEn : post.summary;
                const category = (isEn && (post as any).categoryEn) ? (post as any).categoryEn : post.category;
                const readTime = (isEn && (post as any).readTimeEn) ? (post as any).readTimeEn : post.readTime;

                return (
                  <motion.article 
                    key={post.id}
                    layout
                    className="blog-card"
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                  >
                    <Link href={`/blog/${post.slug}`} className="blog-card-img-link">
                      <div className="blog-card-image-wrapper">
                        <img 
                          src={post.image} 
                          alt={title} 
                          className="blog-card-img" 
                          loading="lazy"
                        />
                        <span className="blog-category-badge">
                          {category}
                          {isEn && (
                            <span style={{
                              marginLeft: '0.45rem',
                              padding: '0.12rem 0.4rem',
                              borderRadius: '4px',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              background: (post as any).titleEn ? '#1e40af' : '#92400e',
                              color: '#ffffff'
                            }}>
                              {(post as any).titleEn ? 'EN' : 'ES'}
                            </span>
                          )}
                        </span>
                      </div>
                    </Link>

                    <div className="blog-card-body">
                      <div className="blog-card-meta">
                        {(post as any).author?.name && (
                          <>
                            <span className="blog-card-author">{(post as any).author.name}</span>
                            <span className="meta-sep">•</span>
                          </>
                        )}
                        <span>{post.date}</span>
                        <span className="meta-sep">•</span>
                        <span className="meta-time">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          {readTime}
                        </span>
                      </div>

                      <Link href={`/blog/${post.slug}`} className="article-title-link">
                        <h2 className="blog-card-title">{title}</h2>
                      </Link>
                      <p className="blog-card-summary">{summary}</p>

                      <div className="blog-card-footer">
                        <Link href={`/blog/${post.slug}`} className="blog-card-link">
                          <span>{t('read_more')} →</span>
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Caja CTA Ejecutiva / Asesoría B2B */}
          <motion.div 
            className="blog-cta-box"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="cta-icon-pill">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>{t('cta_badge')}</span>
            </div>
            <h3>{t('cta_title')}</h3>
            <p>{t('cta_desc')}</p>
            <div className="cta-actions-group">
              <Link href="/contacto" className="btn-luxury-solid">
                {t('cta_btn')}
              </Link>
            </div>
          </motion.div>

        </div>
      </section>
    </main>
  );
}

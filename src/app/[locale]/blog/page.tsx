"use client";

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import './page.css';
import { useTranslations } from 'next-intl';

export default function BlogPage() {
  const t = useTranslations('BlogPage');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const defaultBlogPosts = [
    {
      id: 1,
      slug: 'estrategias-atraccion-talento-zonas-extremas-chile',
      title: t('post1_title'),
      category: t('post1_cat'),
      date: t('post1_date'),
      readTime: t('post1_time'),
      summary: t('post1_summary'),
      image: '/Images/tailor-web15.webp',
      featured: true,
      categoryKey: 'atraccion'
    },
    {
      id: 2,
      slug: 'implementacion-ley-karin-cultura-organizacional-chile',
      title: t('post2_title'),
      category: t('post2_cat'),
      date: t('post2_date'),
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

  const categories = [
    { id: 'all', label: t('filter_all') },
    ...Array.from(new Set(posts.map(p => p.category))).map(cat => ({
      id: cat,
      label: cat
    }))
  ];

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  const featuredPost = selectedCategory === 'all' ? posts[0] : null;
  const gridPosts = selectedCategory === 'all' ? posts.slice(1) : filteredPosts;

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
                    alt={featuredPost.title} 
                    className="featured-img"
                    loading="eager"
                  />
                  <div className="featured-tag-badge">
                    <span className="tag-sparkle">★</span> {t('featured_badge')}
                  </div>
                  <span className="featured-cat-badge">{featuredPost.category}</span>
                </div>

                <div className="featured-body">
                  <div className="featured-meta">
                    <span className="meta-author">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      {t('author_tailor')}
                    </span>
                    <span className="meta-bullet">•</span>
                    <span>{featuredPost.date}</span>
                    <span className="meta-bullet">•</span>
                    <span className="meta-readtime">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <Link href={`/blog/${featuredPost.slug}`} className="article-title-link">
                    <h2 className="featured-title">{featuredPost.title}</h2>
                  </Link>
                  <p className="featured-summary">{featuredPost.summary}</p>

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
              {gridPosts.map((post, idx) => (
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
                        alt={post.title} 
                        className="blog-card-img" 
                        loading="lazy"
                      />
                      <span className="blog-category-badge">{post.category}</span>
                    </div>
                  </Link>

                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      <span>{post.date}</span>
                      <span className="meta-sep">•</span>
                      <span className="meta-time">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {post.readTime}
                      </span>
                    </div>

                    <Link href={`/blog/${post.slug}`} className="article-title-link">
                      <h2 className="blog-card-title">{post.title}</h2>
                    </Link>
                    <p className="blog-card-summary">{post.summary}</p>

                    <div className="blog-card-footer">
                      <Link href={`/blog/${post.slug}`} className="blog-card-link">
                        <span>{t('read_more')} →</span>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
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

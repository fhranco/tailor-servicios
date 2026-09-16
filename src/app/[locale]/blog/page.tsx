"use client";

import React from 'react';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import './page.css';
import { useTranslations } from 'next-intl';

export default function BlogPage() {
  const t = useTranslations('BlogPage');

  const blogPosts = [
    {
      id: 1,
      title: t('post1_title'),
      category: t('post1_cat'),
      date: t('post1_date'),
      readTime: t('post1_time'),
      summary: t('post1_summary'),
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: t('post2_title'),
      category: t('post2_cat'),
      date: t('post2_date'),
      readTime: t('post2_time'),
      summary: t('post2_summary'),
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: t('post3_title'),
      category: t('post3_cat'),
      date: t('post3_date'),
      readTime: t('post3_time'),
      summary: t('post3_summary'),
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

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
                    {t('card_link')}
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="blog-cta-box">
            <h3>{t('cta_title')}</h3>
            <p>{t('cta_desc')}</p>
            <Link href="/contacto" className="btn-luxury-solid">
              {t('cta_btn')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

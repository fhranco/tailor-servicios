import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { getBlogArticleBySlug, getAllBlogSlugs, blogArticlesEs } from '@/data/blogPosts';
import './page.css';

export const dynamicParams = true;

interface Props {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
  const article = getBlogArticleBySlug(slug, locale);
  if (!article) return {};

  const isEn = locale === 'en';
  const baseUrl = 'https://tailorservicios.cl';
  const canonicalUrl = isEn ? `${baseUrl}/en/blog/${slug}` : `${baseUrl}/blog/${slug}`;

  return {
    title: `${article.title} | Tailor Servicios`,
    description: article.summary,
    keywords: article.keywords,
    authors: [{ name: article.author.name }],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'es': `${baseUrl}/blog/${slug}`,
        'en': `${baseUrl}/en/blog/${slug}`,
        'x-default': `${baseUrl}/blog/${slug}`,
      },
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      url: canonicalUrl,
      siteName: 'Tailor Servicios',
      locale: isEn ? 'en_US' : 'es_CL',
      type: 'article',
      publishedTime: article.isoDate,
      authors: [article.author.name],
      images: [
        {
          url: `${baseUrl}${article.image}`,
          width: 1200,
          height: 630,
          alt: article.imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: [`${baseUrl}${article.image}`],
    },
  };
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map(slug => ({
    slug,
  }));
}

export default function ArticleDetailPage({ params: { locale, slug } }: Props) {
  const article = getBlogArticleBySlug(slug, locale);

  if (!article) {
    notFound();
  }

  const isEn = locale === 'en';
  const currentUrl = `https://tailorservicios.cl${isEn ? '/en' : ''}/blog/${slug}`;

  // Schema.org BlogPosting
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.summary,
    image: `https://tailorservicios.cl${article.image}`,
    datePublished: article.isoDate,
    dateModified: article.isoDate,
    author: {
      '@type': 'Organization',
      name: article.author.name,
      url: 'https://tailorservicios.cl',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tailor Servicios',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tailorservicios.cl/logoweb.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl,
    },
    wordCount: article.wordCount,
    keywords: article.keywords.join(', '),
  };

  // Schema.org BreadcrumbList
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isEn ? 'Home' : 'Inicio',
        item: 'https://tailorservicios.cl',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://tailorservicios.cl/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: currentUrl,
      },
    ],
  };

  const shareText = encodeURIComponent(`${article.title} - Tailor Servicios`);
  const shareUrl = encodeURIComponent(currentUrl);

  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="article-page">
        {/* Hero del Artículo */}
        <header className="article-hero">
          <div className="fluid-container article-header-container">
            <nav className="article-breadcrumbs" aria-label="Breadcrumb">
              <Link href="/" className="crumb-link">{isEn ? 'Home' : 'Inicio'}</Link>
              <span className="crumb-sep">/</span>
              <Link href="/blog" className="crumb-link">Blog</Link>
              <span className="crumb-sep">/</span>
              <span className="crumb-current">{article.category}</span>
            </nav>

            <span className="article-cat-badge">{article.category}</span>

            <h1 className="article-main-title">{article.title}</h1>
            <p className="article-main-subtitle">{article.subtitle}</p>

            <div className="article-meta-row">
              <div className="meta-author-box">
                <div className="author-avatar-icon">{article.author.avatar || 'TS'}</div>
                <div>
                  <div className="author-name">{article.author.name}</div>
                  <div className="author-role">{article.author.role}</div>
                </div>
              </div>

              <div className="meta-info-pills">
                <span className="meta-pill">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {article.date}
                </span>

                <span className="meta-pill">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {article.readTime}
                </span>

                <span className="meta-pill word-count-pill">
                  ~{article.wordCount} {isEn ? 'words' : 'palabras'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Contenedor del Cuerpo */}
        <div className="fluid-container article-content-layout">
          
          {/* Imagen Principal */}
          <div className="article-featured-image-wrapper">
            <img 
              src={article.image} 
              alt={article.imageAlt} 
              className="article-featured-img" 
              loading="eager"
            />
          </div>

          <div className="article-grid-layout">
            
            {/* Columna Principal de Contenido */}
            <main className="article-body-column">
              
              {/* Aviso si en ruta en inglés aún no hay traducción cargada */}
              {isEn && !article.contentHtmlEn && (
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '0.75rem 1.15rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.86rem',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}>
                  <span style={{ fontSize: '1.1rem' }}>🌐</span>
                  <span><strong>English edition notice:</strong> This strategic analysis is currently presented in its official Spanish edition. Full English translation is being finalized.</span>
                </div>
              )}

              {/* Puntos Clave para la Dirección */}
              {article.keyTakeaways && article.keyTakeaways.length > 0 && (
                <div className="key-takeaways-card">
                  <div className="takeaways-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <h3>{isEn ? 'Key Strategic Takeaways' : 'Puntos Clave para la Dirección'}</h3>
                  </div>
                  <ul className="takeaways-list">
                    {article.keyTakeaways.map((point, idx) => (
                      <li key={idx}>
                        <span className="bullet-check">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Índice de Contenidos Interactivo (Table of Contents) */}
              {article.sections && article.sections.length > 1 && (
                <nav className="table-of-contents-card" aria-label="Índice de Contenidos">
                  <div className="toc-header">
                    <span className="toc-icon">📑</span>
                    <h4>{isEn ? 'Table of Contents' : 'Índice de Contenidos'}</h4>
                  </div>
                  <ol className="toc-list">
                    {article.sections.map((sec, idx) => (
                      <li key={idx}>
                        <a href={`#seccion-${idx + 1}`} className="toc-link">
                          <span className="toc-number">{idx + 1}.</span>
                          <span className="toc-text">{sec.heading.replace(/^\d+[\.\)]\s*/, '')}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {/* Secciones de Contenido o HTML Directo */}
              <div className="article-text-body article-html-direct">
                {article.contentHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
                ) : (
                  <>
                    {article.sections?.map((section, sIdx) => (
                      <section key={sIdx} id={`seccion-${sIdx + 1}`} className="content-sub-section">
                        <h2 className="section-heading">
                          <span className="heading-accent-bar"></span>
                          {section.heading}
                        </h2>

                        {section.paragraphs?.map((p, pIdx) => (
                          <p 
                            key={pIdx} 
                            className={`article-paragraph ${sIdx === 0 && pIdx === 0 ? 'article-lead-paragraph' : ''}`}
                          >
                            {p}
                          </p>
                        ))}

                        {/* Subsecciones H3 si existen */}
                        {section.subsections && section.subsections.map((sub, subIdx) => (
                          <div key={subIdx} className="content-sub-sub-section">
                            <h3 className="section-sub-heading">{sub.title}</h3>
                            {sub.paragraphs?.map((sp, spIdx) => (
                              <p key={spIdx} className="article-paragraph">{sp}</p>
                            ))}
                          </div>
                        ))}

                        {section.quote && (
                          <blockquote className="article-quote">
                            <p>"{section.quote}"</p>
                          </blockquote>
                        )}

                        {section.list && (
                          <ul className="article-styled-list">
                            {section.list.map((item, lIdx) => (
                              <li key={lIdx}>{item}</li>
                            ))}
                          </ul>
                        )}

                        {section.callout && (
                          <aside className="article-callout-box">
                            <div className="callout-icon">💡</div>
                            <div>
                              <h4>{section.callout.title}</h4>
                              <p>{section.callout.text}</p>
                            </div>
                          </aside>
                        )}
                      </section>
                    ))}

                    {/* Conclusión */}
                    {article.conclusion?.text && (
                      <section className="article-conclusion-box">
                        <h3>{article.conclusion.title}</h3>
                        <p>{article.conclusion.text}</p>
                      </section>
                    )}
                  </>
                )}
              </div>

              {/* Palabras Clave / Tags */}
              {article.keywords && article.keywords.length > 0 && (
                <div className="article-tags-cloud">
                  <span className="tags-label">{isEn ? 'Topics:' : 'Temas de Interés:'}</span>
                  {article.keywords.map((kw, kwIdx) => (
                    <span key={kwIdx} className="article-keyword-tag">#{kw}</span>
                  ))}
                </div>
              )}

                {/* Compartir Artículo */}
                <div className="article-share-bar">
                  <span className="share-title">{isEn ? 'Share this article:' : 'Compartir este artículo:'}</span>
                  <div className="share-buttons-group">
                    <a 
                      href={linkedinShareUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="share-btn linkedin-btn"
                      aria-label="Compartir en LinkedIn"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn
                    </a>

                    <a 
                      href={whatsappShareUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="share-btn whatsapp-btn"
                      aria-label="Compartir por WhatsApp"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                      </svg>
                      WhatsApp
                    </a>
                  </div>
                </div>

            </main>

            {/* Barra Lateral / Sidebar de Asesoría */}
            <aside className="article-sidebar">
              
              {/* Tarjeta de Autor Institucional */}
              <div className="sidebar-card author-sidebar-card">
                <div className="author-card-header">
                  <div className="author-card-badge">✓ {isEn ? 'Expert Author' : 'Autoría Experta'}</div>
                  <h4>{article.author.name}</h4>
                  <p className="author-card-desc">{article.author.role}</p>
                </div>
                <p className="author-bio">
                  Equipo multidisciplinario especializado en Headhunting de alta dirección, reclutamiento masivo, gestión de dotaciones y transformación cultural con cobertura en Magallanes y la zona central de Chile.
                </p>
                <div className="author-divider"></div>
                <div className="author-location">
                  <span>📍 Punta Arenas &amp; Santiago</span>
                </div>
              </div>

              {/* Caja de Conversión B2B */}
              <div className="sidebar-card cta-sidebar-card">
                <span className="sidebar-cta-pill">Consultoría Directa</span>
                <h4>¿Tu empresa enfrenta este desafío?</h4>
                <p>
                  Conversemos sobre cómo adaptar estos modelos a la realidad específica de tu organización y sector productivo.
                </p>
                <Link href="/contacto" className="btn-sidebar-cta">
                  Agendar reunión con un consultor
                </Link>
              </div>

              {/* Botón Volver al Blog */}
              <div className="sidebar-card back-blog-card">
                <Link href="/blog" className="back-blog-link">
                  ← Volver a todos los artículos
                </Link>
              </div>

            </aside>

          </div>

        </div>
      </article>
    </>
  );
}

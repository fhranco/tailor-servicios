import { MetadataRoute } from 'next';
import blogArticles from '@/data/blog_articles.json';

const BASE_URL = 'https://tailorservicios.cl';

// Rutas públicas indexables del sitio
const baseRoutes = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/nosotros', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/servicios', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/especializacion', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/empresas', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/candidatos', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/postulantes', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/contacto', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/blog', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/privacidad', priority: 0.5, changeFrequency: 'yearly' as const },
  { path: '/terminos', priority: 0.5, changeFrequency: 'yearly' as const },
  { path: '/cookies', priority: 0.5, changeFrequency: 'yearly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const LATEST_SITE_UPDATE = '2026-11-05';
  const entries: MetadataRoute.Sitemap = [];

  // 1. Páginas Institucionales y Principales
  baseRoutes.forEach(({ path, priority, changeFrequency }) => {
    // Español
    entries.push({
      url: `${BASE_URL}${path}`,
      lastModified: LATEST_SITE_UPDATE,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          es: `${BASE_URL}${path}`,
          en: `${BASE_URL}/en${path}`,
        },
      },
    });

    // Inglés
    entries.push({
      url: `${BASE_URL}/en${path}`,
      lastModified: LATEST_SITE_UPDATE,
      changeFrequency,
      priority: Math.max(0.4, Number((priority - 0.1).toFixed(1))),
      alternates: {
        languages: {
          es: `${BASE_URL}${path}`,
          en: `${BASE_URL}/en${path}`,
        },
      },
    });
  });

  // 2. Artículos Editoriales del Blog con fecha real de cada publicación (Google SEO E-E-A-T)
  blogArticles.forEach((article: any) => {
    const articleDate = article.isoDate || LATEST_SITE_UPDATE;
    const articleSlug = article.slug;

    // Versión en Español
    entries.push({
      url: `${BASE_URL}/blog/${articleSlug}`,
      lastModified: articleDate,
      changeFrequency: 'monthly',
      priority: article.featured ? 0.85 : 0.75,
      alternates: {
        languages: {
          es: `${BASE_URL}/blog/${articleSlug}`,
          en: `${BASE_URL}/en/blog/${articleSlug}`,
        },
      },
    });

    // Versión en Inglés
    entries.push({
      url: `${BASE_URL}/en/blog/${articleSlug}`,
      lastModified: articleDate,
      changeFrequency: 'monthly',
      priority: article.featured ? 0.75 : 0.65,
      alternates: {
        languages: {
          es: `${BASE_URL}/blog/${articleSlug}`,
          en: `${BASE_URL}/en/blog/${articleSlug}`,
        },
      },
    });
  });

  return entries;
}

import { MetadataRoute } from 'next';
import { getAllBlogSlugs } from '@/data/blogPosts';

const BASE_URL = 'https://tailorservicios.cl';

// Rutas públicas indexables verificadas
const baseRoutes = [
  '',
  '/nosotros',
  '/servicios',
  '/especializacion',
  '/empresas',
  '/candidatos',
  '/postulantes',
  '/contacto',
  '/blog',
  '/privacidad',
  '/terminos',
  '/cookies',
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Fecha real de la última actualización mayor verificada
  const LAST_MODIFIED_RELEASE = '2026-10-02';
  const blogArticleRoutes = getAllBlogSlugs().map(slug => `/blog/${slug}`);
  const routes = [...baseRoutes, ...blogArticleRoutes];
  const entries: MetadataRoute.Sitemap = [];

  routes.forEach((route) => {
    // Versión en Español (por defecto, as-needed)
    entries.push({
      url: `${BASE_URL}${route}`,
      lastModified: LAST_MODIFIED_RELEASE,
      changeFrequency: route === '' ? 'weekly' : 'monthly',
      priority: route === '' ? 1.0 : route === '/servicios' || route === '/candidatos' ? 0.9 : 0.7,
      alternates: {
        languages: {
          es: `${BASE_URL}${route}`,
          en: `${BASE_URL}/en${route}`,
        },
      },
    });

    // Versión en Inglés
    entries.push({
      url: `${BASE_URL}/en${route}`,
      lastModified: LAST_MODIFIED_RELEASE,
      changeFrequency: route === '' ? 'weekly' : 'monthly',
      priority: route === '' ? 0.9 : route === '/servicios' || route === '/candidatos' ? 0.8 : 0.6,
      alternates: {
        languages: {
          es: `${BASE_URL}${route}`,
          en: `${BASE_URL}/en${route}`,
        },
      },
    });
  });

  return entries;
}

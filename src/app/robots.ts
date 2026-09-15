import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/es/admin',
          '/es/admin/',
          '/en/admin',
          '/en/admin/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://tailorservicios.cl/sitemap.xml',
  };
}

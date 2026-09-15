import React from 'react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const isEn = locale === 'en';
  return {
    title: isEn ? 'Blog & Industry Insights' : 'Blog y Tendencias',
    description: isEn
      ? 'Insights, news, and analysis on HR management, talent acquisition, and labor trends in Chile.'
      : 'Artículos, tendencias y perspectivas sobre gestión de personas, reclutamiento y mercado laboral en Chile.',
    alternates: {
      canonical: isEn ? 'https://tailorservicios.cl/en/blog' : 'https://tailorservicios.cl/blog',
      languages: {
        'es': 'https://tailorservicios.cl/blog',
        'en': 'https://tailorservicios.cl/en/blog',
        'x-default': 'https://tailorservicios.cl/blog',
      },
    },
  };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

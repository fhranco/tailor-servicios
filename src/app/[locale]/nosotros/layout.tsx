import React from 'react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const isEn = locale === 'en';
  return {
    title: isEn ? 'About Us' : 'Sobre Nosotros',
    description: isEn
      ? 'Discover Tailor Servicios: strategic HR consulting, executive headhunting, and people management in Punta Arenas and Santiago, Chile.'
      : 'Conoce más sobre Tailor Servicios, consultora líder en Recursos Humanos, Reclutamiento y Selección y Gestión de Personas con presencia en Magallanes y Santiago de Chile.',
    alternates: {
      canonical: isEn ? 'https://tailorservicios.cl/en/nosotros' : 'https://tailorservicios.cl/nosotros',
      languages: {
        'es': 'https://tailorservicios.cl/nosotros',
        'en': 'https://tailorservicios.cl/en/nosotros',
        'x-default': 'https://tailorservicios.cl/nosotros',
      },
    },
  };
}

export default function NosotrosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

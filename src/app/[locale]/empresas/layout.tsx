import React from 'react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const isEn = locale === 'en';
  return {
    title: isEn ? 'Corporate Solutions & Headhunting' : 'Soluciones para Empresas',
    description: isEn
      ? 'Strategic HR consulting and executive recruitment tailored for companies operating in Magallanes, Santiago, and across Chile.'
      : 'Atracción de talento estratégico, consultoría de dotaciones y selección ejecutiva a medida para empresas en Magallanes, Santiago y todo Chile.',
    alternates: {
      canonical: isEn ? 'https://tailorservicios.cl/en/empresas' : 'https://tailorservicios.cl/empresas',
      languages: {
        'es': 'https://tailorservicios.cl/empresas',
        'en': 'https://tailorservicios.cl/en/empresas',
        'x-default': 'https://tailorservicios.cl/empresas',
      },
    },
  };
}

export default function EmpresasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

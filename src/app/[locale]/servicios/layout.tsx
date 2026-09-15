import React from 'react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const isEn = locale === 'en';
  return {
    title: isEn ? 'HR Services & Solutions' : 'Servicios de Recursos Humanos',
    description: isEn
      ? 'Comprehensive HR solutions: Talent Acquisition, Payroll & Personnel Management, Executive Search, and Organizational Development in Chile.'
      : 'Soluciones integrales de Recursos Humanos: Reclutamiento y Selección, Gestión de Dotaciones, Búsqueda Ejecutiva y Desarrollo Organizacional.',
    alternates: {
      canonical: isEn ? 'https://tailorservicios.cl/en/servicios' : 'https://tailorservicios.cl/servicios',
      languages: {
        'es': 'https://tailorservicios.cl/servicios',
        'en': 'https://tailorservicios.cl/en/servicios',
        'x-default': 'https://tailorservicios.cl/servicios',
      },
    },
  };
}

export default function ServiciosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

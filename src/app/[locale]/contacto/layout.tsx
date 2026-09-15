import React from 'react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const isEn = locale === 'en';
  return {
    title: isEn ? 'Contact Us' : 'Contacto',
    description: isEn
      ? 'Get in touch with Tailor Servicios specialists in Punta Arenas and Santiago, Chile. We are ready to support your organization.'
      : 'Conversemos sobre el futuro de su equipo. Contáctenos en nuestras oficinas de Punta Arenas y Santiago de Chile.',
    alternates: {
      canonical: isEn ? 'https://tailorservicios.cl/en/contacto' : 'https://tailorservicios.cl/contacto',
      languages: {
        'es': 'https://tailorservicios.cl/contacto',
        'en': 'https://tailorservicios.cl/en/contacto',
        'x-default': 'https://tailorservicios.cl/contacto',
      },
    },
  };
}

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

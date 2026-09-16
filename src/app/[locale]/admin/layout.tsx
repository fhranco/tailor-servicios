import React from 'react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const isEn = locale === 'en';
  return {
    title: isEn ? 'Admin Dashboard' : 'Panel de Administración',
    description: isEn
      ? 'Secure dashboard for managing candidates, B2B inquiries, and compliance with Chilean Law 21.719.'
      : 'Panel seguro para la gestión de candidatos, solicitudes B2B y cumplimiento de la Ley 21.719.',
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    },
    alternates: {
      canonical: null,
      languages: {},
    },
  };
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

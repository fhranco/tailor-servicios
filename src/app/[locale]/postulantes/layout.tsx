import React from 'react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const isEn = locale === 'en';
  return {
    title: isEn ? 'Applicant & Job Portal' : 'Portal de Postulantes',
    description: isEn
      ? 'Access top career opportunities in Magallanes and throughout Chile through our verified Rex+ jobs portal.'
      : 'Accede a las mejores oportunidades laborales en Magallanes y todo Chile a través de nuestra red de talentos y portal oficial Rex+.',
    alternates: {
      canonical: isEn ? 'https://tailorservicios.cl/en/postulantes' : 'https://tailorservicios.cl/postulantes',
      languages: {
        'es': 'https://tailorservicios.cl/postulantes',
        'en': 'https://tailorservicios.cl/en/postulantes',
        'x-default': 'https://tailorservicios.cl/postulantes',
      },
    },
  };
}

export default function PostulantesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

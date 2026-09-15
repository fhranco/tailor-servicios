import { getTranslations } from 'next-intl/server';
import React from 'react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'CandidatosPage' });
  const isEn = locale === 'en';
  return {
    title: t('meta_title'),
    description: t('meta_desc'),
    alternates: {
      canonical: isEn ? 'https://tailorservicios.cl/en/candidatos' : 'https://tailorservicios.cl/candidatos',
      languages: {
        'es': 'https://tailorservicios.cl/candidatos',
        'en': 'https://tailorservicios.cl/en/candidatos',
        'x-default': 'https://tailorservicios.cl/candidatos',
      },
    },
  };
}

export default function CandidatosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

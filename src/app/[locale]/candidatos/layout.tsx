import { getTranslations } from 'next-intl/server';
import React from 'react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'CandidatosPage' });
  return {
    title: t('meta_title'),
    description: t('meta_desc'),
  };
}

export default function CandidatosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

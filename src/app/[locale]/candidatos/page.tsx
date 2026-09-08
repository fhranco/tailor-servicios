import React from 'react';
import HeroCandidatos from '@/components/HeroCandidatos';
import ClientPortalsSection from '@/components/ClientPortalsSection';
import JobOffersCarousel from '@/components/JobOffersCarousel';
import CandidateBenefits from '@/components/CandidateBenefits';
import CandidateProcess from '@/components/CandidateProcess';
import CandidateUpload from '@/components/CandidateUpload';
import CandidateVideoModal from '@/components/CandidateVideoModal';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'CandidatosPage' });
  return {
    title: t('meta_title'),
    description: t('meta_desc'),
  };
}

export default function CandidatosPage() {
  return (
    <main className="min-h-screen">
      <HeroCandidatos />
      <ClientPortalsSection />
      <JobOffersCarousel />
      <CandidateBenefits />
      <CandidateProcess />
      <CandidateUpload />
      
      {/* Popup de video para candidatos al iniciar */}
      <CandidateVideoModal videoSrc="/TAILOR2.mp4" delayMs={1200} />
    </main>
  );
}

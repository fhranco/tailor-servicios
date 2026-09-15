import HeroSpecialization from "@/components/HeroSpecialization";
import Specialization from "@/components/Specialization";
import MethodologyBlock from "@/components/MethodologyBlock";
import ContactSection from "@/components/ContactSection";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const isEn = locale === 'en';
  return {
    title: isEn ? 'Industry Specialization' : 'Especialización por Industria',
    description: isEn 
      ? 'Discover our strategic industry specializations in Aquaculture, Energy, Logistics, and Tourism in southern Chile.'
      : 'Conoce nuestras industrias estratégicas de especialización en Acuicultura, Energía, Logística y Turismo en el sur de Chile.',
    alternates: {
      canonical: isEn ? 'https://tailorservicios.cl/en/especializacion' : 'https://tailorservicios.cl/especializacion',
      languages: {
        'es': 'https://tailorservicios.cl/especializacion',
        'en': 'https://tailorservicios.cl/en/especializacion',
        'x-default': 'https://tailorservicios.cl/especializacion',
      },
    },
  };
}

export default function EspecializacionPage() {
  return (
    <main style={{ backgroundColor: 'var(--color-gray-light)', minHeight: '100vh', overflowX: 'hidden' }}>
      
      <HeroSpecialization />
      
      <Specialization />

      <MethodologyBlock />

      <ContactSection />
    </main>
  );
}

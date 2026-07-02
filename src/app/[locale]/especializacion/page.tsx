import HeroSpecialization from "@/components/HeroSpecialization";
import Specialization from "@/components/Specialization";
import MethodologyBlock from "@/components/MethodologyBlock";
import ContactSection from "@/components/ContactSection";

export const metadata = {
  title: 'Especialización | Tailor Servicios',
  description: 'Conoce nuestras industrias de especialización en la Región de Magallanes.',
};

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

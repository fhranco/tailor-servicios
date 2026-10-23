import dynamic from 'next/dynamic';
import HeroDual from "@/components/HeroDual";
import MetricsBar from "@/components/MetricsBar";
import AboutUsBlock from "@/components/AboutUsBlock";
import BusinessLines from "@/components/BusinessLines";
import ContactSection from "@/components/ContactSection";
import { setRequestLocale } from 'next-intl/server';

const ClientLogos = dynamic(() => import("@/components/ClientLogos"), { ssr: true });
const TestimonialSection = dynamic(() => import("@/components/TestimonialSection"), { ssr: true });
const LocationMap = dynamic(() => import("@/components/LocationMap"), { ssr: false });

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return (
    <main style={{ backgroundColor: 'var(--color-gray-light)', minHeight: '100vh', overflowX: 'hidden' }}>
      <HeroDual />
      
      <MetricsBar />

      <AboutUsBlock />
      
      <BusinessLines />
      
      <ClientLogos />
      
      <TestimonialSection />

      <ContactSection />

      <LocationMap />
    </main>
  );
}

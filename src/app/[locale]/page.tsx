import HeroDual from "@/components/HeroDual";
import ClientLogos from "@/components/ClientLogos";
import MetricsBar from "@/components/MetricsBar";
import BusinessLines from "@/components/BusinessLines";
import TestimonialSection from "@/components/TestimonialSection";
import AboutUsBlock from "@/components/AboutUsBlock";

import LocationMap from "@/components/LocationMap";
import ContactSection from "@/components/ContactSection";
import {setRequestLocale} from 'next-intl/server';

export default function Home({params: {locale}}: {params: {locale: string}}) {
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

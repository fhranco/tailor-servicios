import type { Metadata } from "next";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import VisitLogger from "@/components/VisitLogger";

export const metadata: Metadata = {
  metadataBase: new URL('https://tailorservicios.cl'),
  title: "Tailor Servicios | Soluciones de Recursos Humanos",
  description: "Consultoría estratégica en Reclutamiento, Gestión de Personas y Desarrollo Organizacional con despliegue operativo en Punta Arenas y Santiago.",
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "Tailor Servicios | Soluciones de Recursos Humanos",
    description: "Consultoría estratégica en Reclutamiento, Gestión de Personas y Desarrollo Organizacional.",
    url: "https://tailorservicios.cl",
    siteName: "Tailor Servicios",
    images: [
      {
        url: "/favicon.png",
        width: 800,
        height: 600,
        alt: "Tailor Servicios Logo",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
};

export default async function RootLayout({
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  // Providing all messages to the client side
  const messages = await getMessages();
  
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <VisitLogger />
          <Header />
          {children}
          <Footer />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

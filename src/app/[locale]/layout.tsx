import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import VisitLogger from "@/components/VisitLogger";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isEn = locale === 'en';
  const canonicalPath = isEn ? '/en' : '';
  const canonicalUrl = `https://tailorservicios.cl${canonicalPath}`;

  const title = isEn
    ? "Tailor Servicios | HR Consulting & Talent Acquisition in Chile"
    : "Tailor Servicios | Consultoría en Recursos Humanos y Gestión del Talento";

  const description = isEn
    ? "Strategic HR consulting, recruitment & headhunting, personnel management, and organizational development with active operations in Punta Arenas and Santiago, Chile."
    : "Consultoría estratégica en Reclutamiento y Selección, Gestión de Personas y Desarrollo Organizacional con presencia y despliegue operativo en Punta Arenas y Santiago de Chile.";

  return {
    metadataBase: new URL('https://tailorservicios.cl'),
    title: {
      default: title,
      template: "%s | Tailor Servicios",
    },
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'es': 'https://tailorservicios.cl',
        'en': 'https://tailorservicios.cl/en',
        'x-default': 'https://tailorservicios.cl',
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon.png', type: 'image/png' },
      ],
      apple: '/favicon.png',
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Tailor Servicios",
      images: [
        {
          url: "/tailor-servicios-horizontal.jpeg",
          width: 1080,
          height: 564,
          alt: "Tailor Servicios - Soluciones en Recursos Humanos",
        },
      ],
      locale: isEn ? "en_US" : "es_CL",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/tailor-servicios-horizontal.jpeg"],
    },
  };
}

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // 1. Validar que el locale pertenezca a la lista explícita configurada
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // 2. Habilitar renderizado estático en next-intl
  setRequestLocale(locale);

  // 3. Obtener mensajes para el cliente
  const messages = await getMessages();

  // 4. Datos estructurados JSON-LD Schema.org para Organización
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Tailor Servicios",
    "legalName": "Servicios Industriales Tailor SpA",
    "url": "https://tailorservicios.cl",
    "logo": "https://tailorservicios.cl/tailor-servicios-horizontal.jpeg",
    "image": "https://tailorservicios.cl/tailor-servicios-horizontal.jpeg",
    "description": "Consultoría estratégica en Reclutamiento, Selección de Personal, Gestión de Personas y Desarrollo Organizacional con presencia en Punta Arenas y Santiago de Chile.",
    "telephone": "+56-9-9758-0085",
    "email": "contacto@tailorservicios.cl",
    "address": [
      {
        "@type": "PostalAddress",
        "addressLocality": "Punta Arenas",
        "addressRegion": "Región de Magallanes y de la Antártica Chilena",
        "addressCountry": "CL"
      },
      {
        "@type": "PostalAddress",
        "addressLocality": "Santiago",
        "addressRegion": "Región Metropolitana",
        "addressCountry": "CL"
      }
    ],
    "sameAs": [
      "https://www.linkedin.com/company/tailor-servicios/posts/?feedView=all",
      "https://www.instagram.com/tailorservicios/",
      "https://www.facebook.com/tailorservi"
    ]
  };

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
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

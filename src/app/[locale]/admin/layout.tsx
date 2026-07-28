import React from 'react';

export const metadata = {
  title: 'Tailor Servicios | Panel de Administración',
  description: 'Panel seguro para la gestión de candidatos, solicitudes B2B y cumplimiento de la Ley 21.719.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

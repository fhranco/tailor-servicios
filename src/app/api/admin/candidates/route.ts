import { NextResponse } from 'next/server';

/**
 * Endpoint de compatibilidad para Candidatos.
 * 
 * Cumplimiento Ley 21.719 (Chile) - Principio de Minimización y Proporcionalidad:
 * Tailor Servicios NO almacena currículums ni datos de postulantes en base de datos web.
 * Todas las postulaciones son canalizadas directamente al ATS corporativo (Rexmas)
 * o al buzón oficial seleccion@tailorservicios.cl.
 */
export async function GET() {
  return NextResponse.json([], {
    headers: { 'Cache-Control': 'no-store, private' }
  });
}

export async function DELETE() {
  return NextResponse.json(
    { success: true, message: 'Operación no requerida: No se persisten datos de postulantes.' },
    { headers: { 'Cache-Control': 'no-store, private' } }
  );
}

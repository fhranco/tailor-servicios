import { NextRequest, NextResponse } from 'next/server';
import { getStoredJobs, syncRexmasJobs } from '@/services/rexmas';

export const dynamic = 'force-dynamic';

// Umbral para auto-sincronización en segundo plano: 12 horas (2 veces al día)
const AUTO_SYNC_THRESHOLD_MS = 12 * 60 * 60 * 1000;
let isSyncingInBackground = false;

// FASE 7 & 10: Endpoint interno GET /api/jobs con auto-sincronización SWR y caché
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const { jobs, updated_at } = await getStoredJobs(includeInactive);

    // AUTO-ACTUALIZACIÓN AUTÓNOMA:
    // Si la última sincronización tiene más de 15 minutos y no hay una sincronización en curso,
    // se dispara syncRexmasJobs() en segundo plano sin demorar la respuesta al usuario.
    const lastSyncTime = new Date(updated_at).getTime();
    const isStale = isNaN(lastSyncTime) || (Date.now() - lastSyncTime > AUTO_SYNC_THRESHOLD_MS);

    if (isStale && !isSyncingInBackground) {
      isSyncingInBackground = true;
      syncRexmasJobs()
        .then(() => {
          console.log('[Auto-Sync] Sincronización en segundo plano completada con éxito.');
        })
        .catch((err) => {
          console.warn('[Auto-Sync] Error en auto-sincronización en segundo plano:', err?.message);
        })
        .finally(() => {
          isSyncingInBackground = false;
        });
    }

    // Responder con datos y cabeceras de caché (5 minutos = 300s)
    return NextResponse.json(
      {
        success: true,
        updated_at,
        total: jobs.length,
        jobs
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error: any) {
    console.error('Error en GET /api/jobs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener ofertas laborales',
        details: error?.message || 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

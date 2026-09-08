import { NextRequest, NextResponse } from 'next/server';
import { syncRexmasJobs } from '@/services/rexmas';

export const dynamic = 'force-dynamic';

// FASE 6 & 11 & 12: Endpoint de sincronización programada o manual
export async function POST(req: NextRequest) {
  try {
    const result = await syncRexmasJobs();
    return NextResponse.json(
      {
        success: result.status !== 'failed',
        result
      },
      { status: result.status === 'failed' ? 502 : 200 }
    );
  } catch (error: any) {
    console.error('Error al ejecutar sincronización POST /api/jobs/sync:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Fallo crítico en sincronización',
        details: error?.message
      },
      { status: 500 }
    );
  }
}

// Soporte para GET /api/jobs/sync (para invocar por cron/ping periódicos de 15 min)
export async function GET(req: NextRequest) {
  try {
    const result = await syncRexmasJobs();
    return NextResponse.json(
      {
        success: result.status !== 'failed',
        result
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error al ejecutar sincronización GET /api/jobs/sync:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Fallo crítico en sincronización',
        details: error?.message
      },
      { status: 500 }
    );
  }
}

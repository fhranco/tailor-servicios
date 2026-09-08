import { createClient } from '@supabase/supabase-js';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

// Definición de tipos para las respuestas de Rex+ y modelos internos
export interface RexmasRawPublication {
  id: number;
  uuid: string;
  name: string;
  contract_type?: {
    name: string;
    value: string;
  };
  department_name?: string;
  department_id?: number;
  city_name?: string;
  country?: {
    name: string;
    flag?: string;
  };
  created_date: string;
  url: string;
  benefits?: Array<{
    name: string;
    icon_url?: string;
  }>;
}

export interface RexmasApiResponse {
  next: string | null;
  previous: string | null;
  results: RexmasRawPublication[];
}

export interface NormalizedJob {
  id?: string;
  external_id: string; // UUID estable de Rex+
  rex_id: number;
  title: string;
  location: string;
  area: string;
  work_type: string;
  description: string;
  url: string;
  published_at: string;
  active: boolean;
}

export interface SyncResult {
  status: 'success' | 'partial' | 'failed';
  found_count: number;
  created_count: number;
  updated_count: number;
  deactivated_count: number;
  error_details?: string | null;
  is_suspicious: boolean;
  synced_at: string;
}

// Configuración de Rex+
const REXMAS_BASE_URL = 'https://api.rexmas.com/seleccion/public';
const COMPANY_ID = 5; // ID asignado a Tailor Servicios en Rex+
const TENANT_SUBDOMAIN = 'serviciosindustrialetailor';

// Rutas de persistencia local (fallback resiliente)
const CACHE_DIR = path.join(process.cwd(), 'scratch');
const CACHE_FILE = path.join(CACHE_DIR, 'jobs_cache.json');
const LOGS_FILE = path.join(CACHE_DIR, 'job_sync_logs.json');

// Memoria volátil
let inMemoryJobsCache: NormalizedJob[] = [];
let lastSyncTimestamp: string | null = null;

// Helper para leer/escribir caché en archivo
function readLocalCache(): { updated_at: string; jobs: NormalizedJob[] } {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return { updated_at: lastSyncTimestamp || new Date().toISOString(), jobs: parsed };
      }
      return {
        updated_at: parsed.updated_at || new Date().toISOString(),
        jobs: Array.isArray(parsed.jobs) ? parsed.jobs : []
      };
    }
  } catch (e) {
    console.warn('No se pudo leer CACHE_FILE:', e);
  }
  return { updated_at: lastSyncTimestamp || new Date().toISOString(), jobs: inMemoryJobsCache };
}

function writeLocalCache(jobs: NormalizedJob[], timestamp: string) {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify({ updated_at: timestamp, jobs }, null, 2), 'utf-8');
  } catch (e) {
    console.warn('No se pudo escribir CACHE_FILE:', e);
  }
}

function appendLocalLog(log: SyncResult) {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    let logs: SyncResult[] = [];
    if (fs.existsSync(LOGS_FILE)) {
      logs = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8'));
    }
    logs.unshift(log);
    if (logs.length > 50) logs = logs.slice(0, 50); // Mantener últimos 50
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (e) {
    console.warn('No se pudo escribir LOGS_FILE:', e);
  }
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false }
  });
}

/**
 * Cliente HTTP resiliente: intenta fetch nativo primero,
 * y usa /usr/bin/curl si fetch es bloqueado por sandbox/DNS en entornos locales.
 */
async function performRexmasRequest(url: string): Promise<RexmasApiResponse> {
  const headers = {
    'Accept': 'application/json',
    'X-Tenant-Subdomain': TENANT_SUBDOMAIN,
    'User-Agent': 'TailorServicios-JobSync/1.0'
  };

  // 1. Intento con fetch nativo (para Vercel / producción)
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Si fetch falla, recurrir al respaldo con curl
  }

  // 2. Respaldo seguro con /usr/bin/curl
  try {
    const headerFlags = Object.entries(headers)
      .map(([k, v]) => `-H "${k}: ${v}"`)
      .join(' ');
    const { stdout } = await execAsync(`/usr/bin/curl -s ${headerFlags} "${url}"`);
    try {
      return JSON.parse(stdout);
    } catch (parseErr: any) {
      throw new Error(`Respuesta no JSON desde curl: ${stdout.slice(0, 150)}`);
    }
  } catch (curlErr: any) {
    throw new Error(`Fallo de conexión a Rex+ (fetch y curl fallaron): ${curlErr?.message}`);
  }
}

/**
 * FASE 1 & 12: Extractor desacoplado de ofertas de Rex+
 * Consume el endpoint JSON oficial con soporte de paginación por cursor.
 */
export async function fetchRexmasJobs(): Promise<{ results: RexmasRawPublication[]; total: number }> {
  const allResults: RexmasRawPublication[] = [];
  let nextUrl: string | null = `${REXMAS_BASE_URL}/jobs_portal/${COMPANY_ID}/publications`;
  let pageCount = 0;
  const maxPages = 10;

  while (nextUrl && pageCount < maxPages) {
    pageCount++;
    const data = await performRexmasRequest(nextUrl);
    if (Array.isArray(data.results)) {
      allResults.push(...data.results);
    }
    nextUrl = data.next;
  }

  return {
    results: allResults,
    total: allResults.length
  };
}

/**
 * FASE 2 & 12: Normalizador de ofertas laborales
 */
export function normalizeRexmasJob(raw: RexmasRawPublication): NormalizedJob {
  const locationParts: string[] = [];
  if (raw.city_name) locationParts.push(raw.city_name);
  if (raw.country?.name) locationParts.push(raw.country.name);
  const location = locationParts.length > 0 ? locationParts.join(', ') : 'Punta Arenas, Chile';

  const benefits = Array.isArray(raw.benefits) ? raw.benefits.map(b => b.name).filter(Boolean) : [];
  const description = benefits.length > 0 ? `Beneficios: ${benefits.join(' · ')}` : '';

  const externalId = raw.uuid || (raw.id ? String(raw.id) : '');

  return {
    external_id: externalId,
    rex_id: raw.id,
    title: raw.name ? raw.name.trim() : 'Oferta Laboral',
    location,
    area: raw.department_name || 'General',
    work_type: raw.contract_type?.name || 'Tiempo completo',
    description,
    url: raw.url || 'https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios',
    published_at: raw.created_date || new Date().toISOString(),
    active: true
  };
}

/**
 * FASE 4, 5 & 12: Sincronizador de ofertas con protección contra borrado accidental
 */
export async function syncRexmasJobs(): Promise<SyncResult> {
  const timestamp = new Date().toISOString();
  let status: 'success' | 'partial' | 'failed' = 'failed';
  let foundCount = 0;
  let createdCount = 0;
  let updatedCount = 0;
  let deactivatedCount = 0;
  let errorDetails: string | null = null;
  let isSuspicious = false;

  const supabase = getSupabaseClient();

  // 1. Obtener ofertas previas (desde Supabase o caché local)
  let existingJobs: NormalizedJob[] = [];
  try {
    if (supabase) {
      const { data, error } = await supabase.from('jobs').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        existingJobs = data as NormalizedJob[];
      } else {
        existingJobs = readLocalCache().jobs;
      }
    } else {
      existingJobs = readLocalCache().jobs;
    }
  } catch (err: any) {
    existingJobs = readLocalCache().jobs;
  }

  const previousActiveCount = existingJobs.filter(j => j.active).length;

  // 2. Extraer ofertas en vivo desde Rex+
  let fetchedJobsRaw: RexmasRawPublication[] = [];
  try {
    const fetched = await fetchRexmasJobs();
    fetchedJobsRaw = fetched.results;
    foundCount = fetched.total;
    status = 'success';
  } catch (fetchErr: any) {
    // FASE 5 (CASOS 4 y 5): Si Rex+ falla, NO modificar estado de ofertas existentes
    status = 'failed';
    errorDetails = fetchErr?.message || 'Error al conectar con Rex+';
    console.error('Error sincronizando con Rex+:', errorDetails);

    const failResult: SyncResult = {
      status,
      found_count: 0,
      created_count: 0,
      updated_count: 0,
      deactivated_count: 0,
      error_details: errorDetails,
      is_suspicious: false,
      synced_at: timestamp
    };
    appendLocalLog(failResult);
    return failResult;
  }

  // FASE 5 (CASO 6): Detección de anomalía sospechosa de 0 ofertas
  if (previousActiveCount > 1 && foundCount === 0) {
    isSuspicious = true;
    status = 'partial';
    errorDetails = `Alerta: Rex+ devolvió 0 ofertas cuando anteriormente existían ${previousActiveCount}. Se bloquea la desactivación masiva.`;
    console.warn(errorDetails);

    const suspiciousResult: SyncResult = {
      status,
      found_count: 0,
      created_count: 0,
      updated_count: 0,
      deactivated_count: 0,
      error_details: errorDetails,
      is_suspicious: true,
      synced_at: timestamp
    };
    appendLocalLog(suspiciousResult);
    return suspiciousResult;
  }

  // 3. Normalizar
  const normalizedIncoming = fetchedJobsRaw.map(normalizeRexmasJob);
  const incomingMap = new Map<string, NormalizedJob>();
  normalizedIncoming.forEach(job => incomingMap.set(job.external_id, job));

  const existingMap = new Map<string, NormalizedJob>();
  existingJobs.forEach(job => existingMap.set(job.external_id, job));

  // 4. Identificar nuevas y actualizadas
  const toUpsert: NormalizedJob[] = [];
  const toDeactivateExternalIds: string[] = [];

  incomingMap.forEach((incoming, extId) => {
    const existing = existingMap.get(extId);
    if (!existing) {
      toUpsert.push(incoming);
      createdCount++;
    } else {
      const hasChanged =
        existing.title !== incoming.title ||
        existing.location !== incoming.location ||
        existing.area !== incoming.area ||
        existing.work_type !== incoming.work_type ||
        existing.url !== incoming.url ||
        existing.active === false;

      if (hasChanged) {
        toUpsert.push({ ...incoming, active: true });
        updatedCount++;
      }
    }
  });

  // 5. Identificar bajas (solo si status === 'success' y no sospechoso)
  if (status === 'success' && !isSuspicious) {
    existingMap.forEach((existing, extId) => {
      if (!incomingMap.has(extId) && existing.active) {
        toDeactivateExternalIds.push(extId);
        deactivatedCount++;
      }
    });
  }

  // 6. Persistir en Supabase (si está disponible)
  if (supabase) {
    try {
      if (toUpsert.length > 0) {
        for (const job of toUpsert) {
          await supabase.from('jobs').upsert({
            external_id: job.external_id,
            rex_id: job.rex_id,
            title: job.title,
            location: job.location,
            area: job.area,
            work_type: job.work_type,
            description: job.description,
            url: job.url,
            published_at: job.published_at,
            active: true,
            updated_at: timestamp
          }, { onConflict: 'external_id' });
        }
      }

      if (toDeactivateExternalIds.length > 0) {
        await supabase
          .from('jobs')
          .update({ active: false, updated_at: timestamp })
          .in('external_id', toDeactivateExternalIds);
      }

      await supabase.from('job_sync_logs').insert([{
        synced_at: timestamp,
        status,
        found_count: foundCount,
        created_count: createdCount,
        updated_count: updatedCount,
        deactivated_count: deactivatedCount,
        error_details: errorDetails,
        is_suspicious: isSuspicious
      }]);
    } catch (dbErr: any) {
      console.warn('Nota: Supabase no disponible para sincronización directa, guardando en caché local.');
    }
  }

  // 7. Persistir en caché local y memoria
  const updatedList: NormalizedJob[] = [];
  for (const job of existingJobs) {
    if (toDeactivateExternalIds.includes(job.external_id)) {
      updatedList.push({ ...job, active: false });
    } else if (!incomingMap.has(job.external_id)) {
      updatedList.push(job);
    }
  }
  for (const incoming of normalizedIncoming) {
    updatedList.push(incoming);
  }

  inMemoryJobsCache = updatedList;
  lastSyncTimestamp = timestamp;
  writeLocalCache(updatedList, timestamp);

  const result: SyncResult = {
    status,
    found_count: foundCount,
    created_count: createdCount,
    updated_count: updatedCount,
    deactivated_count: deactivatedCount,
    error_details: errorDetails,
    is_suspicious: isSuspicious,
    synced_at: timestamp
  };

  appendLocalLog(result);
  return result;
}

/**
 * FASE 7: Consultar ofertas almacenadas
 */
export async function getStoredJobs(includeInactive: boolean = false): Promise<{ jobs: NormalizedJob[]; updated_at: string }> {
  const supabase = getSupabaseClient();
  let jobs: NormalizedJob[] = [];

  // Intentar leer de Supabase
  if (supabase) {
    try {
      let query = supabase.from('jobs').select('*');
      if (!includeInactive) {
        query = query.eq('active', true);
      }
      query = query.order('published_at', { ascending: false });
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        jobs = data as NormalizedJob[];
      }
    } catch (e) {
      // Usar respaldo
    }
  }

  // Si Supabase no tiene datos o no está migrado, leer caché local
  let cacheUpdatedAt = lastSyncTimestamp;
  if (jobs.length === 0) {
    const cached = readLocalCache();
    jobs = cached.jobs.filter(j => includeInactive || j.active);
    cacheUpdatedAt = cached.updated_at;
  }

  // Si la caché está vacía, ejecutar sincronización inmediata
  if (jobs.length === 0) {
    await syncRexmasJobs();
    const cached = readLocalCache();
    jobs = cached.jobs.filter(j => includeInactive || j.active);
    cacheUpdatedAt = cached.updated_at;
  }

  return {
    jobs,
    updated_at: cacheUpdatedAt || new Date().toISOString()
  };
}

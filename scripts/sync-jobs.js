const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REXMAS_URL = 'https://api.rexmas.com/seleccion/public/jobs_portal/5/publications';
const TENANT_SUBDOMAIN = 'serviciosindustrialetailor';

const CACHE_DIR = path.join(__dirname, '..', 'scratch');
const CACHE_FILE = path.join(CACHE_DIR, 'jobs_cache.json');
const LOGS_FILE = path.join(CACHE_DIR, 'job_sync_logs.json');

function normalizeRexmasJob(raw) {
  const locationParts = [];
  if (raw.city_name) locationParts.push(raw.city_name);
  if (raw.country?.name) locationParts.push(raw.country.name);
  const location = locationParts.length > 0 ? locationParts.join(', ') : 'Punta Arenas, Chile';

  const benefits = Array.isArray(raw.benefits) ? raw.benefits.map(b => b.name).filter(Boolean) : [];
  const description = benefits.length > 0 ? `Beneficios: ${benefits.join(' · ')}` : '';
  const externalId = raw.uuid || (raw.id ? String(raw.id) : '');

  return {
    id: raw.uuid,
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

async function runSync() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Iniciando sincronización con Rex+...`);

  // 1. Leer existentes
  let existingJobs = [];
  if (fs.existsSync(CACHE_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      existingJobs = data.jobs || [];
    } catch (e) {}
  }
  const previousActiveCount = existingJobs.filter(j => j.active).length;

  // 2. Extraer de Rex+
  let stdout;
  try {
    stdout = execSync(
      `/usr/bin/curl -s -H "Accept: application/json" -H "X-Tenant-Subdomain: ${TENANT_SUBDOMAIN}" "${REXMAS_URL}"`
    );
  } catch (err) {
    console.error('Error conectando con Rex+:', err.message);
    logResult({
      synced_at: timestamp,
      status: 'failed',
      found_count: 0,
      created_count: 0,
      updated_count: 0,
      deactivated_count: 0,
      error_details: err.message,
      is_suspicious: false
    });
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(stdout.toString());
  } catch (e) {
    console.error('Respuesta no JSON de Rex+:', stdout.toString().slice(0, 150));
    logResult({
      synced_at: timestamp,
      status: 'failed',
      found_count: 0,
      created_count: 0,
      updated_count: 0,
      deactivated_count: 0,
      error_details: 'Respuesta inválida de Rex+',
      is_suspicious: false
    });
    return;
  }

  const rawResults = parsed.results || [];
  const foundCount = rawResults.length;
  console.log(`Ofertas encontradas en Rex+: ${foundCount}`);

  // FASE 5 (CASO 6): Detección de anomalía sospechosa
  if (previousActiveCount > 1 && foundCount === 0) {
    console.warn(`[ALERTA] Rex+ devolvió 0 ofertas (antes había ${previousActiveCount}). Se bloquea desactivación masiva.`);
    logResult({
      synced_at: timestamp,
      status: 'partial',
      found_count: 0,
      created_count: 0,
      updated_count: 0,
      deactivated_count: 0,
      error_details: 'Alerta sospechosa: 0 ofertas devueltas, desactivación bloqueada.',
      is_suspicious: true
    });
    return;
  }

  // 3. Normalizar
  const incomingNormalized = rawResults.map(normalizeRexmasJob);
  const incomingMap = new Map();
  incomingNormalized.forEach(j => incomingMap.set(j.external_id, j));

  const existingMap = new Map();
  existingJobs.forEach(j => existingMap.set(j.external_id, j));

  let createdCount = 0;
  let updatedCount = 0;
  let deactivatedCount = 0;

  for (const [extId, incoming] of incomingMap.entries()) {
    const existing = existingMap.get(extId);
    if (!existing) {
      createdCount++;
    } else {
      const changed =
        existing.title !== incoming.title ||
        existing.location !== incoming.location ||
        existing.area !== incoming.area ||
        existing.work_type !== incoming.work_type ||
        existing.url !== incoming.url ||
        existing.active === false;
      if (changed) updatedCount++;
    }
  }

  // Bajas controladas (soft delete active=false)
  for (const [extId, existing] of existingMap.entries()) {
    if (!incomingMap.has(extId) && existing.active) {
      deactivatedCount++;
    }
  }

  // 4. Construir lista consolidada
  const updatedList = [];
  for (const existing of existingJobs) {
    if (!incomingMap.has(existing.external_id)) {
      // Si ya no está en Rex+, marcar como inactivo
      updatedList.push({ ...existing, active: false });
    }
  }
  for (const incoming of incomingNormalized) {
    updatedList.push(incoming);
  }

  // Guardar en cache local
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify({ updated_at: timestamp, jobs: updatedList }, null, 2), 'utf-8');

  console.log(`Sincronización completada exitosamente:`);
  console.log(` - Encontradas: ${foundCount}`);
  console.log(` - Nuevas: ${createdCount}`);
  console.log(` - Actualizadas: ${updatedCount}`);
  console.log(` - Desactivadas: ${deactivatedCount}`);

  logResult({
    synced_at: timestamp,
    status: 'success',
    found_count: foundCount,
    created_count: createdCount,
    updated_count: updatedCount,
    deactivated_count: deactivatedCount,
    error_details: null,
    is_suspicious: false
  });
}

function logResult(log) {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  let logs = [];
  if (fs.existsSync(LOGS_FILE)) {
    try {
      logs = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8'));
    } catch (e) {}
  }
  logs.unshift(log);
  if (logs.length > 50) logs = logs.slice(0, 50);
  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), 'utf-8');
}

runSync();

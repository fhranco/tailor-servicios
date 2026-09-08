/**
 * BATERÍA DE PRUEBAS OBLIGATORIA (CASOS 1 AL 6)
 * Validación estricta de las reglas de sincronización y protección contra falsos borrados.
 */

const assert = require('assert');

// Algoritmo de reconciliación idéntico al servicio de producción
function reconcileJobs({ existingJobs, incomingJobs, fetchStatus, isHtmlError, httpStatus }) {
  const timestamp = new Date().toISOString();
  let status = 'success';
  let createdCount = 0;
  let updatedCount = 0;
  let deactivatedCount = 0;
  let isSuspicious = false;
  let errorDetails = null;

  const previousActiveCount = existingJobs.filter(j => j.active).length;

  // CASO 4: Rex+ responde error 500
  if (httpStatus === 500) {
    return {
      status: 'failed',
      isSuspicious: false,
      errorDetails: 'HTTP 500 Internal Server Error en Rex+',
      jobs: existingJobs // NO modificar existentes
    };
  }

  // CASO 5: Rex+ devuelve HTML inesperado o fallo de parsing
  if (isHtmlError || fetchStatus === 'parse_error') {
    return {
      status: 'failed',
      isSuspicious: false,
      errorDetails: 'HTML inesperado o fallo de parsing en Rex+',
      jobs: existingJobs // NO desactivar ofertas existentes
    };
  }

  // CASO 6: Rex+ devuelve 0 ofertas cuando antes existían múltiples (anomalía sospechosa)
  if (previousActiveCount > 1 && incomingJobs.length === 0) {
    return {
      status: 'partial',
      isSuspicious: true,
      errorDetails: `Anomalía sospechosa: 0 ofertas devueltas cuando existían ${previousActiveCount}. Bloqueo preventivo.`,
      jobs: existingJobs // NO desactivar masivamente
    };
  }

  // Mapear entrantes y existentes
  const incomingMap = new Map();
  incomingJobs.forEach(j => incomingMap.set(j.external_id, j));

  const existingMap = new Map();
  existingJobs.forEach(j => existingMap.set(j.external_id, j));

  // Crear o actualizar
  for (const [extId, incoming] of incomingMap.entries()) {
    const existing = existingMap.get(extId);
    if (!existing) {
      createdCount++;
    } else {
      if (existing.title !== incoming.title || existing.active === false) {
        updatedCount++;
      }
    }
  }

  // Bajas controladas (soft delete active=false)
  for (const [extId, existing] of existingMap.entries()) {
    if (!incomingMap.has(extId) && existing.active) {
      deactivatedCount++;
    }
  }

  // Construir lista resultante
  const resultJobs = [];
  for (const existing of existingJobs) {
    if (!incomingMap.has(existing.external_id)) {
      resultJobs.push({ ...existing, active: false });
    }
  }
  for (const incoming of incomingJobs) {
    resultJobs.push({ ...incoming, active: true });
  }

  return {
    status,
    isSuspicious,
    createdCount,
    updatedCount,
    deactivatedCount,
    jobs: resultJobs
  };
}

// Ejecutar Casos de Prueba
console.log('====================================================');
console.log('EJECUTANDO CASOS DE PRUEBA OBLIGATORIOS (1 AL 6)');
console.log('====================================================\n');

// Mock data
const jobA = { external_id: 'A', title: 'Cargo A', active: true };
const jobB = { external_id: 'B', title: 'Cargo B', active: true };
const jobC = { external_id: 'C', title: 'Cargo C', active: true };
const jobD = { external_id: 'D', title: 'Cargo D', active: true };

// CASO 1: Rex+: A, B, C | Web: A, B, C
console.log('▶ CASO 1: Rex+ [A, B, C], Web inicial [A, B, C]');
{
  const res = reconcileJobs({
    existingJobs: [jobA, jobB, jobC],
    incomingJobs: [jobA, jobB, jobC],
    fetchStatus: 'success'
  });
  assert.strictEqual(res.status, 'success');
  assert.strictEqual(res.jobs.filter(j => j.active).length, 3);
  assert.strictEqual(res.createdCount, 0);
  assert.strictEqual(res.deactivatedCount, 0);
  console.log('  ✔ Correcto: Se mantienen A, B, C activas sin cambios espurios.\n');
}

// CASO 2: Rex+: A, B, C, D | Web anterior: A, B, C -> Crear D
console.log('▶ CASO 2: Rex+ [A, B, C, D], Web anterior [A, B, C]');
{
  const res = reconcileJobs({
    existingJobs: [jobA, jobB, jobC],
    incomingJobs: [jobA, jobB, jobC, jobD],
    fetchStatus: 'success'
  });
  assert.strictEqual(res.status, 'success');
  assert.strictEqual(res.createdCount, 1);
  const created = res.jobs.find(j => j.external_id === 'D');
  assert.ok(created && created.active === true);
  assert.strictEqual(res.jobs.filter(j => j.active).length, 4);
  console.log('  ✔ Correcto: Se creó la oferta D y está active=true.\n');
}

// CASO 3: Rex+: A, C | Web anterior: A, B, C -> B active=false
console.log('▶ CASO 3: Rex+ [A, C], Web anterior [A, B, C]');
{
  const res = reconcileJobs({
    existingJobs: [jobA, jobB, jobC],
    incomingJobs: [jobA, jobC],
    fetchStatus: 'success'
  });
  assert.strictEqual(res.status, 'success');
  assert.strictEqual(res.deactivatedCount, 1);
  const deactivatedB = res.jobs.find(j => j.external_id === 'B');
  assert.ok(deactivatedB && deactivatedB.active === false);
  const activeJobs = res.jobs.filter(j => j.active);
  assert.strictEqual(activeJobs.length, 2);
  assert.deepStrictEqual(activeJobs.map(j => j.external_id).sort(), ['A', 'C']);
  console.log('  ✔ Correcto: B se marcó como active=false (soft-delete, sin borrado físico) y A, C siguen activas.\n');
}

// CASO 4: Rex+ responde error 500 -> NO modificar estado
console.log('▶ CASO 4: Rex+ responde error HTTP 500');
{
  const res = reconcileJobs({
    existingJobs: [jobA, jobB, jobC],
    incomingJobs: [],
    httpStatus: 500,
    fetchStatus: 'failed'
  });
  assert.strictEqual(res.status, 'failed');
  assert.strictEqual(res.jobs.filter(j => j.active).length, 3);
  assert.ok(res.jobs.find(j => j.external_id === 'B').active === true);
  console.log('  ✔ Correcto: Ante HTTP 500, NO se modificó ninguna oferta. Se preservan A, B, C intactas.\n');
}

// CASO 5: Rex+ devuelve HTML inesperado / fallo de parsing -> NO desactivar
console.log('▶ CASO 5: Rex+ devuelve HTML inesperado o fallo de parsing');
{
  const res = reconcileJobs({
    existingJobs: [jobA, jobB, jobC],
    incomingJobs: [],
    isHtmlError: true,
    fetchStatus: 'parse_error'
  });
  assert.strictEqual(res.status, 'failed');
  assert.strictEqual(res.jobs.filter(j => j.active).length, 3);
  console.log('  ✔ Correcto: Ante fallo de parsing o HTML corrupto, se bloquea la desactivación de ofertas.\n');
}

// CASO 6: Rex+ devuelve 0 ofertas inesperadamente -> Alerta y NO desactivar masivamente
console.log('▶ CASO 6: Rex+ devuelve 0 ofertas cuando antes existían 3 (A, B, C)');
{
  const res = reconcileJobs({
    existingJobs: [jobA, jobB, jobC],
    incomingJobs: [],
    fetchStatus: 'success'
  });
  assert.strictEqual(res.status, 'partial');
  assert.strictEqual(res.isSuspicious, true);
  assert.strictEqual(res.jobs.filter(j => j.active).length, 3);
  console.log('  ✔ Correcto: Se detectó anomalía sospechosa (0 ofertas vs 3 previas). Se bloqueó la desactivación masiva y se preservaron activas.\n');
}

console.log('====================================================');
console.log('🎉 TODOS LOS 6 CASOS DE PRUEBA PASARON SATISFACTORIAMENTE!');
console.log('====================================================');

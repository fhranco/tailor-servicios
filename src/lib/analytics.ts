/**
 * Módulo de Analítica y Medición Respetuosa con la Privacidad (Ley 21.719 - Chile)
 * Tailor Servicios - Google Analytics 4 (G-15335FB34S)
 */

export const GA_MEASUREMENT_ID = 'G-15335FB34S';

/**
 * Verifica si el usuario ha otorgado consentimiento expreso para analítica
 * a través del CookieBanner ('tailor_cookie_consent=all').
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof document === 'undefined') return false;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('tailor_cookie_consent='));
  if (!match) return false;
  const val = match.split('=')[1];
  return val === 'all';
}

/**
 * Lista de claves o términos prohibidos para evitar el envío inadvertido
 * de Información Personal Identificable (PII) según la Ley 21.719.
 */
const FORBIDDEN_KEYS = [
  'name', 'nombre', 'full_name', 'first_name', 'last_name', 'apellido',
  'email', 'correo', 'mail',
  'phone', 'telefono', 'tel', 'celular', 'mobile',
  'message', 'mensaje', 'comentario',
  'company', 'empresa', 'company_name',
  'rut', 'dni', 'identificacion',
  'address', 'direccion', 'curriculum', 'cv'
];

/**
 * Envío seguro de eventos personalizados a GA4.
 * - Verifica consentimiento previo.
 * - Filtra cualquier campo que contenga o aparente contener datos personales.
 * - No procesa valores si el usuario ha rechazado las cookies.
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;
  if (!hasAnalyticsConsent()) return;
  if (typeof (window as any).gtag !== 'function') return;

  const sanitizedParams: Record<string, any> = {};

  for (const [key, value] of Object.entries(params)) {
    const lowerKey = key.toLowerCase();
    
    // 1. Omitir si la clave es sospechosa de contener datos personales
    if (FORBIDDEN_KEYS.some((forbidden) => lowerKey.includes(forbidden))) {
      continue;
    }

    // 2. Omitir objetos anidados o estructuras complejas
    if (typeof value === 'object' && value !== null) {
      continue;
    }

    // 3. Inspeccionar el valor para descartar cadenas con emails o números de teléfono
    if (typeof value === 'string') {
      if (value.includes('@') || /^\+?[0-9\s-]{7,15}$/.test(value)) {
        continue;
      }
    }

    sanitizedParams[key] = value;
  }

  (window as any).gtag('event', eventName, sanitizedParams);
}

/**
 * Elimina las cookies de Google Analytics si el usuario revoca su consentimiento
 * o selecciona únicamente cookies esenciales.
 */
export function deleteGACookies() {
  if (typeof document === 'undefined') return;
  
  // Desactivar rastreo en la ventana actual
  (window as any)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;

  const cookies = document.cookie.split('; ');
  const hostParts = window.location.hostname.split('.');
  
  // Posibles dominios para expiración de cookies
  const domains = [
    window.location.hostname,
    '.' + window.location.hostname,
    hostParts.length > 1 ? '.' + hostParts.slice(-2).join('.') : ''
  ].filter(Boolean);

  for (const cookie of cookies) {
    const cookieName = cookie.split('=')[0];
    if (cookieName.startsWith('_ga') || cookieName === '_gid') {
      for (const domain of domains) {
        document.cookie = `${cookieName}=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`;
      }
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`;
    }
  }
}

import { createClient } from '@supabase/supabase-js';

export async function getAuthorizedUser(req: Request) {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }
  
  // Verificación estricta de privilegios de administrador (Ley 21.719 - Control de acceso)
  // Reglas:
  // 1. user_metadata NO se utiliza para autorización (es manipulable por el usuario en el cliente).
  // 2. No existen correos predeterminados ni fallbacks a casillas comerciales.
  // 3. Si no existe un administrador explícitamente autorizado en la configuración o claims protegidos, se deniega el acceso.
  const rawAdminEmails = process.env.ADMIN_ALLOWED_EMAILS || '';
  const adminEmails = rawAdminEmails
    ? rawAdminEmails.split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
    : [];

  const userEmail = (user.email || '').toLowerCase();
  const hasAdminRole = user.app_metadata?.role === 'admin';
  const isExplicitlyAuthorizedEmail = adminEmails.length > 0 && adminEmails.includes(userEmail);

  if (!hasAdminRole && !isExplicitlyAuthorizedEmail) {
    console.warn(`[Auth] Acceso administrativo denegado: Usuario ${user.email || user.id} no cuenta con autorización explícita.`);
    return null;
  }
  
  return user;
}

/**
 * Enmascara direcciones IP para cumplimiento de la Ley 21.719 (Minimización de datos).
 * Convierte IPv4 ej. 201.215.236.121 -> 201.215.*.*
 * O IPv6 ej. 2001:0db8:... -> 2001:db8:*:*
 */
export function maskIp(rawIp: string | null | undefined): string {
  if (!rawIp || rawIp === 'unknown') return 'anonymized';
  const clientIp = rawIp.split(',')[0].trim();
  if (clientIp.includes('.')) {
    const parts = clientIp.split('.');
    if (parts.length >= 2) {
      return `${parts[0]}.${parts[1]}.*.*`;
    }
  }
  if (clientIp.includes(':')) {
    const parts = clientIp.split(':');
    return `${parts.slice(0, 2).join(':')}:*:*`;
  }
  return 'anonymized';
}

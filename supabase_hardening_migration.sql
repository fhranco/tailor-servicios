-- =========================================================================
-- MIGRACIÓN DE HARDENING FINAL RLS Y GRANTS — SUPABASE (TAILOR SERVICIOS)
-- Cumplimiento estricto Ley 21.719 (Chile) de Protección de Datos Personales
--
-- OBJETIVO:
-- 1. Eliminar las 6 advertencias RLS de Security Advisor ("RLS Policy Always True").
-- 2. 0 acceso directo para anon y authenticated en las 4 tablas críticas.
-- 3. Acceso 100% mediado por Route Handlers server-side de Next.js mediante SUPABASE_SERVICE_ROLE_KEY.
-- 4. RLS continúa habilitado en todas las tablas como defensa en profundidad.
-- =========================================================================

-- 1. Revocar completamente el acceso directo a anon y authenticated
REVOKE ALL PRIVILEGES ON TABLE public.b2b_leads FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.blog_articles FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.privacy_audit_logs FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.web_visits FROM anon, authenticated;

-- 2. Asegurar que Row Level Security (RLS) permanezca HABILITADO
ALTER TABLE public.b2b_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_visits ENABLE ROW LEVEL SECURITY;

-- 3. Eliminar todas las policies permisivas que generaban advertencias en Security Advisor
DROP POLICY IF EXISTS "Allow public inserts for b2b_leads" ON public.b2b_leads;
DROP POLICY IF EXISTS "Permitir inserts publicos en b2b_leads" ON public.b2b_leads;
DROP POLICY IF EXISTS "Allow authenticated admins to read b2b_leads" ON public.b2b_leads;
DROP POLICY IF EXISTS "Allow authenticated admins to delete b2b_leads" ON public.b2b_leads;

DROP POLICY IF EXISTS "Allow public read for published articles" ON public.blog_articles;
DROP POLICY IF EXISTS "Allow admin to manage blog articles" ON public.blog_articles;

DROP POLICY IF EXISTS "Allow system to insert logs" ON public.privacy_audit_logs;
DROP POLICY IF EXISTS "Allow admin to select logs" ON public.privacy_audit_logs;

DROP POLICY IF EXISTS "Allow public inserts for web_visits" ON public.web_visits;
DROP POLICY IF EXISTS "Allow admin to select web_visits" ON public.web_visits;

-- 4. Consultas de verificación para certificar el estado final

-- A. Verificar 0 policies activas en las 4 tablas críticas
SELECT
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN (
  'b2b_leads',
  'blog_articles',
  'privacy_audit_logs',
  'web_visits'
)
ORDER BY tablename, policyname;

-- B. Verificar privilegios otorgados (anon y authenticated deben tener 0 filas)
SELECT
  table_name,
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
AND table_name IN (
  'b2b_leads',
  'blog_articles',
  'privacy_audit_logs',
  'web_visits'
)
AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY table_name, grantee, privilege_type;

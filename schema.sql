-- =========================================================================
-- ESQUEMA DEFINITIVO SUPABASE - TAILOR SERVICIOS
-- Cumplimiento estricto Ley 21.719 (Chile) de Protección de Datos Personales
--
-- PRINCIPIO DE MINIMIZACIÓN Y PROPORCIONALIDAD (Art. 4 Ley 21.719):
-- Tailor Servicios NO almacena currículums ni datos de postulantes en la web.
-- Las postulaciones laborales se derivan 100% al ATS oficial (Rexmas)
-- o al buzón corporativo seleccion@tailorservicios.cl.
--
-- TABLAS ACTIVAS:
-- 1. b2b_leads: Solicitudes de contacto corporativo B2B
-- 2. privacy_audit_logs: Trazabilidad legal de accesos administrativos
-- 3. web_visits: Métricas de navegación anónima con IP enmascarada
-- 4. blog_articles: Catálogo de artículos del Blog (CMS con soporte HTML)
-- 5. jobs / job_sync_logs: Catálogo público de ofertas laborales (Rex+)
-- =========================================================================

-- =========================================================================
-- 0. Limpieza de tablas y recursos no utilizados (Minimización)
-- =========================================================================
DROP TABLE IF EXISTS public.candidates CASCADE;
-- NOTA: Si creaste el bucket 'cvs' en Supabase Storage, elimínalo desde el menú Storage > Buckets de Supabase.


-- =========================================================================
-- 1. Tabla 'b2b_leads': Contactos comerciales corporativos
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.b2b_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  service_interest TEXT NOT NULL,
  phone TEXT,
  message TEXT
);

ALTER TABLE public.b2b_leads ENABLE ROW LEVEL SECURITY;

-- Inserción pública (formulario web de contacto comercial)
DROP POLICY IF EXISTS "Allow public inserts for b2b_leads" ON public.b2b_leads;
CREATE POLICY "Allow public inserts for b2b_leads" 
  ON public.b2b_leads FOR INSERT 
  WITH CHECK (true);

-- Lectura exclusiva para administradores autenticados o backend Service Role
DROP POLICY IF EXISTS "Allow authenticated admins to read b2b_leads" ON public.b2b_leads;
CREATE POLICY "Allow authenticated admins to read b2b_leads" 
  ON public.b2b_leads FOR SELECT 
  TO authenticated 
  USING (true);

-- Eliminación / Derecho de Supresión (Ley 21.719)
DROP POLICY IF EXISTS "Allow authenticated admins to delete b2b_leads" ON public.b2b_leads;
CREATE POLICY "Allow authenticated admins to delete b2b_leads" 
  ON public.b2b_leads FOR DELETE 
  TO authenticated 
  USING (true);

-- =========================================================================
-- 2. Tabla 'privacy_audit_logs': Bitácora legal de auditoría (Ley 21.719)
-- Registra accesos y operaciones sobre datos personales para demostrar diligencia.
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.privacy_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  action TEXT NOT NULL,          -- 'SELECT_LEADS', 'DELETE_LEAD', etc.
  performed_by TEXT NOT NULL,    -- Email del admin o 'SYSTEM'
  target_id UUID,                -- ID del lead intervenido
  ip_address TEXT,               -- IP enmascarada / anonimizada (ej. 200.12.*.*)
  user_agent TEXT
);

ALTER TABLE public.privacy_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow system to insert logs" ON public.privacy_audit_logs;
CREATE POLICY "Allow system to insert logs" 
  ON public.privacy_audit_logs FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin to select logs" ON public.privacy_audit_logs;
CREATE POLICY "Allow admin to select logs" 
  ON public.privacy_audit_logs FOR SELECT 
  TO authenticated 
  USING (true);

-- =========================================================================
-- 3. Tabla 'web_visits': Registro de navegación sin perfilamiento individual
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.web_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  page_path TEXT NOT NULL,
  referrer TEXT,
  locale TEXT,
  user_agent TEXT,
  ip_hash TEXT                   -- Hash irreversible para cálculo de sesiones
);

ALTER TABLE public.web_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public inserts for web_visits" ON public.web_visits;
CREATE POLICY "Allow public inserts for web_visits" 
  ON public.web_visits FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin to select web_visits" ON public.web_visits;
CREATE POLICY "Allow admin to select web_visits" 
  ON public.web_visits FOR SELECT 
  TO authenticated 
  USING (true);

-- =========================================================================
-- 4. Tabla 'blog_articles': Artículos del Blog (CMS Tailor)
-- Soporta etiquetas HTML directas (<h2>, <h3>, <ul>, <p>, <blockquote>),
-- autoría institucional, portadas y SEO técnico.
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.blog_articles (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL DEFAULT 'Gestión de Personas',
  category_key TEXT NOT NULL DEFAULT 'personas',
  author_id TEXT NOT NULL DEFAULT 'consultoria',
  author_name TEXT NOT NULL DEFAULT 'Equipo de Consultoría Tailor',
  author_role TEXT DEFAULT 'Especialistas en Reclutamiento & Gestión de Personas',
  author_institution TEXT DEFAULT 'Tailor Servicios',
  author_avatar TEXT DEFAULT 'TS',
  image TEXT NOT NULL DEFAULT '/Images/tailor-web15.webp',
  image_alt TEXT,
  summary TEXT,
  content_html TEXT,              -- Contenido HTML con formato nativo y tags respetados
  content_json JSONB,             -- Estructura de respaldo y campos bilingües
  title_en TEXT,                  -- Título corporativo en Inglés
  subtitle_en TEXT,               -- Subtítulo / Bajada en Inglés
  summary_en TEXT,                -- Resumen para motores de búsqueda en Inglés
  content_html_en TEXT,           -- Contenido HTML en Inglés
  category_en TEXT,               -- Categoría en Inglés
  read_time_en TEXT,              -- Tiempo de lectura en Inglés
  keywords TEXT[] DEFAULT '{}',
  key_takeaways TEXT[] DEFAULT '{}',
  read_time TEXT DEFAULT '5 min de lectura',
  word_count INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Migraciones seguras para tablas existentes
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS subtitle_en TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS summary_en TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS content_html_en TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS category_en TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS read_time_en TEXT;

ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

-- Lectura pública: artículos publicados
DROP POLICY IF EXISTS "Allow public read for published articles" ON public.blog_articles;
CREATE POLICY "Allow public read for published articles" 
  ON public.blog_articles FOR SELECT 
  USING (published = true);

-- Gestión administrativa (crear, editar, eliminar)
DROP POLICY IF EXISTS "Allow admin to manage blog articles" ON public.blog_articles;
CREATE POLICY "Allow admin to manage blog articles" 
  ON public.blog_articles FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- =========================================================================
-- 5. Tabla 'jobs': Ofertas sincronizadas de Rex+ (Solo lectura pública)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE NOT NULL,
  rex_id INTEGER,
  title TEXT NOT NULL,
  location TEXT,
  area TEXT,
  work_type TEXT,
  description TEXT,
  url TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public reads for active jobs" ON public.jobs;
CREATE POLICY "Allow public reads for active jobs" 
  ON public.jobs FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Allow admin to manage jobs" ON public.jobs;
CREATE POLICY "Allow admin to manage jobs" 
  ON public.jobs FOR ALL 
  TO authenticated 
  USING (true);

-- =========================================================================
-- 6. Tabla 'job_sync_logs': Trazabilidad de sincronización Rex+
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.job_sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT NOT NULL,
  found_count INTEGER DEFAULT 0 NOT NULL,
  created_count INTEGER DEFAULT 0 NOT NULL,
  updated_count INTEGER DEFAULT 0 NOT NULL,
  deactivated_count INTEGER DEFAULT 0 NOT NULL,
  error_details TEXT,
  is_suspicious BOOLEAN DEFAULT false NOT NULL
);

ALTER TABLE public.job_sync_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow service to insert job sync logs" ON public.job_sync_logs;
CREATE POLICY "Allow service to insert job sync logs" 
  ON public.job_sync_logs FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin to select job sync logs" ON public.job_sync_logs;
CREATE POLICY "Allow admin to select job sync logs" 
  ON public.job_sync_logs FOR SELECT 
  TO authenticated 
  USING (true);

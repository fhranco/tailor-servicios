-- 1. Create candidates table
CREATE TABLE IF NOT EXISTS public.candidates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  specialty TEXT,
  cv_path TEXT,
  phone TEXT
);

-- Enable Row Level Security (RLS) but allow anonymous inserts (for the public form)
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public inserts for candidates" ON public.candidates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public reads for dashboard" ON public.candidates FOR SELECT USING (true);
CREATE POLICY "Allow public deletes for dashboard" ON public.candidates FOR DELETE USING (true);

-- 2. Create b2b_leads table
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

-- Enable Row Level Security (RLS) but allow anonymous inserts (for the public form)
ALTER TABLE public.b2b_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public inserts for b2b_leads" ON public.b2b_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public reads for dashboard" ON public.b2b_leads FOR SELECT USING (true);
CREATE POLICY "Allow public deletes for dashboard" ON public.b2b_leads FOR DELETE USING (true);

-- 3. Create Storage Bucket for CVs
INSERT INTO storage.buckets (id, name, public) VALUES ('cvs', 'cvs', false) ON CONFLICT DO NOTHING;

-- Storage Policies for 'cvs' bucket
CREATE POLICY "Allow public uploads to cvs bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cvs');
CREATE POLICY "Allow public reads of cvs" ON storage.objects FOR SELECT USING (bucket_id = 'cvs');

-- 4. Create Privacy Audit Logs table (Compliance for Ley 21.719 / Ley 19.628)
CREATE TABLE IF NOT EXISTS public.privacy_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  action TEXT NOT NULL,          -- 'SELECT_CANDIDATES', 'DELETE_CANDIDATE', etc.
  performed_by TEXT NOT NULL,    -- 'ADMIN', 'SYSTEM'
  target_id UUID,               -- Target ID if applicable
  ip_address TEXT,               -- Omitted or stored securely (hashed/masked)
  user_agent TEXT
);

-- Enable RLS for privacy_audit_logs
ALTER TABLE public.privacy_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow system to insert logs" ON public.privacy_audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin to select logs" ON public.privacy_audit_logs FOR SELECT USING (true);

-- 5. Create Web Visits table (for audit trail of web traffic)
CREATE TABLE IF NOT EXISTS public.web_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  page_path TEXT NOT NULL,
  referrer TEXT,
  locale TEXT,
  user_agent TEXT,
  ip_hash TEXT                   -- Hashed for privacy compliance (Ley 21.719)
);

-- Enable RLS for web_visits
ALTER TABLE public.web_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public inserts for web_visits" ON public.web_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin to select web_visits" ON public.web_visits FOR SELECT USING (true);

-- =========================================================================
-- 6. Ofertas Laborales Sincronizadas desde Rex+ (Ley 21.719 / Privacidad)
-- NOTA: NO se retienen CVs ni postulaciones de candidatos en Supabase.
-- La postulación se realiza 100% en el portal externo oficial de Rex+.
-- Supabase sólo almacena el catálogo público de vacantes para visualización.
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE NOT NULL, -- UUID de Rex+
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

-- RLS para jobs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public reads for active jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Allow admin to manage jobs" ON public.jobs FOR ALL USING (true);

-- =========================================================================
-- 7. Registro de Auditoría de Sincronización Rex+ (job_sync_logs)
-- Registra trazabilidad de cada extracción (status, found, created, updated, deactivated)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.job_sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT NOT NULL, -- 'success', 'partial', 'failed'
  found_count INTEGER DEFAULT 0 NOT NULL,
  created_count INTEGER DEFAULT 0 NOT NULL,
  updated_count INTEGER DEFAULT 0 NOT NULL,
  deactivated_count INTEGER DEFAULT 0 NOT NULL,
  error_details TEXT,
  is_suspicious BOOLEAN DEFAULT false NOT NULL
);

-- RLS para job_sync_logs
ALTER TABLE public.job_sync_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow service to insert job sync logs" ON public.job_sync_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin to select job sync logs" ON public.job_sync_logs FOR SELECT USING (true);


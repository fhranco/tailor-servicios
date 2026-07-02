-- 1. Create candidates table
CREATE TABLE IF NOT EXISTS public.candidates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  consent_privacy_policy BOOLEAN NOT NULL,
  consent_data_processing BOOLEAN NOT NULL,
  cv_file_path TEXT
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
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  consent_privacy_policy BOOLEAN NOT NULL
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

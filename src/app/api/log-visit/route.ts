import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { page_path, referrer, locale } = body;

    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const normalizedIp = ip.split(',')[0].trim().toLowerCase();
    
    // HMAC-SHA256 con clave secreta server-side (Ley 21.719 - Seudonimización robusta contra ataques de diccionario)
    const hmacSecret = process.env.VISITS_HASH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'tailor-privacy-salt';
    const ipHash = crypto.createHmac('sha256', hmacSecret).update(normalizedIp).digest('hex');
    const ua = req.headers.get('user-agent') || 'unknown';

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('web_visits').insert([{
        page_path,
        referrer,
        locale,
        user_agent: ua,
        ip_hash: ipHash
      }]);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

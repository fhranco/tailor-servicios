import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { page_path, referrer, locale } = body;

    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    // Hash IP address to comply with Privacy Law (minimize raw personal data storage)
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');
    const ua = req.headers.get('user-agent') || 'unknown';

    const supabase = getSupabase();
    await supabase.from('web_visits').insert([{
      page_path,
      referrer,
      locale,
      user_agent: ua,
      ip_hash: ipHash
    }]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

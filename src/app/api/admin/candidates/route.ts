import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAuthorizedUser } from '@/lib/auth';

// Crea cliente Supabase con Service Role
function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
}

export async function GET(req: NextRequest) {
  const user = await getAuthorizedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const supabase = getAdminSupabase();

  // Log the access to candidates table (Audit requirement under Chilean Law)
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const ua = req.headers.get('user-agent') || 'unknown';
  try {
    await supabase.from('privacy_audit_logs').insert([{
      action: 'SELECT_CANDIDATES',
      performed_by: 'ADMIN',
      ip_address: ip,
      user_agent: ua
    }]);
  } catch (logErr) {
    console.error('Audit Log Error:', logErr);
  }

  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthorizedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new NextResponse('Missing ID', { status: 400 });
  }

  const supabase = getAdminSupabase();

  // Log the delete action (Audit requirement under Chilean Law)
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const ua = req.headers.get('user-agent') || 'unknown';
  try {
    await supabase.from('privacy_audit_logs').insert([{
      action: 'DELETE_CANDIDATE',
      performed_by: 'ADMIN',
      target_id: id,
      ip_address: ip,
      user_agent: ua
    }]);
  } catch (logErr) {
    console.error('Audit Log Error:', logErr);
  }

  const { error } = await supabase
    .from('candidates')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

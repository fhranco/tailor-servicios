import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAuthorizedUser, maskIp } from '@/lib/auth';

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

  // Log the access to candidates table con IP enmascarada (Ley 21.719)
  const rawIp = req.headers.get('x-forwarded-for') || 'unknown';
  const ua = req.headers.get('user-agent') || 'unknown';
  try {
    await supabase.from('privacy_audit_logs').insert([{
      action: 'SELECT_CANDIDATES',
      performed_by: user.email || 'ADMIN',
      ip_address: maskIp(rawIp),
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
    return NextResponse.json({ error: error.message }, { status: 500, headers: { 'Cache-Control': 'no-store, private' } });
  }

  // Generar URLs temporales firmadas para descarga segura de CVs históricos (válidas por 1 hora)
  // El bucket 'cvs' permanece 100% privado y ningún usuario anónimo puede acceder ni listar objetos.
  const candidatesWithSignedUrls = await Promise.all(
    (data || []).map(async (c: any) => {
      if (c.cv_path) {
        try {
          const { data: signed } = await supabase.storage
            .from('cvs')
            .createSignedUrl(c.cv_path, 3600);
          return {
            ...c,
            cv_download_url: signed?.signedUrl || ''
          };
        } catch (signErr) {
          console.error('Error generating signed CV URL:', signErr);
          return c;
        }
      }
      return c;
    })
  );

  return NextResponse.json(candidatesWithSignedUrls, {
    headers: { 'Cache-Control': 'no-store, private' }
  });
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

  // Log the delete action con IP enmascarada (Ley 21.719)
  const rawIp = req.headers.get('x-forwarded-for') || 'unknown';
  const ua = req.headers.get('user-agent') || 'unknown';
  try {
    await supabase.from('privacy_audit_logs').insert([{
      action: 'DELETE_CANDIDATE',
      performed_by: user.email || 'ADMIN',
      target_id: id,
      ip_address: maskIp(rawIp),
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

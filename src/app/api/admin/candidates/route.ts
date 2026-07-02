import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Crea cliente Supabase con Service Role
function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
}

export async function GET(req: NextRequest) {
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .order('privacy_accepted_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new NextResponse('Missing ID', { status: 400 });
  }

  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from('candidates')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

import { NextResponse } from 'next/server';
 
export async function POST() {
  return NextResponse.json(
    { error: 'Endpoint deprecado. La autenticación administrativa opera directamente con Supabase Auth.' },
    { status: 410 }
  );
}

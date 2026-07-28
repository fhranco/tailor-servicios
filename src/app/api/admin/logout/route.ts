import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.set('tailor_admin_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });
  return response;
}
